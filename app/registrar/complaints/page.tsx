'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/services/authService';
import { useRouter } from 'next/navigation';

export default function ComplaintManagement() {
  const [period, setPeriod] = useState("Select Semester Period");

  const studentComplaints = [
    { id: 1, name: "Jordan M.", about: "Student", text: "Taylor S. cheated on the midterm exam." },
    { id: 2, name: "Taylor S.", about: "Instructor", text: "Professor Miller gave me an F." },
    { id: 3, name: "Casey L.", about: "Instructor", text: "Professor Johnson was unfair in grading." },
  ];

  const teacherComplaints = [
    { id: 1, name: "Prof. Miller", text: "Taylor S. violated the academic integrity policy." },
    { id: 2, name: "Dr. Aris", text: "Jordan M. was disruptive during the lecture." },
    { id: 3, name: "Sarah W.", text: "Casey L. was unprofessional in the office hours." },
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
          <Link href="/registrar/complaints" className="p-3 rounded-md bg-slate-700 transition-colors">Complaints</Link>
          <Link href="/registrar/graduation" className="p-3 rounded-md transition-colors">Graduation Requests</Link>
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
            <h1 className="text-3xl font-bold">Complaints</h1>
            <p className="text-gray-400">Manage complaints</p>
          </div>

          <div className="text-right mt-3">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <div className="bg-gray-900 rounded-lg text-sm text-gray-500 uppercase text-right cursor-pointer">
            {period}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12 bg-gray-900 min-h-screen font-sans text-gray-100">
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Student Column */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-2">
                            <h2 className="text-xl font-bold text-blue-400 uppercase tracking-wide">Complaints by Student</h2>
                            <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                            {studentComplaints.length}
                            </span>
                        </div>
            
                        <div className="flex flex-col gap-4">
                            {studentComplaints.map((item) => (
                            <div key={item.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors shadow-xl">
                                <p className="text-gray-500 leading-relaxed mb-3">About: {item.about}</p>
                                <p className="text-gray-300 leading-relaxed mb-3">"{item.text}"</p>
                                <span className="text-xs font-semibold text-blue-400 uppercase tracking-tighter">— {item.name}</span>
                            </div>
                            ))}
                        </div>
                    </section>

                    {/* Instructor Column */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-2">
                        <h2 className="text-xl font-bold uppercase tracking-wide">Complaints by Instructor</h2>
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded-full border border-gray-600">
                            {teacherComplaints.length}
                        </span>
                        </div>

                        <div className="flex flex-col gap-4">
                        {teacherComplaints.map((item) => (
                            <div key={item.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors shadow-xl">
                            <p className="text-gray-300 leading-relaxed mb-3">"{item.text}"</p>
                            <span className="text-xs font-semibold uppercase tracking-tighter">— {item.name}</span>
                            </div>
                        ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>

      </main>
    </div>
  );
}