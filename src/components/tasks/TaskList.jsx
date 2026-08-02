function TaskList({ tasks, onToggleComplete, onDelete, onEdit }) {
  if (tasks.length === 0) {
    return <p className="text-slate-400">No tasks yet. Add one above!</p>
  }

  const priorityColors = {
    low: 'bg-slate-600',
    medium: 'bg-blue-600',
    high: 'bg-orange-600',
    urgent: 'bg-red-600',
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-slate-800 p-3 rounded-lg flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={() => onToggleComplete(task)}
              className="w-5 h-5"
            />
            <div onClick={() => onEdit(task)} className="cursor-pointer">
              <p
                className={`text-white ${
                  task.status === 'completed' ? 'line-through text-slate-500' : ''
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-slate-400">
                {task.date} {task.start_time || ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs text-white px-2 py-1 rounded ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskList