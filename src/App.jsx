import { useAuth } from './context/AuthContext'
import Login from './pages/Login'

function App() {
  const { user, signOut } = useAuth()

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-4">
      <p>Logged in as: {user.email}</p>
      <button
        onClick={signOut}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Log Out
      </button>
    </div>
  )
}

export default App