import { useState } from 'react'
import TaskForm from '../components/tasks/TaskForm'
import TaskList from '../components/tasks/TaskList'

function Tasks({ occurrences, addTask, updateTask, deleteTask, toggleOccurrence }) {
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

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

  const filteredOccurrences = occurrences
    .filter((occ) =>
      occ.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((occ) => {
      if (filter === 'today') return occ.occurrenceDate === today
      if (filter === 'completed') return occ.isCompleted
      if (filter === 'overdue')
        return occ.occurrenceDate < today && !occ.isCompleted
      if (filter === 'upcoming')
        return occ.occurrenceDate > today && !occ.isCompleted
      return true
    })
    .sort((a, b) => a.occurrenceDate.localeCompare(b.occurrenceDate))

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
  ]

  return (
    <div className="space-y-4">
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

      <TaskList
        occurrences={filteredOccurrences}
        onToggleComplete={toggleOccurrence}
        onDelete={deleteTask}
        onEdit={setEditingTask}
      />
    </div>
  )
}

export default Tasks