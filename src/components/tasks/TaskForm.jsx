import { useState } from 'react'

function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [priority, setPriority] = useState('medium')

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await onSubmit({
      title,
      description,
      date,
      start_time: startTime || null,
      priority,
    })

    if (!error) {
      setTitle('')
      setDescription('')
      setDate('')
      setStartTime('')
      setPriority('medium')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg space-y-3">
      <h2 className="text-lg font-semibold text-white">Add a Task</h2>

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

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white outline-none"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Add Task
      </button>
    </form>
  )
}

export default TaskForm