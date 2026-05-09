'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function SemesterManagement() {
  const [isOpen, setIsOpen] = useState(false);

  const [period, setPeriod] = useState(localStorage.getItem('lastPeriod') || "Select Semester Period");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setPeriod(newValue);
    localStorage.setItem('lastPeriod', newValue);
  };

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const TIMES = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"];

  // Sample data for the prototype
  const SCHEDULE = [
    { day: "Mon", task: "Class Setup", time: "09:00 AM", type: "setup" },
    { day: "Wed", task: "Registration Sync", time: "02:00 PM", type: "admin" },
    { day: "Fri", task: "Faculty Meeting", time: "11:00 AM", type: "meeting" },
  ];

  const sampleclasses = [
    { name :'Advanced Mathematics',
      room :'302',
      days : 'Mon/Wed/Fri',
      students : 25,
      average : 'B+'
    },
    {
      name :'Intro To Computer Science',
      room :'104',
      days : 'Mon/Wed/Fri',
      students : 50, 
      average : 'A'
    },
    {
      name :'Digital Marketing',
      room :'206',
      days : 'Tue/Thur',
      students : 28,
      average : 'B'
    },
    {
      name :'Artificial Intelligence Lab',
      room :'101',
      days : 'Tue/Thur',
      students : 19,
      average : 'C-'
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
                className="p-3 rounded-md transition-colors" 
            >
                Main Page
            </Link>
            <Link 
                href="/registrar" 
                className="p-3 rounded-md transition-colors" 
            >
                Applications
            </Link>
            <Link 
                href="/registrar/semester" 
                className="p-3 rounded-md bg-slate-700 transition-colors" 
            >
                Semester Management
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
      <main className="flex-1 p-10 "> 
        <div className="flex justify-between items-start w-full">
            <div>
            <h1 className="text-3xl font-bold">Semester Management</h1>
            <p className="text-gray-400">Manage semesters and their periods</p>
            </div>
            
            {/* TIME & SEMESTER STATUS */}
            <div className="text-right mt-3">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <select value={period} onChange={handleSelect} className="bg-gray-900 rounded-lg text-sm text-gray-500 uppercase text-right">
                <option>Set Semester Period</option>
                <option>Class Set-Up Period</option>
                <option>Course Registration Period</option>
                <option>Class Running Period</option>
                <option>Grading Period</option>
            </select>
            </div>
        </div>

        {/* CLASSES GRID */}
        <h2 className="text-2xl font-bold mt-7 mb-2">{period}</h2>
        <div className="border-b-2 border-gray-700 mb-2"></div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            {/* HEADER ROW */}
            <div className="grid grid-cols-[80px_1fr] bg-gray-900 border-b border-gray-800">
                <div className="border-r border-gray-800"></div> 
        
                <div className="grid grid-cols-7">
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

                    <div className="grid grid-cols-7 h-20">
                      {DAYS.map((day) => (
                        <div key={`${day}-${time}`} className="border-r border-gray-800 last:border-r-0 p-1 hover:bg-white/5 transition-colors group relative">
                            {/* test data */}
                            {day === "Mon" && time === "10:00 AM" && (
                            <div className="absolute inset-1 bg-blue-500/20 border-l-2 border-blue-500 rounded p-1.5 z-10">
                                <p className="text-[9px] font-bold text-blue-300 uppercase leading-none">Class Setup</p>
                                <p className="text-[8px] text-blue-200/70 mt-0.5">Room 402</p>
                            </div>
                            )}

                            <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-full text-gray-700 text-lg pointer-events-none">
                                +
                            </div>
                        </div>
                      ))}
                    </div>

                </div>
                ))}
            </div>
        </div>

      </main>
      


      {/* CHAT INTERFACE */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end">
        {isOpen && (
          <div className="w-80 h-96 bg-blue-950 rounded-lg shadow-2xl mb-4 flex flex-col overflow-hidden border border-gray-600">
            {/* Chat Header */}
            <div className="bg-blue-950 p-4 text-white font-bold flex justify-between items-center">
              <span>AI Assistant</span>
              <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">✕</button>
            </div>
            
            <div className="flex-1 p-4 text-gray-800 overflow-y-auto bg-blue-900 text-sm">
              <p className="bg-blue-100 p-2 rounded-lg mb-2 self-start">
                Hello! How can I help you today?
              </p>
            </div>

            <div className="p-3 border-t">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full p-2 border rounded-md text-white focus:outline-blue-400"
              />
            </div>
          </div>
        )}


        <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform active:scale-95">
          {isOpen ? (
            <span className="font-bold">Close Chat</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}