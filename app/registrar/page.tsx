'use client'
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserRole, isAuthenticated, isAccountValid, logoutUser } from '@/app/services/authService';

export default function RegistrarHome() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    if (!isAccountValid()) { router.replace("/visitors"); return; }
    if (getUserRole() !== "REGISTRAR") { router.replace("/visitors"); return; }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const tools = [
    {
      title: "Application Management",
      description: "Review and admit students and professors into the college",
      href: "/registrar/applications",
      icon: "📋",
    },
    {
      title: "Semester Management",
      description: "Set up courses, manage schedules, and control semester periods",
      href: "/registrar/semester",
      icon: "📅",
    },
  ];

  return (
    <div className="flex font-sans bg-gray-900 w-full h-screen text-white">
      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/registrar" className="p-3 rounded-md bg-slate-700 transition-colors">Dashboard</Link>
          <Link href="/registrar/applications" className="p-3 rounded-md transition-colors">Applications</Link>
          <Link href="/registrar/semester" className="p-3 rounded-md transition-colors">Semester Management</Link>
          <Link href="/student/help" className="p-3 rounded-md transition-colors">Help Page</Link>
        </nav>
        <div className="mt-auto">
          <button onClick={handleLogout} className="w-full text-left p-3 rounded-md hover:bg-red-500 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold">Registrar Dashboard</h1>
            <p className="text-gray-400">Select a tool to get started</p>
          </div>
          <div className="text-xl font-mono text-blue-400">College One</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group p-8 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-all duration-200"
            >
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h2>
              <p className="text-gray-400 text-sm">{tool.description}</p>
              <div className="mt-6 text-blue-500 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}