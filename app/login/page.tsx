"use client"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#38bdf8] via-[#bae6fd] to-[#f0f9ff] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full">
          <circle cx="500" cy="100" r="80" fill="#38bdf8" fillOpacity="0.15" />
          <circle cx="100" cy="500" r="100" fill="#0ea5e9" fillOpacity="0.10" />
        </svg>
      </div>
      <div className="relative z-10 p-10 bg-white rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in border border-blue-200">
        <svg className="w-20 h-20 mb-6 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5v-1A4.5 4.5 0 0 0 12 2.5a4.5 4.5 0 0 0-4.5 4.5v1m13 4.5v5A4.5 4.5 0 0 1 16 21.5H8A4.5 4.5 0 0 1 3.5 17V12a4.5 4.5 0 0 1 4.5-4.5h8A4.5 4.5 0 0 1 20.5 12z" />
        </svg>
        <h1 className="text-4xl font-extrabold mb-3 text-blue-700 text-center drop-shadow-lg animate-pulse">Login Required</h1>
        <p className="text-gray-600 mb-6 text-center text-lg">
          You must be logged in to access the <span className="font-bold text-blue-600">admin dashboard</span>.<br />
          Please contact the administrator if you believe this is a mistake.
        </p>
        <div className="animate-pulse text-blue-500 font-semibold text-center mb-2">
          This is a demo login page.<br />Authentication coming soon!
        </div>
        <button
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled
        >
          Login (Demo Only)
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease; }
        .animate-bounce { animation: bounce 1.2s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { text-shadow: 0 0 10px #38bdf8, 0 0 20px #0ea5e9; }
          50% { text-shadow: 0 0 20px #38bdf8, 0 0 40px #0ea5e9; }
        }
      `}</style>
    </div>
  );
}