import { useCategories } from '../hooks/useCategories'

function Statistics({ occurrences }) {
  const { categories } = useCategories()

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  function daysAgoStr(days) {
    const d = new Date(today)
    d.setDate(d.getDate() - days)
    return d.toISOString().split('T')[0]
  }

  const weekStart = daysAgoStr(6)
  const monthStart = daysAgoStr(29)

  const completedToday = occurrences.filter(
    (o) => o.occurrenceDate === todayStr && o.isCompleted
  ).length

  const completedThisWeek = occurrences.filter(
    (o) => o.occurrenceDate >= weekStart && o.occurrenceDate <= todayStr && o.isCompleted
  ).length

  const completedThisMonth = occurrences.filter(
    (o) => o.occurrenceDate >= monthStart && o.occurrenceDate <= todayStr && o.isCompleted
  ).length

  const pastOccurrences = occurrences.filter((o) => o.occurrenceDate <= todayStr)
  const totalPast = pastOccurrences.length
  const totalCompleted = pastOccurrences.filter((o) => o.isCompleted).length
  const completionPercent =
    totalPast === 0 ? 0 : Math.round((totalCompleted / totalPast) * 100)

  const overdueCount = occurrences.filter(
    (o) => o.occurrenceDate < todayStr && !o.isCompleted
  ).length

  // Most productive day of week (based on completed occurrences)
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayCounts = [0, 0, 0, 0, 0, 0, 0]
  pastOccurrences
    .filter((o) => o.isCompleted)
    .forEach((o) => {
      const day = new Date(o.occurrenceDate + 'T00:00:00').getDay()
      dayCounts[day]++
    })
  const maxDayCount = Math.max(...dayCounts)
  const mostProductiveDay =
    maxDayCount === 0 ? 'Not enough data yet' : dayLabels[dayCounts.indexOf(maxDayCount)]

  // Most used category
  const categoryCounts = {}
  occurrences.forEach((o) => {
    if (o.category_id) {
      categoryCounts[o.category_id] = (categoryCounts[o.category_id] || 0) + 1
    }
  })
  const topCategoryId = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a]
  )[0]
  const topCategory = categories.find((c) => c.id === topCategoryId)

  const maxDayBarValue = Math.max(...dayCounts, 1)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Completed Today" value={completedToday} />
        <StatCard label="Completed This Week" value={completedThisWeek} />
        <StatCard label="Completed This Month" value={completedThisMonth} />
        <StatCard label="Overdue" value={overdueCount} accent="text-red-400" />
      </div>

      <div className="bg-slate-800 p-4 rounded-lg">
        <p className="text-sm text-slate-300 mb-2">Overall Completion Rate</p>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {totalCompleted} of {totalPast} past tasks completed ({completionPercent}%)
        </p>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg">
        <p className="text-sm text-slate-300 mb-3">Completions by Day of Week</p>
        <div className="space-y-2">
          {dayLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-8">{label}</span>
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(dayCounts[i] / maxDayBarValue) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 w-6 text-right">{dayCounts[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-xs text-slate-400">Most Productive Day</p>
          <p className="text-lg font-semibold text-white">{mostProductiveDay}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-xs text-slate-400">Most Used Category</p>
          <p className="text-lg font-semibold text-white">
            {topCategory ? topCategory.name : 'None yet'}
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent = 'text-white' }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg text-center">
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  )
}

export default Statistics