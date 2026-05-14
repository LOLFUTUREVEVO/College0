'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Student() {
  return (
    <div className="flex font-sans bg-gray-900 w-full h-screen text-white">
      
      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>
        
        <nav className="flex flex-col space-y-2">
            <Link 
                href="/student" 
                className="p-3 rounded-md bg-slate-700 transition-colors" 
            >
                Main Page
            </Link>
            <Link 
                href="/student/class-registration" 
                className="p-3 rounded-md transition-colors" 
            >
                Class Registration
            </Link>
            <Link 
                href="/student/help" 
                className="p-3 rounded-md transition-colors" 
            >
                Complaints/Reviews
            </Link>
            <Link 
                href="/student/help" 
                className="p-3 rounded-md transition-colors" 
            >
                Apply for Graduation
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
        <div className="flex justify-between items-end mb-8">
            <div>
            <h1 className="text-3xl font-bold">Student Page</h1>
            <p className="text-gray-400">Here's what's on your itinerary</p>
            </div>
            
            {/* TIME & SEMESTER STATUS */}
            <div className="text-right">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">
                 Mid-Semester
            </div>
            </div>
        </div>

        {/* CLASSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Advanced Mathematics', 'Computer Science 101', 'Digital Marketing', 'Ethics in AI'].map((course) => (
            <div key={course} className="p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-colors">
                <h3 className="text-lg font-semibold mb-1">{course}</h3>
                <p className="text-sm text-gray-400">Professor Jie Wei • Room 302 • Mon/Wed/Fri</p>
            </div>
            ))}
        </div>

      </main>
    </div>
  );
}