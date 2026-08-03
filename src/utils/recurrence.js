// Generates a list of date strings (YYYY-MM-DD) that a recurring task falls on,
// starting from the task's original date, up to `daysAhead` days from today.

export function getOccurrences(task, daysAhead = 60) {
  if (!task.is_recurring || !task.recurrence_rule) {
    return [task.date]
  }

  const dates = []
  const start = new Date(task.date + 'T00:00:00')
  const end = new Date()
  end.setDate(end.getDate() + daysAhead)

  const rule = task.recurrence_rule

  let current = new Date(start)

  while (current <= end) {
    const dayOfWeek = current.getDay() // 0=Sun ... 6=Sat
    const dateStr = current.toISOString().split('T')[0]

    if (rule === 'daily') {
      dates.push(dateStr)
    } else if (rule === 'weekdays') {
      if (dayOfWeek >= 1 && dayOfWeek <= 5) dates.push(dateStr)
    } else if (rule.startsWith('weekly:')) {
      const allowedDays = rule.replace('weekly:', '').split(',').map(Number)
      if (allowedDays.includes(dayOfWeek)) dates.push(dateStr)
    } else if (rule === 'monthly') {
      if (current.getDate() === start.getDate()) dates.push(dateStr)
    } else if (rule === 'yearly') {
      if (
        current.getDate() === start.getDate() &&
        current.getMonth() === start.getMonth()
      ) {
        dates.push(dateStr)
      }
    }

    current.setDate(current.getDate() + 1)
  }

  return dates
}