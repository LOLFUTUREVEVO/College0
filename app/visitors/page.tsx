'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Visitor() {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"];

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
            href="/visitors" 
            className="p-3 rounded-md bg-slate-700 transition-colors" 
          >
            Visitors
          </Link>
          <Link
            href="/login"
            className="p-3 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-center"
          >
            Back to login
          </Link>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10"> 
        <h1 className="text-3xl font-bold mb-4">Welcome to the City College of New York!</h1>
        <p className="text-gray-400">
          Here you can view basic information about the college. Click the button in the bottom right corner to ask for help from our AI assistant.
        </p>

        {/* CLASSES */}
        <h2 className="text-2xl font-bold mt-7 mb-2">Classes Offered Next Semester</h2>
        <div className="border-b-2 border-gray-700 mb-2"></div>
        <div className="flex flex-col lg:flex-row gap-3 items-start mx-auto max-w-7xl">
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
                          <div
                            key={`${day}-${time}`}
                            className="border-r border-gray-800 last:border-r-0 p-1 transition-colors group relative">
                              {sampleclasses.filter((course) => course.days.includes(day) && course.time === time).map((course) => (
                                    <div key={course.name}
                                    className="absolute inset-1 bg-blue-500/20 border-l-2 border-blue-500 rounded p-1.5 z-10 transition-colors">
                                      <p className="text-[10.5px] font-bold text-blue-300 uppercase truncate w-full leading-none">{course.name}</p>
                                      <p className="text-[9.5px] text-blue-200/70 mt-0.5">Professor {course.instructor}</p>
                                      <p className="text-[9.5px] text-blue-200/70 mt-0.5">Room {course.room}</p>
                                      <p className="text-[9.5px] text-blue-200/70 mt-0.5">Seats: {course.seats}</p>
                                    </div>
                                ))}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        </div>
        
        <h1 className="text-xl mt-4">Apply <a href="/signup" className="text-blue-400 hover:underline">here</a>!</h1>
      </main>
    </div>
  );
}