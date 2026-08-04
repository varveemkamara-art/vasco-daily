import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { useTasks } from './hooks/useTasks'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import { useReminderChecker } from './hooks/useReminderChecker'
import { useSettings } from './hooks/useSettings'
import { useProfile } from './hooks/useProfile'
import Statistics from './pages/Statistics'
import Nav from './components/layout/Nav'

function App() {
  const { user, signOut } = useAuth()
  const { occurrences, loading, addTask, updateTask, deleteTask, toggleOccurrence } = useTasks()
  const { settings } = useSettings()
  const { profile } = useProfile()
  useReminderChecker(occurrences, settings.browser_notifications_enabled)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme !== 'light')
  }, [settings.theme])
  const [page, setPage] = useState('dashboard')

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Vasco Daily</h1>
          <button
            onClick={signOut}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Log Out
          </button>
        </div>

        <Nav currentPage={page} onNavigate={setPage} />

       {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        ) : (
          <>
            {page === 'dashboard' && (
              <Dashboard
                occurrences={occurrences}
                userEmail={user.email}
                fullName={profile.full_name}
              />
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
              <Calendar
                occurrences={occurrences}
                onToggleComplete={toggleOccurrence}
                onDelete={deleteTask}
                onEdit={(task) => {
                  setPage('tasks')
                }}
              />
            )}
            {page === 'settings' && <Settings />}
            {page === 'statistics' && <Statistics occurrences={occurrences} />}
          </>
        )}
      </div>
    </div>
  )
}

export default App