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

        {loading ? (
          <p className="text-slate-400">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
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