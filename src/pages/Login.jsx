import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login({ onSwitchToSignUp }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    const { error } = await signIn(email, password)
    if (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-lg w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Log in to Vasco
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Log In
        </button>

        {message && <p className="text-sm text-red-500 dark:text-red-400">{message}</p>}

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login