'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/services/authService';
import { useRouter } from 'next/navigation';

interface Course {
  name: string;
  room: string;
  days: string;
  time: string;
  instructor: string;
  enrolled: number;
  seats: number;
  waitlisted: number;
}

interface BackendCourse {
  courseId: number;
  courseNum: number;
  title: string;
  roomNumber: string;
  daysOfWeek: string;
  startTime: string;
  durationMinutes: number;
  semester: string;
  instructor: { userId: number; firstName: string; lastName: string } | null;
  capacity: number;
}

// Form state — mirrors what we POST, plus courseId to detect edit vs create
interface ClassFormData {
  courseId?: number;
  courseNum: number;
  name: string;
  room: string;
  days: string[];      // e.g. ["M","W","F"]
  time: string;        // 24-hr "HH:00"
  instructorId: number | "";
  semester: string;    // e.g. "Fall 2025"
  seats: number;
  // read-only display fields
  enrolled: number;
  waitlisted: number;
}

const HOUR_OPTIONS = [
  { label: "9:00 AM",  value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "1:00 PM",  value: "13:00" },
  { label: "2:00 PM",  value: "14:00" },
  { label: "3:00 PM",  value: "15:00" },
];

const DAY_CODES: { label: string; code: string }[] = [
  { label: "Mon", code: "M" },
  { label: "Tue", code: "T" },
  { label: "Wed", code: "W" },
  { label: "Thu", code: "R" },
  { label: "Fri", code: "F" },
];

const formatTime = (timeStr: string): string => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
};

// Convert "9:00 AM" display time back to "09:00" 24-hr value for matching
const displayTimeTo24 = (displayTime: string): string => {
  const opt = HOUR_OPTIONS.find((o) => o.label === displayTime);
  return opt?.value ?? "";
};

const mapCourse = (c: BackendCourse): Course => ({
  name: c.title,
  room: c.roomNumber,
  days: c.daysOfWeek,
  time: formatTime(c.startTime),
  instructor: c.instructor
    ? `${c.instructor.firstName} ${c.instructor.lastName}`
    : "TBA",
  enrolled: 0,
  seats: c.capacity,
  waitlisted: 0,
});

const dayMatches = (courseDays: string, calendarDay: string): boolean => {
  const map: { [key: string]: string } = {
    Mon: "M", Tue: "T", Wed: "W", Thu: "R", Fri: "F",
  };
  return courseDays?.includes(map[calendarDay]) ?? false;
};

// ─── API helpers ────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem("jwt_token");

const fetchCourses = async (): Promise<Course[]> => {
  const res = await fetch("http://localhost:8080/registrar/courses", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch courses");
  const data: BackendCourse[] = await res.json();
  return data.map(mapCourse);
};




/**
 * POST /registrar/courses
 * Matches the Course entity exactly:
 *   - instructor → { instructorId } (ManyToOne FK)
 *   - durationMinutes → always 60 (1-hour classes)
 *   - semester → "Fall 2025" style string
 */
const createCourse = async (form: ClassFormData): Promise<BackendCourse> => {
  const body = {
    courseNum: form.courseNum,
    title: form.name,
    roomNumber: form.room,
    daysOfWeek: form.days.join(""),   // ["M","W","F"] → "MWF"
    startTime: form.time,              // "09:00"
    durationMinutes: 60,
    semester: form.semester,
    instructor: { instructorId: form.instructorId },
    capacity: form.seats,
  };

  const res = await fetch("http://localhost:8080/registrar/courses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create course: ${res.status} ${text}`);
  }
  return res.json();
};

/**
 * PUT /registrar/courses/:id
 * Same body shape as createCourse.
 */
const updateCourse = async (form: ClassFormData): Promise<BackendCourse> => {
  const body = {
    courseNum: form.courseNum,
    title: form.name,
    roomNumber: form.room,
    daysOfWeek: form.days.join(""),
    startTime: form.time,
    durationMinutes: 60,
    semester: form.semester,
    instructor: { instructorId: form.instructorId },
    capacity: form.seats,
  };

  const res = await fetch(`http://localhost:8080/registrar/courses/${form.courseId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update course: ${res.status} ${text}`);
  }
  return res.json();
};


// ─── Default form state ──────────────────────────────────────────────────────

const emptyForm = (): ClassFormData => ({
  courseNum: 0,
  name: "",
  room: "",
  days: [],
  time: "09:00",
  instructorId: "",
  semester: "",
  seats: 0,
  enrolled: 0,
  waitlisted: 0,
});

// ─── Component ───────────────────────────────────────────────────────────────

export default function SemesterManagement() {
  const [period, setPeriod] = useState("Select Semester Period");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [classData, setClassData] = useState<ClassFormData>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const TIMES = HOUR_OPTIONS.map((o) => o.label);

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("lastPeriod");
    if (saved) setPeriod(saved);

    fetchCourses()
      .then(setCourses)
      .catch((e) => console.error("Failed to load courses:", e));
  }, []);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setPeriod(newValue);
    localStorage.setItem("lastPeriod", newValue);
  };

  const handleCellClick = (day: string, displayTime: string) => {
    if (period !== "Class Set-Up Period") return;
    const existing = courses.find(
      (c) => dayMatches(c.days, day) && c.time === displayTime
    );
    setSaveError(null);
    setIsEditingClass(true);

    if (existing) {
      setClassData({
        courseNum: 0,                            // not stored on Course display type
        name: existing.name,
        room: existing.room,
        days: existing.days.split(""),           // "MWF" → ["M","W","F"]
        time: displayTimeTo24(existing.time),    // "9:00 AM" → "09:00"
        instructorId: "",                        // can't recover from display name
        semester: "",
        seats: existing.seats,
        enrolled: existing.enrolled,
        waitlisted: existing.waitlisted,
      });
    } else {
      setClassData({
        ...emptyForm(),
        time: displayTimeTo24(displayTime),
      });
    }
  };

  const toggleDay = (code: string) => {
    setClassData((prev) => ({
      ...prev,
      days: prev.days.includes(code)
        ? prev.days.filter((d) => d !== code)
        : [...prev.days, code],
    }));
  };

  const handleLogout = () => {
      logoutUser();
      router.push("/login");
    };

  const handleSave = async () => {
    setSaveError(null);

    // Basic validation
    if (!classData.name.trim()) return setSaveError("Class name is required.");
    if (!classData.room.trim()) return setSaveError("Room is required.");
    if (classData.days.length === 0) return setSaveError("Select at least one day.");
    if (!classData.instructorId) return setSaveError("Instructor ID is required.");
    if (!classData.courseNum) return setSaveError("Course number is required.");
    if (!classData.semester.trim()) return setSaveError("Semester is required.");
    if (classData.seats <= 0) return setSaveError("Seats must be greater than 0.");

    setIsSaving(true);
    try {
      if (classData.courseId) {
        await updateCourse(classData);
      } else {
        await createCourse(classData);
      }
      // Refresh the calendar from the server
      const updated = await fetchCourses();
      setCourses(updated);
      setIsEditingClass(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex font-sans bg-gray-900 w-full h-full text-white">

      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>

        <nav className="flex flex-col space-y-2">
          <Link href="/registrar" className="p-3 rounded-md transition-colors">Dashboard</Link>
          <Link href="/registrar" className="p-3 rounded-md transition-colors">Applications</Link>
          <Link href="/registrar/semester" className="p-3 rounded-md bg-slate-700 transition-colors">Semester Management</Link>
          <Link href="/registrar/complaints" className="p-3 rounded-md transition-colors">Complaints</Link>
          <Link href="/student/help" className="p-3 rounded-md transition-colors">Graduation Requests</Link>
        </nav>

        <div className="mt-auto">
          <button onClick={handleLogout}
            className="w-full text-left p-3 rounded-md hover:bg-red-500 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-start w-full">
          <div>
            <h1 className="text-3xl font-bold">Semester Management</h1>
            <p className="text-gray-400">Manage semesters and their periods</p>
          </div>

          <div className="text-right mt-3">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <select
              value={period}
              onChange={handlePeriodChange}
              className="bg-gray-900 rounded-lg text-sm text-gray-500 uppercase text-right cursor-pointer"
            >
              <option>Set Semester Period</option>
              <option>Class Set-Up Period</option>
              <option>Course Registration Period</option>
              <option>Class Running Period</option>
              <option>Grading Period</option>
            </select>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-7 mb-2">{period}</h2>
        <div className="border-b-2 border-gray-700 mb-2"></div>

        {period !== "Grading Period" && period !== "Set Semester Period" ? (
          <div>
            {period === "Class Set-Up Period" ? (
              <p className="text-gray-400 mb-5">Set up classes for the upcoming semester</p>
            ) : period === "Course Registration Period" ? (
              <p className="text-gray-400 mb-5">Students can now register for classes in this finalized schedule</p>
            ) : (
              <p className="text-gray-400 mb-5">Classes are in session and the special registration period has begun</p>
            )}

            <div className="flex flex-col lg:flex-row gap-3 items-start mx-auto max-w-7xl">
              <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden">
                {/* CALENDAR HEADER */}
                <div className="grid grid-cols-[80px_1fr] bg-gray-900 border-b border-gray-800">
                  <div className="border-r border-gray-800"></div>
                  <div className="grid grid-cols-5">
                    {DAYS.map((day) => (
                      <div key={day} className="py-4 text-center border-r border-gray-800 last:border-r-0">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CALENDAR BODY */}
                <div className="overflow-y-auto">
                  {TIMES.map((time) => (
                    <div key={time} className="grid grid-cols-[80px_1fr] border-b border-gray-800 last:border-b-0">
                      <div className="flex items-center justify-center border-r border-gray-800 bg-gray-900/50">
                        <span className="text-[10px] font-mono text-blue-400 font-medium">{time}</span>
                      </div>

                      <div className="grid grid-cols-5 h-28">
                        {DAYS.map((day) => (
                          <div
                            key={`${day}-${time}`}
                            onClick={() => handleCellClick(day, time)}
                            className={
                              period === "Class Set-Up Period"
                                ? "border-r border-gray-800 last:border-r-0 p-1 hover:bg-white/5 transition-colors group relative cursor-pointer"
                                : "border-r border-gray-800 last:border-r-0 p-1 transition-colors group relative"
                            }
                          >
                            {courses.map((course) => {
                              if (dayMatches(course.days, day) && course.time === time) {
                                return (
                                  <div
                                    key={course.name}
                                    className="absolute inset-1 bg-blue-500/20 border-l-2 border-blue-500 rounded p-1.5 z-10 pointer-events-none"
                                  >
                                    <p className="text-[10.5px] font-bold text-blue-300 uppercase truncate w-full leading-none">{course.name}</p>
                                    <p className="text-[9.5px] text-blue-200/70 mt-0.5">{course.instructor}</p>
                                    <p className="text-[9.5px] text-blue-200/70 mt-0.5">Room {course.room}</p>
                                    {(period === "Course Registration Period" || period === "Class Running Period") && (
                                      <p className="text-[9.5px] text-blue-200/70 mt-0.5">Enrolled: {course.enrolled}</p>
                                    )}
                                    <p className="text-[9.5px] text-blue-200/70 mt-0.5">Seats: {course.seats}</p>
                                    {period === "Course Registration Period" && (
                                      <p className="text-[9.5px] text-blue-200/70 mt-0.5">Waitlisted: {course.waitlisted}</p>
                                    )}
                                  </div>
                                );
                              }
                            })}
                            {period === "Class Set-Up Period" && (
                              <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-full text-gray-700 text-lg">
                                +
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADD / EDIT CLASS PANEL */}
              {period === "Class Set-Up Period" && (
                <div className="flex gap-4 bg-slate-700 p-5 rounded-lg w-full lg:w-[300px]">
                  {!isEditingClass ? (
                    <p className="text-lg">Click a cell to add or change a class</p>
                  ) : (
                    <div className="w-full space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-lg font-semibold">
                        {classData.courseId ? "Edit Class" : "New Class"}
                      </p>

                      {/* Course Number */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Course Number *</label>
                        <input
                          type="number"
                          placeholder="e.g. 101"
                          min={1}
                          value={classData.courseNum || ""}
                          className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                          onChange={(e) => setClassData({ ...classData, courseNum: Number(e.target.value) })}
                        />
                      </div>

                      {/* Class Name */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Class Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Introduction to Biology"
                          value={classData.name}
                          className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                          onChange={(e) => setClassData({ ...classData, name: e.target.value })}
                        />
                      </div>

                      {/* Room */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Room *</label>
                        <input
                          type="text"
                          placeholder="e.g. B204"
                          value={classData.room}
                          className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                          onChange={(e) => setClassData({ ...classData, room: e.target.value })}
                        />
                      </div>

                      {/* Days — multi-select checkboxes */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Days *</label>
                        <div className="flex gap-1 flex-wrap">
                          {DAY_CODES.map(({ label, code }) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => toggleDay(code)}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                                classData.days.includes(code)
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-800 text-gray-400 hover:bg-slate-600"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Start Time */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Start Time * <span className="text-gray-500">(1 hr duration)</span>
                        </label>
                        <select
                          value={classData.time}
                          onChange={(e) => setClassData({ ...classData, time: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {HOUR_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label} – {HOUR_OPTIONS[HOUR_OPTIONS.indexOf(o) + 1]?.label ?? "end"}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Instructor ID */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Instructor ID *</label>
                        <input
                          type="number"
                          placeholder="e.g. 42"
                          min={1}
                          value={classData.instructorId || ""}
                          className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                          onChange={(e) => setClassData({ ...classData, instructorId: Number(e.target.value) })}
                        />
                      </div>

                      {/* Semester */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Semester *</label>
                        <input
                          type="text"
                          placeholder="e.g. Fall 2025"
                          value={classData.semester}
                          className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                          onChange={(e) => setClassData({ ...classData, semester: e.target.value })}
                        />
                      </div>

                      {/* Seats */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Seat Capacity *</label>
                        <input
                          type="number"
                          placeholder="e.g. 30"
                          min={1}
                          value={classData.seats || ""}
                          className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                          onChange={(e) => setClassData({ ...classData, seats: Number(e.target.value) })}
                        />
                      </div>

                      {/* Error */}
                      {saveError && (
                        <p className="text-red-400 text-xs">{saveError}</p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded transition-colors"
                        >
                          {isSaving ? "Saving…" : classData.courseId ? "Update Class" : "Add Class"}
                        </button>
                        <button
                          onClick={() => { setIsEditingClass(false); setSaveError(null); }}
                          className="text-slate-400 text-[10px] hover:text-white px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : period === "Grading Period" ? (
          <div>
            <p className="text-gray-400 mb-5">The current status on grading for this semester's classes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div
                  key={course.name}
                  className="p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-400">{course.instructor}</p>
                  <p className="text-sm text-gray-400">{course.enrolled} students enrolled</p>
                  <p className="text-sm text-gray-400">0 students graded</p>
                  <p className="text-sm text-gray-400">Class GPA: N/A</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No semester period selected</p>
        )}
      </main>
    </div>
  );
}