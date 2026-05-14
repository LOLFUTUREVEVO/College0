'use client'
import Link from "next/link";
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {loginUser} from '@/app/services/authService'


export default function Login() {
  const [creds, setCreds] = useState({
    username: "",
    password: ""
  }); 
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState('');
  const router = useRouter();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreds(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log("ENTERED THE THING!");
    try {
      const result = await loginUser(creds);
      console.log('Login successful:', result);
      
      // Small delay to ensure token is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Route based on role - only USER or ADMIN -> it fucking shouldn't be though
      if (result.role === 'ADMIN') {
        console.log('Redirecting admin to admin dashboard');
        router.push('/dashboard/admin');
      } else if (result.role === 'USER') {
        console.log('Redirecting user to member dashboard');
        router.push('/dashboard/user');
      } else if( result.role === 'EMPLOYEE') {
        console.log('Redirecting user to member dashboard');
        router.push('/dashboard/admin');
      } else {
        console.log('Unknown role, defaulting to dashboard');
        router.push('/dashboard/user');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Better error handling for account status
      if (error.message && error.message.includes('pending')) {
        setError('Your account is pending approval. Please wait for admin approval.');
      } else if (error.message && error.message.includes('denied')) {
        setError('Your account registration was denied. Please contact an administrator.');
      } else if (error.message && error.message.includes('deactivated')) {
        setError('Your account has been deactivated. Please contact an administrator.');
      } else if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data || 
                           `Login failed (${error.response.status})`;
        setError(typeof errorMessage === 'string' ? errorMessage : 'Login failed');
      } else if (error.request) {
        setError('Network error: Unable to connect to server');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center  font-sans bg-slate-900 gap-10">
        <div className="text-white text-7xl font-bold">College One</div>
        <div className="rounded-lg bg-gray-400/20 p-10 px-25 w-1/3 min-w-150 flex flex-col gap-3">
            <h1 className="text-lg text-white">Username</h1>
            
              <input className="bg-white rounded-md p-5 py-3 text-black" type="text" id="username" name="username" value={creds.username} onChange={handleInputChange} required></input>
              
              <h1 className="text-lg text-white">Password</h1>
              
              <input className="bg-white rounded-md p-5 py-3 text-black" type="text" id="password" name="password" value={creds.password} onChange={handleInputChange}></input>
            <form onSubmit={handleSubmit}>
              <button type="submit" className="bg-green-500 text-white text-lg rounded-md p-5 py-3 hover:bg-green-600 transition-colors duration-150" disabled={isLoading}>{isLoading ? "Logging In..." : "Login"}</button>
            </form>
            <div className="border-b-1 border-gray-500 pt-5"></div>
            <div className="flex flex-row justify-between">
                <Link href="/signup" className="text-blue-400 text-lg font-bold hover:underline px-1">Sign up -{'>'}</Link>
                <div className="border-l border-gray-500"></div>
                <Link href="/forgot-password" className="text-blue-400 text-lg font-bold hover:underline px-1">Forgot Password</Link>
                <div className="border-l border-gray-500"></div>
                <Link href="/visitors" className="text-blue-400 text-lg font-bold hover:underline px-1">Learn More</Link>
            </div>
        </div>
        {error && (
              <div className="p-4 bg-red-800 border border-red-600 rounded-md">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
          )}
        <p className="text-gray-700">Copyright © CollegeOne 2026</p>
    </div>
  );
}
