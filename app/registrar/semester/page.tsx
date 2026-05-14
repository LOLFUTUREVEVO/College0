'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SemesterManagement() {
  const [period, setPeriod] = useState("Select Semester Period");

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"];
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [classData, setClassData] = useState({
    name: '',
    room: '',
    days: '',
    time: '',
    instructor: '',
    size: 0
  });
  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lastPeriod');
        if (saved) {
            setPeriod(saved);
        }
  });

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setPeriod(newValue);
    localStorage.setItem('lastPeriod', newValue);
  };

  const handleClassChange = () => {
    // save to database
    console.log("Saving class data: ", classData);
    setIsEditingClass(false);
  };

  // from database
  const sampleclasses = [
    { name :'Advanced Chemistry',
      room :'302',
      days : 'Mon/Wed/Fri',
      time : '10:00 AM',
      instructor : 'Karen Smith',
      size : 20,
    },
    {
      name :'Intro To Economics',
      room :'None (Remote)',
      days : 'Mon/Wed',
      time : '2:00 PM',
      instructor : 'Katherine Johnson',
      size : 35,
    },
    {
      name :'Thermodynamics Lab',
      room :'101',
      days : 'Tue/Thu',
      time : '12:00 PM',
      instructor : 'Albert Einstein',
      size : 50,
    }
  ];

  return (
    <div className="flex font-sans bg-gray-900 w-full h-full text-white">
      
      {/* SIDEBAR */}
      <div className="flex flex-col h-screen w-64 bg-slate-800 p-4 shrink-0">
        <h2 className="text-2xl font-bold mb-8 px-2 text-blue-400">College One</h2>
        
        <nav className="flex flex-col space-y-2">
            <Link 
                href="/visitors" 
                className="p-3 rounded-md transition-colors" 
            >
                Main Page
            </Link>
            <Link 
                href="/registrar" 
                className="p-3 rounded-md transition-colors" 
            >
                Applications
            </Link>
            <Link 
                href="/registrar/semester" 
                className="p-3 rounded-md bg-slate-700 transition-colors" 
            >
                Semester Management
            </Link>
            <Link 
                href="/student/help" 
                className="p-3 rounded-md transition-colors" 
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
      <main className="flex-1 p-10 "> 
        <div className="flex justify-between items-start w-full">
            <div>
            <h1 className="text-3xl font-bold">Semester Management</h1>
            <p className="text-gray-400">Manage semesters and their periods</p>
            </div>
            
            {/* TIME & SEMESTER STATUS */}
            <div className="text-right mt-3">
            <div className="text-xl font-mono text-blue-400">10:45 AM</div>
            <select value={period} onChange={handlePeriodChange} className="bg-gray-900 rounded-lg text-sm text-gray-500 uppercase text-right">
                <option>Set Semester Period</option>
                <option>Class Set-Up Period</option>
                <option>Course Registration Period</option>
                <option>Class Running Period</option>
                <option>Grading Period</option>
            </select>
            </div>
        </div>

        {/* CLASSES GRID */}
        <h2 className="text-2xl font-bold mt-7 mb-2">{period}</h2>
        <div className="border-b-2 border-gray-700 mb-2"></div>

        <div className="flex flex-col lg:flex-row gap-3 items-start mx-auto max-w-7xl">
            {/* CALENDAR */}
            <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[80px_1fr] bg-gray-900 border-b border-gray-800">
                    <div className="border-r border-gray-800"></div> 
        
                    <div className="grid grid-cols-5">
                    {DAYS.map((day) => (
                        <div key={day} className="py-4 text-center border-r border-gray-800 last:border-r-0">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{day}</span>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="overflow-y-auto">
                    {TIMES.map((time) => (
                    <div key={time} className="grid grid-cols-[80px_1fr] border-b border-gray-800 last:border-b-0">
            
                        <div className="flex items-center justify-center border-r border-gray-800 bg-gray-900/50">
                          <span className="text-[10px] font-mono text-blue-400 font-medium">{time}</span>
                        </div>

                        <div className="grid grid-cols-5 h-20">
                          {DAYS.map((day) => (
                            <div key={`${day}-${time}`}
                            onClick={() => {
                              const existingClass = sampleclasses.find(c => c.days.includes(day) && c.time === time);
                              setIsEditingClass(true);
                              if (existingClass) {
                                setClassData(existingClass);
                              } else {
                                setClassData({name: '', room: '', days: '', time: '', instructor: '', size: 0});
                              }
                            }}
                            className="border-r border-gray-800 last:border-r-0 p-1 hover:bg-white/5 transition-colors group relative cursor-pointer">
                                {sampleclasses.map((course) => {
                                    if (course.days.includes(day) && course.time === time) {
                                        return (
                                            <div key={course.name} className="absolute inset-1 bg-blue-500/20 border-l-2 border-blue-500 rounded p-1.5 z-10 pointer-events-none">
                                                <p className="text-[10.5px] font-bold text-blue-300 uppercase truncate w-full leading-none">{course.name}</p>
                                                <p className="text-[9.5px] text-blue-200/70 mt-0.5">{course.instructor}</p>
                                                <p className="text-[9.5px] text-blue-200/70 mt-0.5">Room: {course.room}</p>
                                                <p className="text-[9.5px] text-blue-200/70 mt-0.5">Size: {course.size}</p>
                                            </div>
                                        );
                                    }
                                })}
                                <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-full text-gray-700 text-lg">
                                    +
                                </div>
                            </div>
                          ))}
                        </div>

                    </div>
                    ))}
                </div>
            </div>

            {/* ADD/CHANGE CLASS */}
            <div className="flex gap-4 bg-slate-700 p-5 rounded-lg w-full lg:w-[300px]">
              {!isEditingClass ? (
                  <p className="text-lg">Click cell to add/change class</p>
              ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-lg">Class Details</p>
          
                  <input type="text" placeholder="Class Name" value = {classData.name || ''}
                  className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                  onChange={(e) => setClassData({...classData, name: e.target.value})}/>
          
                  <input type="text" placeholder="Room" value = {classData.room || ''}
                  className="bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                  onChange={(e) => setClassData({...classData, room: e.target.value})}/>

                  <input type="text" placeholder="Days" value = {classData.days || ''}
                  className="bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                  onChange={(e) => setClassData({...classData, days: e.target.value})}/>

                  <input type="text" placeholder="Time" value = {classData.time || ''}
                  className="bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                  onChange={(e) => setClassData({...classData, time: e.target.value})}/>

                  <input type="text" placeholder="Instructor" value = {classData.instructor || ''}
                  className="bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                  onChange={(e) => setClassData({...classData, instructor: e.target.value})}/>

                  <input type="number" placeholder="Class Size" value = {classData.size || ''}
                  className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white outline-none focus:border-blue-500"
                  onChange={(e) => setClassData({...classData, size: Number(e.target.value)})}/>

                  <div className="flex gap-2 pt-2">
                    <button onClick={handleClassChange} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded transition-colors">
                      Add Class
                    </button>
                    <button onClick={() => setIsEditingClass(false)} className="text-slate-400 text-[10px] hover:text-white px-2">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
        </div>

      </main>
    </div>
  );
}