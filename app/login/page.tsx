import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center  font-sans bg-slate-900 gap-10">
        <div className="text-white text-7xl font-bold">College One</div>
        <div className="rounded-lg bg-gray-400/20 p-10 px-25 w-1/3 min-w-150 flex flex-col gap-3">
            <h1 className="text-lg text-white">Username</h1>
            <input className="bg-white rounded-md p-5 py-3 text-black" ></input>
            <h1 className="text-lg text-white">Password</h1>
            <input className="bg-white rounded-md p-5 py-3 text-black" ></input>
            <button className="bg-green-500 text-white text-lg rounded-md p-5 py-3 hover:bg-green-600 transition-colors duration-150">Login</button>
            <div className="border-b-1 border-gray-500 pt-5"></div>
            <div className="flex flex-row justify-between">
                <Link href="/signup" className="text-blue-400 text-lg font-bold hover:underline px-1">Sign up -{'>'}</Link>
                <div className="border-l border-gray-500"></div>
                <Link href="/forgot-password" className="text-blue-400 text-lg font-bold hover:underline px-1">Forgot Password</Link>
                <div className="border-l border-gray-500"></div>
                <Link href="/visitors" className="text-blue-400 text-lg font-bold hover:underline px-1">Learn More</Link>
            </div>
        </div>
        <p className="text-gray-700">Copyright © CollegeOne 2026</p>
    </div>
  );
}
