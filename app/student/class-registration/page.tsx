'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCoursesStudents } from '@/app/services/courseService';

export default function SemesterManagement() {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"];

  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [obtainedClasses, setObtainedClasses] = useState<any | null>(null);
    useEffect(() =>{
            const fetchData = async () =>{
                try{
                    const pend = await getCoursesStudents();
                    setObtainedClasses(pend);
                    console.log(pend);
                } catch (error) {
                    console.error("Failed to fetch accs: ", error);
                }
            } 
            fetchData();
        }, []);
  // from database
  const sampleclasses = [
    { name : 'Advanced Chemistry',
      room : '302',
      days : 'Mon/Wed/Fri',
      time : '10:00 AM',
      instructor : 'Karen Smith',
      enrolled : 20,
      seats : 20,
      waitlisted : 5,
    },
    {
      name : 'Intro To Economics',
      room : '511',
      days : 'Mon/Wed',
      time : '2:00 PM',
      instructor : 'Katherine Johnson',
      enrolled : 30,
      seats : 35,
      waitlisted : 0,
    },
    {
      name : 'Thermodynamics Lab',
      room : '101',
      days : 'Tue/Thu',
      time : '12:00 PM',
      instructor : 'Albert Einstein',
      enrolled : 18,
      seats : 50,
      waitlisted : 0,
    }
  ];

  return (
    <div className="flex font-sans bg-gray-900 w-full h-full text-white">
      
      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>
        
        <nav className="flex flex-col space-y-2">
            <Link 
                href="/student" 
                className="p-3 rounded-md transition-colors" 
            >
                Main Page
            </Link>
            <Link 
                href="/student/class-registration" 
                className="p-3 rounded-md bg-slate-700 transition-colors" 
            >
                Class Registration
            </Link>
            <Link 
                href="/student/help" 
                className="p-3 rounded-md transition-colors" 
            >
                Help Page
            </Link>
        </nav>
        
        <div className="mt-auto">
          <button className="w-full text-left p-3 rounded-md hover:bg-red-500 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10"> 
        <div className="flex justify-between items-start w-full mb-8">
            <div>
            <h1 className="text-3xl font-bold">Class Registration</h1>
            <p className="text-gray-400">Register for this upcoming semester's classes</p>
            </div>
            
            {/* TIME & SEMESTER STATUS */}
            <div className="text-right mt-3">
                <div className="text-xl font-mono text-blue-400">10:45 AM</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">
                 Mid-Semester
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 items-start mx-auto max-w-7xl">
            {/* CALENDAR */}
            <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden">
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

                <div className="overflow-y-auto">
                    {TIMES.map((time) => (
                    <div key={time} className="grid grid-cols-[80px_1fr] border-b border-gray-800 last:border-b-0">
                
                        <div className="flex items-center justify-center border-r border-gray-800 bg-gray-900/50">
                          <span className="text-[10px] font-mono text-blue-400 font-medium">{time}</span>
                        </div>

                        <div className="grid grid-cols-5 h-28">
                          {DAYS.map((day) => (
                            <div key={`${day}-${time}`}
                            className="border-r border-gray-800 last:border-r-0 p-1 transition-colors group relative">
                                {sampleclasses.filter((course) => course.days.includes(day) && course.time === time).map((course) => (
                                    <div key={course.name} onClick={() => setSelectedClass(course)} 
                                    className="absolute inset-1 bg-blue-500/20 border-l-2 border-blue-500 rounded p-1.5 z-10 cursor-pointer hover:bg-blue-500/30 transition-colors">
                                        <p className="text-[10.5px] font-bold text-blue-300 uppercase truncate w-full leading-none">{course.name}</p>
                                        <p className="text-[9.5px] text-blue-200/70 mt-0.5">{course.instructor}</p>
                                        <p className="text-[9.5px] text-blue-200/70 mt-0.5">Room {course.room}</p>
                                        <p className="text-[9.5px] text-blue-200/70 mt-0.5">Enrolled: {course.enrolled}</p>
                                        <p className="text-[9.5px] text-blue-200/70 mt-0.5">Seats: {course.seats}</p>
                                        <p className="text-[9.5px] text-blue-200/70 mt-0.5">Waitlisted: {course.waitlisted}</p>
                                        </div>
                                ))}
                            </div>
                            ))}
                        </div>

                    </div>
                    ))}
                </div>
            </div>
            
            <div className="flex gap-4 bg-slate-700 p-5 rounded-lg w-full lg:w-[300px]">
                {selectedClass ? (
                    <div>
                        <p className="text-lg">Class Info:</p>
                        <p className="text-gray-400">{selectedClass.name}</p>
                        <p className="text-gray-400">Professor {selectedClass.instructor}</p>
                        <p className="text-gray-400">Room {selectedClass.room}</p>
                        <p className="text-gray-400">Enrolled: {selectedClass.enrolled}</p>
                        <p className="text-gray-400">Seats: {selectedClass.seats}</p>
                        <p className="text-gray-400">Waitlisted: {selectedClass.waitlisted}</p>
                        {selectedClass.seats > selectedClass.enrolled ? (
                            <button className="bg-slate-500 hover:bg-green-500 text-white text-s mt-5 mr-10 py-1 px-3 rounded cursor-pointer">
                                Register
                            </button>
                        ) : (
                            <button className="bg-slate-500 hover:bg-yellow-500 text-white text-s mt-5 mr-10 py-1 px-3 rounded cursor-pointer">
                                Join Waitlist
                            </button>
                        )}
                        <button onClick={() => setSelectedClass(false)} className="bg-slate-500 hover:bg-red-400 text-white text-s mt-5 py-1 px-3 rounded cursor-pointer">
                          Cancel
                        </button>
                    </div>
                ) : (
                    <p className="text-lg">Click cell to register for class</p>
                )}
            </div>
        </div>

      </main>
    </div>
  );
}