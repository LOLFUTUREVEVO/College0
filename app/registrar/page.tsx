'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/services/authService';
import { useRouter } from 'next/navigation';
import { getUserRole, isAuthenticated, isAccountValid } from '@/app/services/authService';

export default function Registrar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState("No Active Period");
  const router = useRouter();

  useEffect(() => {
    // Safe to access localStorage here (client-side only)
    setCurrentPeriod(localStorage.getItem('lastPeriod') || "No Active Period");

    console.log("AdminLayout: Checking authorization...");

    const checkAuth = () => {
      if (!isAuthenticated()) {
        console.log("AdminLayout: User not authenticated, redirecting to login");
        router.replace("/login");
        return;
      }

      if (!isAccountValid()) {
        console.log("AdminLayout: Account invalid, redirecting to visitors");
        router.replace("/visitors");
        return;
      }

      const role = getUserRole();
      console.log("AdminLayout: User role:", role);

      if (role !== "REGISTRAR") {
        console.log("NOT A REGISTRAR, GOING BACK!");
        router.replace("/visitors");
        return;
      }

      console.log("AdminLayout: User authorized as registrar");
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const sampleStudentApps = [
    { name: "Karol Kopciuch", gpa: 3.5, target_major: "Computer Science" },
    { name: "Marcus Coppa", gpa: 3.5, target_major: "Computer Science" },
    { name: "Bogdan Hermanowski", gpa: 3.5, target_major: "Mechanical Engineering" },
    { name: "Bogdan Hermanowski4", gpa: 3.5, target_major: "Mechanical Engineering" },
    { name: "Bogdan Hermanowski2", gpa: 3.5, target_major: "Mechanical Engineering" },
    { name: "Bogdan Hermanowski3", gpa: 3.5, target_major: "Mechanical Engineering" },
  ];

  const sampleInstructorApps = [
    { name: "Frank Hill", expertise: "Computer Science", degree: "M.S" },
    { name: "Diana Burke", expertise: "Anthropology", degree: "Ph.D" },
  ];

  return (
    <div className="flex font-sans bg-gray-900 w-full h-screen text-white">

      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>

        <nav className="flex flex-col space-y-2">
          <Link href="/visitors" className="p-3 rounded-md transition-colors">
            Main Page
          </Link>
          <Link href="" className="p-3 rounded-md bg-slate-700 transition-colors">
            Applications
          </Link>
          <Link href="/registrar/semester" className="p-3 rounded-md transition-colors">
            Semester Management
          </Link>
          <Link href="/student/help" className="p-3 rounded-md transition-colors">
            Help Page
          </Link>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-md hover:bg-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold">Application Management</h1>
            <p className="text-gray-400">Admit students and professors into the college</p>
          </div>

          <div className="text-right">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">
              {currentPeriod}
            </div>
          </div>
        </div>

        {/* STUDENT APPLICATIONS */}
        <h2 className="text-2xl font-bold mt-5 mb-2">Student Applications</h2>
        <div className="border-b-2 border-gray-700 mb-2"></div>
        <div className="grid grid-cols-1 gap-4 overflow-y-scroll bg-slate-700 p-5 rounded-lg max-h-1/3">
          {sampleStudentApps.map((student) => (
            <div key={student.name} className="flex flex-row justify-between bg-slate-900 p-4 items-center rounded-md">
              <p className="w-full">{student.name}</p>
              <p className="w-full">{student.target_major}</p>
              <p className="w-full">{student.gpa}</p>
              <span className="flex flex-row gap-2">
                <button className="bg-blue-950 border border-green-600 text-green-600 p-2 rounded-md hover:bg-green-950 hover:shadow-sm hover:shadow-green-700 transition-all duration-150">Admit</button>
                <button className="bg-blue-950 border border-red-600 text-red-600 p-2 rounded-md hover:bg-red-950 hover:shadow-sm hover:shadow-red-700 transition-all duration-150">Reject</button>
              </span>
            </div>
          ))}
        </div>

        {/* INSTRUCTOR APPLICATIONS */}
        <h2 className="text-2xl font-bold mt-5 mb-2">Professor Applications</h2>
        <div className="border-b-2 border-gray-700 mb-2"></div>
        <div className="grid grid-cols-1 gap-4 overflow-y-scroll bg-slate-700 p-5 rounded-lg max-h-1/3">
          {sampleInstructorApps.map((instructor) => (
            <div key={instructor.name} className="flex flex-row justify-between bg-slate-900 p-4 items-center rounded-md">
              <p className="w-full">{instructor.name}</p>
              <p className="w-full">{instructor.expertise}</p>
              <p className="w-full">{instructor.degree}</p>
              <span className="flex flex-row gap-2">
                <button className="bg-blue-950 border border-green-600 text-green-600 p-2 rounded-md hover:bg-green-950 hover:shadow-sm hover:shadow-green-700 transition-all duration-150">Admit</button>
                <button className="bg-blue-950 border border-red-600 text-red-600 p-2 rounded-md hover:bg-red-950 hover:shadow-sm hover:shadow-red-700 transition-all duration-150">Reject</button>
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}