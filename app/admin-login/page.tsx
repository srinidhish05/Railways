"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password
    })
    if (res?.error) {
      setError("Invalid credentials")
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md border border-blue-900">
        <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
        />
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Login</button>
      </form>
    </div>
  )
}
