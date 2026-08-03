import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { useTasks } from './hooks/useTasks'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Nav from './components/layout/Nav'

function App() {
  const { user, signOut } = useAuth()
  const { occurrences, loading, addTask, updateTask, deleteTask, toggleOccurrence } = useTasks()
  const [page, setPage] = useState('dashboard')

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Vasco Daily</h1>
          <button
            onClick={signOut}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Log Out
          </button>
        </div>

        <Nav currentPage={page} onNavigate={setPage} />

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <>
            {page === 'dashboard' && (
              <Dashboard occurrences={occurrences} userEmail={user.email} />
            )}
            {page === 'tasks' && (
              <Tasks
                occurrences={occurrences}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                toggleOccurrence={toggleOccurrence}
              />
            )}
            {page === 'calendar' && (
              <p className="text-slate-400">Calendar coming next...</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App