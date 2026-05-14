'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Visitor() {
  return (
    <div className="flex font-sans bg-gray-900 w-full h-screen text-white">
      
      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>
        
        <nav className="flex flex-col space-y-2">
          <Link 
            href="/visitors" 
            className="p-3 rounded-md bg-slate-700 transition-colors" 
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
      <main className="flex-1 p-10"> 
        <h1 className="text-3xl font-bold mb-4">Visitor Panel</h1>
        <p className="text-gray-400">
          Click the button in the bottom right corner in order to ask for help from our AI assistant.
        </p>
      </main>
    </div>
  );
}