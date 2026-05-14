'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getUserRole,
  isAuthenticated,
  isAccountValid,
  logoutUser,
} from '@/app/services/authService';

const DASHBOARD_DESTINATIONS = [
  {
    href: '/registrar/applications',
    title: 'Applications',
    description: 'Review and admit student and instructor applicants.',
    accent: 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400/60',
  },
  {
    href: '/registrar/semester',
    title: 'Semester management',
    description: 'Set semester periods, classes, schedules, and capacity.',
    accent: 'border-blue-500/40 bg-blue-950/20 hover:border-blue-400/60',
  },
  {
    href: '/registrar/warn',
    title: 'Issue warnings',
    description: 'Record registrar warnings for students, instructors, and visitors.',
    accent: 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400/60',
  },
  {
    href: '/visitors',
    title: 'Main page',
    description: 'View the public college site and visitor information.',
    accent: 'border-violet-500/40 bg-violet-950/20 hover:border-violet-400/60',
  },
] as const;

export default function Registrar() {
  const router = useRouter();
  const [currentPeriod, setCurrentPeriod] = useState('No Active Period');

  useEffect(() => {
    const savedPeriod = localStorage.getItem('lastPeriod');
    if (savedPeriod) setCurrentPeriod(savedPeriod);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    if (!isAccountValid()) {
      router.replace('/visitors');
      return;
    }
    if (getUserRole() !== 'REGISTRAR') {
      router.replace('/visitors');
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
    <div className="flex font-sans bg-gray-900 w-full min-h-screen text-white">
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0 sticky top-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>
        <nav className="flex flex-col space-y-2">
<<<<<<< HEAD
          <Link href="/registrar" className="p-3 rounded-md bg-slate-700 transition-colors">Dashboard</Link>
          <Link href="/registrar/applications" className="p-3 rounded-md transition-colors">Applications</Link>
          <Link href="/registrar/semester" className="p-3 rounded-md transition-colors">Semester Management</Link>
          <Link href="/registrar/complaints" className="p-3 rounded-md transition-colors">Complaints</Link>
          <Link href="/registrar/graduation" className="p-3 rounded-md transition-colors">Graduation Requests</Link>
=======
            <Link 
                href="/visitors" 
                className="p-3 rounded-md transition-colors" 
            >
                Main Page
            </Link>
            <Link 
                href="" 
                className="p-3 rounded-md bg-slate-700 transition-colors" 
            >
                Applications
            </Link>
            <Link 
                href="/registrar/semester" 
                className="p-3 rounded-md transition-colors" 
            >
                Semester Management
            </Link>
            <Link 
                href="/student/help" 
                className="p-3 rounded-md transition-colors" 
            >
                Help Page
            </Link>
>>>>>>> fab11bcc4603b51a23e29d86b2cf5d166c267623
        </nav>
        <div className="mt-auto">
          <button
            type="button"
            className="w-full text-left p-3 rounded-md hover:bg-red-500 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Registrar dashboard</h1>
            <p className="text-gray-400 mt-1 max-w-xl">
              Choose where to go next. Application review and semester tools live on their own pages.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">{currentPeriod}</div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 max-w-5xl">
          {DASHBOARD_DESTINATIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl border p-6 transition-colors ${item.accent}`}
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-blue-300">Open →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
