import { useState } from 'react'
import TaskList from '../components/tasks/TaskList'

function Calendar({ occurrences, onToggleComplete, onDelete, onEdit }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthName = viewDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  function goToPrevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }

  function goToNextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  function dateStr(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const today = new Date().toISOString().split('T')[0]

  const daysArray = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d)
  }

  const selectedOccurrences = occurrences
    .filter((o) => o.occurrenceDate === selectedDate)
    .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))

  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <button onClick={goToPrevMonth} className="text-slate-600 dark:text-slate-300 px-2">
            ←
          </button>
          <h2 className="text-slate-900 dark:text-white font-semibold">{monthName}</h2>
          <button onClick={goToNextMonth} className="text-slate-600 dark:text-slate-300 px-2">
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 dark:text-slate-400 mb-1">
          {dayLabels.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((day, index) => {
            if (day === null) return <div key={index} />

            const ds = dateStr(day)
            const hasTasks = occurrences.some((o) => o.occurrenceDate === ds)
            const isToday = ds === today
            const isSelected = ds === selectedDate

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(ds)}
                className={`aspect-square rounded text-sm relative ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isToday
                    ? 'bg-gray-200 dark:bg-slate-600 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {day}
                {hasTasks && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Tasks on {selectedDate}
        </h3>
        <TaskList
          occurrences={selectedOccurrences}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </div>
  )
}

export default Calendar