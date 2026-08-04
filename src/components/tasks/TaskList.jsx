function TaskList({ occurrences, onToggleComplete, onDelete, onEdit }) {
  if (occurrences.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400">No tasks yet. Add one above!</p>
  }

  const priorityColors = {
    low: 'bg-slate-500 dark:bg-slate-600',
    medium: 'bg-blue-600',
    high: 'bg-orange-600',
    urgent: 'bg-red-600',
  }

  return (
    <div className="space-y-2">
      {occurrences.map((occ) => (
        <div
          key={occ.occurrenceId}
          className="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={occ.isCompleted}
              onChange={() => onToggleComplete(occ, occ.occurrenceDate)}
              className="w-5 h-5"
            />
            <div onClick={() => onEdit(occ)} className="cursor-pointer">
              <p
                className={`text-slate-900 dark:text-white ${
                  occ.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                }`}
              >
                {occ.title}
                {occ.is_recurring && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">(repeats)</span>
                )}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {occ.occurrenceDate} {occ.start_time || ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs text-white px-2 py-1 rounded ${priorityColors[occ.priority]}`}
            >
              {occ.priority}
            </span>
            <button
              onClick={() => onDelete(occ.id)}
              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm"
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