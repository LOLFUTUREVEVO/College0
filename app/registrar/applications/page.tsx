'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserRole, isAuthenticated, isAccountValid, logoutUser } from '@/app/services/authService';

interface StudentApplication {
  name: string;
  gpa: number;
  target_major: string;
}

interface InstructorApplication {
  name: string;
  expertise: string;
  degree: string;
}

const sampleStudentApps: StudentApplication[] = [
  { name: "Karol Kopciuch", gpa: 3.5, target_major: "Computer Science" },
  { name: "Marcus Coppa", gpa: 3.6, target_major: "Computer Science" },
  { name: "Bogdan Hermanowski", gpa: 3.5, target_major: "Mechanical Engineering" },
  { name: "Bogdan Hermanowski4", gpa: 3.9, target_major: "Mechanical Engineering" },
  { name: "Bogdan Hermanowski2", gpa: 4.0, target_major: "Mechanical Engineering" },
  { name: "Bogdan Hermanowski3", gpa: 3.5, target_major: "Mechanical Engineering" },
];

const sampleInstructorApps: InstructorApplication[] = [
  { name: "Frank Hill", expertise: "Computer Science", degree: "M.S" },
  { name: "Diana Burke", expertise: "Anthropology", degree: "Ph.D" },
];

export default function ApplicationManagement() {
  const router = useRouter();
  const [currentPeriod, setCurrentPeriod] = useState("No Active Period");
  const [studentApps, setStudentApps] = useState<StudentApplication[]>(sampleStudentApps);
  const [instructorApps, setInstructorApps] = useState<InstructorApplication[]>(sampleInstructorApps);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    setCurrentPeriod(localStorage.getItem('lastPeriod') || "No Active Period");
    if (!isAuthenticated()) { router.replace("/login"); return; }
    if (!isAccountValid()) { router.replace("/visitors"); return; }
    if (getUserRole() !== "REGISTRAR") { router.replace("/visitors"); return; }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const notify = (message: string) => {
    setActionMessage(message);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleStudentAction = (name: string, action: "admit" | "reject") => {
    setStudentApps(prev => prev.filter(s => s.name !== name));
    notify(`${name} has been ${action === "admit" ? "admitted" : "rejected"}.`);
  };

  const handleInstructorAction = (name: string, action: "admit" | "reject") => {
    setInstructorApps(prev => prev.filter(i => i.name !== name));
    notify(`${name} has been ${action === "admit" ? "admitted" : "rejected"}.`);
  };

  return (
    <div className="flex font-sans bg-gray-900 w-full h-screen text-white">

      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/registrar" className="p-3 rounded-md transition-colors">Dashboard</Link>
          <Link href="/registrar/applications" className="p-3 rounded-md bg-slate-700 transition-colors">Applications</Link>
          <Link href="/registrar/semester" className="p-3 rounded-md transition-colors">Semester Management</Link>
          <Link href="/registrar/warn" className="p-3 rounded-md transition-colors">Issue warnings</Link>
        </nav>
        <div className="mt-auto">
          <button onClick={handleLogout} className="w-full text-left p-3 rounded-md hover:bg-red-500 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold">Application Management</h1>
            <p className="text-gray-400">Admit students and professors into the college</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">{currentPeriod}</div>
          </div>
        </div>

        {/* ACTION FEEDBACK */}
        {actionMessage && (
          <div className="mb-6 p-3 bg-blue-900 border border-blue-600 rounded-lg text-blue-200 text-sm">
            {actionMessage}
          </div>
        )}

        {/* STUDENT APPLICATIONS */}
        <div className="flex items-center gap-3 mt-5 mb-2">
          <h2 className="text-2xl font-bold">Student Applications</h2>
          <span className="text-sm text-gray-400 bg-slate-700 px-2 py-0.5 rounded-full">
            {studentApps.length} pending
          </span>
        </div>
        <div className="border-b-2 border-gray-700 mb-4"></div>

        {studentApps.length === 0 ? (
          <div className="bg-slate-700 p-8 rounded-lg text-center text-gray-400 mb-8">
            No pending student applications
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 bg-slate-700 p-5 rounded-lg max-h-80 overflow-y-auto mb-8">
            {studentApps.map((student) => (
              <div key={student.name} className="flex flex-row justify-between bg-slate-900 p-4 items-center rounded-md">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Name</p>
                  <p className="font-semibold">{student.name}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Major</p>
                  <p>{student.target_major}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">GPA</p>
                  <p>{student.gpa}</p>
                </div>
                <span className="flex flex-row gap-2">
                  <button
                    onClick={() => handleStudentAction(student.name, "admit")}
                    className="bg-blue-950 border border-green-600 text-green-600 p-2 px-4 rounded-md hover:bg-green-950 hover:shadow-sm hover:shadow-green-700 transition-all duration-150">
                    Admit
                  </button>
                  <button
                    onClick={() => handleStudentAction(student.name, "reject")}
                    className="bg-blue-950 border border-red-600 text-red-600 p-2 px-4 rounded-md hover:bg-red-950 hover:shadow-sm hover:shadow-red-700 transition-all duration-150">
                    Reject
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* INSTRUCTOR APPLICATIONS */}
        <div className="flex items-center gap-3 mt-5 mb-2">
          <h2 className="text-2xl font-bold">Professor Applications</h2>
          <span className="text-sm text-gray-400 bg-slate-700 px-2 py-0.5 rounded-full">
            {instructorApps.length} pending
          </span>
        </div>
        <div className="border-b-2 border-gray-700 mb-4"></div>

        {instructorApps.length === 0 ? (
          <div className="bg-slate-700 p-8 rounded-lg text-center text-gray-400">
            No pending professor applications
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 bg-slate-700 p-5 rounded-lg max-h-80 overflow-y-auto">
            {instructorApps.map((instructor) => (
              <div key={instructor.name} className="flex flex-row justify-between bg-slate-900 p-4 items-center rounded-md">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Name</p>
                  <p className="font-semibold">{instructor.name}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Expertise</p>
                  <p>{instructor.expertise}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Degree</p>
                  <p>{instructor.degree}</p>
                </div>
                <span className="flex flex-row gap-2">
                  <button
                    onClick={() => handleInstructorAction(instructor.name, "admit")}
                    className="bg-blue-950 border border-green-600 text-green-600 p-2 px-4 rounded-md hover:bg-green-950 hover:shadow-sm hover:shadow-green-700 transition-all duration-150">
                    Admit
                  </button>
                  <button
                    onClick={() => handleInstructorAction(instructor.name, "reject")}
                    className="bg-blue-950 border border-red-600 text-red-600 p-2 px-4 rounded-md hover:bg-red-950 hover:shadow-sm hover:shadow-red-700 transition-all duration-150">
                    Reject
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}