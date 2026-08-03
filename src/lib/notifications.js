export function isNotificationSupported() {
  return 'Notification' in window
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission // 'granted', 'denied', or 'default'
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported'
  const permission = await Notification.requestPermission()
  return permission
}

export function showTaskNotification(task) {
  if (getNotificationPermission() !== 'granted') return

  const notification = new Notification(`Reminder: ${task.title}`, {
    body: task.start_time
      ? `Starts at ${task.start_time}${task.description ? '\n' + task.description : ''}`
      : task.description || 'Task is due',
    icon: '/vite.svg', // we'll replace this with a real app icon later
    tag: task.occurrenceId, // prevents duplicate notifications with the same tag
  })

  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}