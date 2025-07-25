"use client"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center animate-fade-in">
        <svg className="w-16 h-16 mb-4 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5v-1A4.5 4.5 0 0 0 12 2.5a4.5 4.5 0 0 0-4.5 4.5v1m13 4.5v5A4.5 4.5 0 0 1 16 21.5H8A4.5 4.5 0 0 1 3.5 17V12a4.5 4.5 0 0 1 4.5-4.5h8A4.5 4.5 0 0 1 20.5 12z" />
        </svg>
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Login Required</h1>
        <p className="text-gray-600 mb-4 text-center">
          You must be logged in to access the admin dashboard.<br />
          Please contact the administrator if you believe this is a mistake.
        </p>
        <div className="animate-pulse text-blue-500 font-semibold">
          This is a demo login page. Authentication coming soon!
        </div>
      </div>
    </div>
  );
}