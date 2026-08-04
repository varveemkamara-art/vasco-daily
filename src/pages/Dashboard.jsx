function Dashboard({ occurrences, userEmail, fullName }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const today = now.toISOString().split('T')[0]
  const todayOccurrences = occurrences.filter((o) => o.occurrenceDate === today)
  const completedToday = todayOccurrences.filter((o) => o.isCompleted).length
  const totalToday = todayOccurrences.length
  const percent = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100)

  const upcoming = occurrences
    .filter((o) => o.occurrenceDate > today && !o.isCompleted)
    .slice(0, 5)

  const overdue = occurrences.filter(
    (o) => o.occurrenceDate < today && !o.isCompleted
  )

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {greeting}, {fullName || userEmail.split('@')[0]}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {now.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Today's Progress</p>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {completedToday} completed, {totalToday - completedToday} remaining ({percent}%)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalToday}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Today's Tasks</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">{overdue.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Overdue</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Upcoming</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Nothing upcoming.</p>
        ) : (
          <ul className="space-y-1">
            {upcoming.map((o) => (
              <li key={o.occurrenceId} className="text-sm text-slate-600 dark:text-slate-300">
                {o.occurrenceDate} — {o.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Dashboard