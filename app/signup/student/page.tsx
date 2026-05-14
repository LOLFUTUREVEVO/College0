"use client";

import { useRouter } from "next/navigation";

export default function StudentSignup() {
  const router = useRouter();
  return (
    <div className="flex flex-col flex-1 items-center justify-center  font-sans bg-slate-900 gap-10">
        <p className="text-white text-7xl font-bold">College One Application Portal</p>
        {/* Here is the main signup page content. */}
        <div className="rounded-lg bg-gray-400/20 p-15 w-1/3  flex flex-col gap-3">
            <p className="text-2xl text-white">Student App</p>
            <p className="text-xl text-white">Select Your Institution</p>
            <div className="border-b-2 border-gray-500"></div>
            <select className="bg-white rounded-lg p-2 text-xl text-black justify-start items-end mb-10">
                <option>University College</option>
                <option>City College Of New York</option>
            </select>
            <p className="text-white text-xl">Student Information</p>
            <div className="border-b-2 border-gray-500"></div>
            <span className="text-lg flex flex-row gap-2">
                <div>
                    <p className="text-white">First Name</p>
                    <input className="bg-white rounded-md py-2 text-black" ></input>
                </div>
                <div>
                    <p className="text-white">Last Name</p>
                    <input className="bg-white rounded-md py-2 text-black" ></input>
                </div>
            </span>
            <span className="text-lg flex flex-row gap-2">
                <div>
                    <p className="text-white">Email</p>
                    <input className="bg-white rounded-md py-2 text-black" ></input>
                </div>
                <div>
                    <p className="text-white">Phone</p>
                    <input className="bg-white rounded-md py-2 text-black" ></input>
                </div>
            </span>
            <p className="text-white">Address</p>
            <input className="bg-white rounded-md py-2 text-black mb-10" ></input>
            <p className="text-xl text-white">Major Selection</p>
            <div className="border-b-2 border-gray-500"></div>
            <select className="bg-white rounded-lg p-2 text-xl text-black justify-start items-end ">
                <option>Computer Science</option>
                <option>Computer Engineering</option>
                <option>Electrical Engineering</option>
                <option>Mechanical Engineering</option>
            </select>
            <p className="text-white">Most Current GPA</p>
            <input className="bg-white rounded-md py-2 text-black mb-10"></input>


            <button
              type="button"
              onClick={() => router.push("/visitor")}
              className="bg-green-500 text-white text-lg rounded-md p-5 py-3 hover:bg-green-600 transition-colors duration-150"
            >
              Apply
            </button>
        </div>
    </div>
  );
}
