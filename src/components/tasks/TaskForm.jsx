import { useState, useEffect } from 'react'
import { useCategories } from '../../hooks/useCategories'

function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const { categories } = useCategories()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [priority, setPriority] = useState('medium')
  const [categoryId, setCategoryId] = useState('')
  const [recurrence, setRecurrence] = useState('none')
  const [customDays, setCustomDays] = useState([])

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '')
      setDescription(editingTask.description || '')
      setDate(editingTask.date || '')
      setStartTime(editingTask.start_time || '')
      setPriority(editingTask.priority || 'medium')
      setCategoryId(editingTask.category_id || '')

      if (editingTask.recurrence_rule) {
        const rule = editingTask.recurrence_rule
        if (rule.startsWith('weekly:')) {
          setRecurrence('weekly')
          setCustomDays(rule.replace('weekly:', '').split(',').map(Number))
        } else {
          setRecurrence(rule)
        }
      } else {
        setRecurrence('none')
      }
    }
  }, [editingTask])

  function resetForm() {
    setTitle('')
    setDescription('')
    setDate('')
    setStartTime('')
    setPriority('medium')
    setCategoryId('')
    setRecurrence('none')
    setCustomDays([])
  }

  function toggleDay(day) {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()

    let recurrenceRule = null
    if (recurrence === 'weekly') {
      recurrenceRule = `weekly:${customDays.sort().join(',')}`
    } else if (recurrence !== 'none') {
      recurrenceRule = recurrence
    }

    const taskData = {
      title,
      description,
      date,
      start_time: startTime || null,
      priority,
      category_id: categoryId || null,
      is_recurring: recurrence !== 'none',
      recurrence_rule: recurrenceRule,
    }

    const { error } = await onSubmit(taskData, editingTask?.id)

    if (!error) resetForm()
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg space-y-3">
      <h2 className="text-lg font-semibold text-white">
        {editingTask ? 'Edit Task' : 'Add a Task'}
      </h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 rounded bg-slate-700 text-white outline-none"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white outline-none"
      />

      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="flex-1 p-2 rounded bg-slate-700 text-white outline-none"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="flex-1 p-2 rounded bg-slate-700 text-white outline-none"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="flex-1 p-2 rounded bg-slate-700 text-white outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex-1 p-2 rounded bg-slate-700 text-white outline-none"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-300 block mb-1">Repeat</label>
        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white outline-none"
        >
          <option value="none">One-time (no repeat)</option>
          <option value="daily">Every day</option>
          <option value="weekdays">Every weekday</option>
          <option value="weekly">Specific days of the week</option>
          <option value="monthly">Every month</option>
          <option value="yearly">Every year</option>
        </select>
      </div>

      {recurrence === 'weekly' && (
        <div className="flex gap-1 flex-wrap">
          {dayLabels.map((label, index) => (
            <button
              key={index}
              type="button"
              onClick={() => toggleDay(index)}
              className={`text-xs px-2 py-1 rounded ${
                customDays.includes(index)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          {editingTask ? 'Save Changes' : 'Add Task'}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={() => {
              resetForm()
              onCancelEdit()
            }}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white p-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm