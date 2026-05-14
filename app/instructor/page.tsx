'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Instructor() {
  // from database
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
    <div className="flex font-sans bg-gray-900 w-full h-screen text-white">
      
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
                href="/student/class-registration" 
                className="p-3 rounded-md bg-slate-700 transition-colors" 
            >
                Class Information
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
        <div className="flex justify-between items-end mb-8">
            <div>
            <h1 className="text-3xl font-bold">Instructor Page</h1>
            <p className="text-gray-400">Here are the classes you are teaching</p>
            </div>
            
            {/* TIME & SEMESTER STATUS */}
            <div className="text-right">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">
                 Grading-Period
            </div>
            </div>
        </div>

        {/* CLASSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-scroll">
            {sampleclasses.map((course) => (
            <div key={course.name} className="p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-colors">
                <span className='flex flex-row justify-between'>
                  <h3 className="text-lg font-semibold mb-1">{course.name}</h3>
                </span>
                <p className="text-sm text-gray-400">Room {course.room} • {course.days}</p>
                <div className="text-sm flex flex-col gap-2 mt-5">
                  <Link href="" className="block bg-blue-500 p-5 rounded-lg">Class List</Link>
                  <span className="flex flex-row gap-3 w-full">
                    <Link href="" className=" block bg-orange-500 p-5 rounded-lg w-full text-center">Enter Grades</Link>
                    <div className="w-full block bg-slate-800 p-5 rounded-lg border border-green-300 text-green-300 hover:bg-green-950/50 hover:shadow-sm hover:shadow-green-500 transition-all duration-150 text-center">Average: {course.average}</div>
                    <Link href="" className="w-full block bg-red-500 p-5 rounded-lg text-center">File Complaint</Link>
                  </span>
                </div>
            </div>
            ))}
        </div>

      </main>
    </div>
  );
}