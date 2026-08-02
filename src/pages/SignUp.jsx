import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function SignUp() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    const { error } = await signUp(email, password)
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Success! Check your email to confirm your account.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-white mb-4">
          Create your account
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 rounded bg-slate-700 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-2 rounded bg-slate-700 text-white outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Sign Up
        </button>

        {message && <p className="text-sm text-yellow-400">{message}</p>}
      </form>
    </div>
  )
}

export default SignUp