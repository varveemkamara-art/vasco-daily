import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { useTasks } from './hooks/useTasks'
import Login from './pages/Login'
import TaskForm from './components/tasks/TaskForm'
import TaskList from './components/tasks/TaskList'

function App() {
  const { user, signOut } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  if (!user) {
    return <Login />
  }

  function handleToggleComplete(task) {
    updateTask(task.id, {
      status: task.status === 'completed' ? 'pending' : 'completed',
    })
  }

  async function handleFormSubmit(taskData, taskId) {
    if (taskId) {
      const result = await updateTask(taskId, taskData)
      setEditingTask(null)
      return result
    } else {
      return await addTask(taskData)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => {
      if (filter === 'today') return task.date === today
      if (filter === 'completed') return task.status === 'completed'
      if (filter === 'overdue')
        return task.date < today && task.status !== 'completed'
      if (filter === 'upcoming')
        return task.date > today && task.status !== 'completed'
      return true
    })

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
  ]

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

        <TaskForm
          onSubmit={handleFormSubmit}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 text-white outline-none"
        />

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-sm px-3 py-1 rounded ${
                filter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-slate-400">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={deleteTask}
            onEdit={setEditingTask}
          />
        )}
      </div>
    </div>
  )
}

export default App