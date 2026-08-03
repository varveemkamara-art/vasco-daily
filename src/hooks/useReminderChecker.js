import { useEffect, useRef } from 'react'
import { showTaskNotification, getNotificationPermission } from '../lib/notifications'

// Checks every minute whether any occurrence's reminder time has arrived,
// and shows a browser notification if so. Keeps track of what it already
// notified about (in memory) to avoid repeating the same one.

export function useReminderChecker(occurrences, browserNotificationsEnabled) {
  const notifiedRef = useRef(new Set())

  useEffect(() => {
    if (!browserNotificationsEnabled) return
    if (getNotificationPermission() !== 'granted') return

   function checkReminders() {
      const now = new Date()

      occurrences.forEach((occ) => {
        if (occ.title === 'Fahmah') {
          console.log('Fahmah task:', {
            occurrenceDate: occ.occurrenceDate,
            start_time: occ.start_time,
            reminderMinutes: occ.reminderMinutes,
            isCompleted: occ.isCompleted,
          })
        }
        if (occ.isCompleted) return
        if (!occ.start_time) return
        if (!occ.reminderMinutes || occ.reminderMinutes.length === 0) return

        const taskDateTime = new Date(`${occ.occurrenceDate}T${occ.start_time}`)

        occ.reminderMinutes.forEach((minutesBefore) => {
          const reminderTime = new Date(taskDateTime.getTime() - minutesBefore * 60000)
          const key = `${occ.occurrenceId}_${minutesBefore}`

          // Fire if we're within the same minute as the reminder time, and haven't already notified
          const diffMs = now.getTime() - reminderTime.getTime()
          const withinWindow = diffMs >= 0 && diffMs < 60000 // fires once, in the first minute after due

          if (withinWindow && !notifiedRef.current.has(key)) {
            showTaskNotification(occ)
            notifiedRef.current.add(key)
          }
        })
      })
    }

    checkReminders() // check immediately on mount too
    const interval = setInterval(checkReminders, 30000) // check every 30 seconds

    return () => clearInterval(interval)
  }, [occurrences, browserNotificationsEnabled])
}