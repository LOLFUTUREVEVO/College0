'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/services/authService';
import { useRouter } from 'next/navigation';

export default function GraduationManagement() {
  const [period, setPeriod] = useState("Select Semester Period");

  const sampleStudentApps = [
    { name: "Karol Kopciuch", class_completed: 3, major: "Computer Science" },
    { name: "Marcus Coppa", class_completed: 8, major: "Computer Science" },
    { name: "Bogdan Hermanowski", class_completed: 8, major: "Mechanical Engineering" },
  ];

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("lastPeriod");
    if (saved) setPeriod(saved);
  }, []);

  const handleLogout = () => {
      logoutUser();
      router.push("/login");
    };

  return (
    <div className="flex font-sans bg-gray-900 w-full h-full text-white">

      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>

        <nav className="flex flex-col space-y-2">
          <Link href="/registrar" className="p-3 rounded-md transition-colors">Dashboard</Link>
          <Link href="/registrar" className="p-3 rounded-md transition-colors">Applications</Link>
          <Link href="/registrar/semester" className="p-3 rounded-md transition-colors">Semester Management</Link>
          <Link href="/registrar/complaints" className="p-3 rounded-md transition-colors">Complaints</Link>
          <Link href="/student/help" className="p-3 rounded-md bg-slate-700 transition-colors">Graduation Requests</Link>
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
            <h1 className="text-3xl font-bold">Graduation Requests</h1>
            <p className="text-gray-400 mb-10">Manage graduation requests and their statuses</p>
          </div>

          <div className="text-right mt-3">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <div className="bg-gray-900 rounded-lg text-sm text-gray-500 uppercase text-right cursor-pointer">
            {period}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 bg-slate-700 p-5 rounded-lg max-h-80 overflow-y-auto mb-8">
            {sampleStudentApps.map((student) => (
              <div key={student.name} className="flex flex-row justify-between bg-slate-900 p-4 items-center rounded-md">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Name</p>
                  <p className="font-semibold">{student.name}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Major</p>
                  <p>{student.major}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Classes Completed</p>
                  <p>{student.class_completed}</p>
                </div>
                <span className="flex flex-row gap-2">
                  <button
                    className="bg-blue-950 border border-green-600 text-green-600 p-2 px-4 rounded-md hover:bg-green-950 hover:shadow-sm hover:shadow-green-700 transition-all duration-150">
                    Allow
                  </button>
                  <button
                    className="bg-blue-950 border border-red-600 text-red-600 p-2 px-4 rounded-md hover:bg-red-950 hover:shadow-sm hover:shadow-red-700 transition-all duration-150">
                    Warn
                  </button>
                </span>
                </div>
            ))}
          </div>

      </main>
    </div>
  );
}