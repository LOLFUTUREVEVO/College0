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

/** Roles that may receive registrar warnings (REGISTRAR excluded). Matches backend `UserAccount.Role`. */
const NON_REGISTRAR_ROLES = [
  {
    key: 'VISITOR',
    title: 'Visitor',
    description:
      'Unauthenticated or prospective users browsing public information before matriculation.',
  },
  {
    key: 'STUDENT',
    title: 'Student',
    description:
      'Matriculated students enrolled in courses; subject to academic and conduct policies.',
  },
  {
    key: 'INSTRUCTOR',
    title: 'Instructor',
    description:
      'Faculty teaching sections; may receive warnings for grading, conduct, or course management.',
  },
] as const;

type WarnableRole = (typeof NON_REGISTRAR_ROLES)[number]['key'];

interface WarnableAccount {
  id: string;
  name: string;
  username: string;
  role: WarnableRole;
}

const MOCK_WARNABLE_ACCOUNTS: WarnableAccount[] = [
  { id: 'v1', name: 'Alex Rivera', username: 'arivera_guest', role: 'VISITOR' },
  { id: 'v2', name: 'Sam Lee', username: 'slee_visitor', role: 'VISITOR' },
  { id: 's1', name: 'Jordan Kim', username: 'jkim01', role: 'STUDENT' },
  { id: 's2', name: 'Taylor Morgan', username: 'tmorgan', role: 'STUDENT' },
  { id: 's3', name: 'Riley Chen', username: 'rchen', role: 'STUDENT' },
  { id: 'i1', name: 'Dr. Pat O’Neil', username: 'poneil', role: 'INSTRUCTOR' },
  { id: 'i2', name: 'Dr. Jamie Wu', username: 'jwu', role: 'INSTRUCTOR' },
];

export default function RegistrarWarnPage() {
  const router = useRouter();
  const [currentPeriod, setCurrentPeriod] = useState('No Active Period');
  const [banner, setBanner] = useState('');
  const [warningsByUserId, setWarningsByUserId] = useState<Record<string, number>>({});

  useEffect(() => {
    setCurrentPeriod(localStorage.getItem('lastPeriod') || 'No Active Period');
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
    router.push('/login');
  };

  const notify = (message: string) => {
    setBanner(message);
    window.setTimeout(() => setBanner(''), 4000);
  };

  const warnAccount = (account: WarnableAccount) => {
    const current = warningsByUserId[account.id] ?? 0;
    if (current >= 3) return;

    const isThirdWarning = current === 2;
    const message = isThirdWarning
      ? `This will be the 3rd official registrar warning for ${account.name} (@${account.username}) as ${account.role}. ` +
        `They will be removed from the system with this warning: Proceed?`
      : `Record an official registrar warning for ${account.name} (@${account.username}) as ${account.role}?`;

    const ok = window.confirm(message);
    if (!ok) return;

    const next = current + 1;
    setWarningsByUserId((prev) => ({
      ...prev,
      [account.id]: next,
    }));

    if (next >= 3) {
      notify(
        `${account.name} received their 3rd warning and has been removed from the active directory (name hidden).`
      );
    } else {
      notify(`Warning recorded for ${account.name} (${account.role}).`);
    }
  };

  const accountsForRole = (role: WarnableRole) =>
    MOCK_WARNABLE_ACCOUNTS.filter((a) => a.role === role);

  return (
    <div className="flex font-sans bg-gray-900 w-full min-h-screen text-white">
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0 sticky top-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/registrar" className="p-3 rounded-md transition-colors">
            Dashboard
          </Link>
          <Link href="/registrar/applications" className="p-3 rounded-md transition-colors">
            Applications
          </Link>
          <Link href="/registrar/semester" className="p-3 rounded-md transition-colors">
            Semester Management
          </Link>
          <Link href="/registrar/warn" className="p-3 rounded-md bg-slate-700 transition-colors">
            Issue warnings
          </Link>
          <Link href="/visitors" className="p-3 rounded-md transition-colors">
            Main Page
          </Link>
        </nav>
        <div className="mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-md hover:bg-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold">Issue warnings</h1>
            <p className="text-gray-400 mt-1 max-w-2xl">
              Registrars may issue formal warnings to visitors, students, and instructors. Registrar
              accounts are not listed here. After three warnings, the account is treated as removed.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">{currentPeriod}</div>
          </div>
        </div>

        {banner && (
          <div className="mb-6 rounded-lg border border-teal-600/50 bg-teal-950/40 px-4 py-3 text-teal-100 text-sm">
            {banner}
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Non-registrar roles</h2>
          <p className="text-gray-400 text-sm mb-4">
            These are the only role types that can receive a warning from this screen.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {NON_REGISTRAR_ROLES.map((r) => (
              <div
                key={r.key}
                className="rounded-lg border border-slate-600 bg-slate-800/60 p-4 flex flex-col"
              >
                <span className="text-xs font-mono uppercase text-blue-300 tracking-wide">{r.key}</span>
                <h3 className="text-lg font-bold mt-1">{r.title}</h3>
                <p className="text-gray-400 text-sm mt-2 flex-1">{r.description}</p>
              </div>
            ))}
          </div>
        </section>

        {NON_REGISTRAR_ROLES.map((r) => {
          const rows = accountsForRole(r.key);
          return (
            <section key={r.key} className="mb-10">
              <h2 className="text-xl font-semibold mb-2">{r.title} accounts</h2>
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-gray-300">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Username</th>
                      <th className="px-4 py-3 font-medium">Warnings</th>
                      <th className="px-4 py-3 font-medium w-40">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((account) => {
                      const warnCount = warningsByUserId[account.id] ?? 0;
                      const isRemoved = warnCount >= 3;
                      return (
                      <tr key={account.id} className="border-t border-slate-700 bg-slate-900/80">
                        <td className="px-4 py-3">
                          {isRemoved ? (
                            <span className="text-gray-500 italic">[Removed — identity withheld]</span>
                          ) : (
                            account.name
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-300">
                          {isRemoved ? '—' : account.username}
                        </td>
                        <td className="px-4 py-3">{warnCount}</td>
                        <td className="px-4 py-3">
                          {isRemoved ? (
                            <span className="text-xs text-gray-500">No actions</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => warnAccount(account)}
                              className="rounded-md bg-amber-600 px-3 py-1.5 text-white text-xs font-semibold hover:bg-amber-500 transition-colors"
                            >
                              Warn
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                    })}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-gray-500 text-center">
                          No sample accounts for this role.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
