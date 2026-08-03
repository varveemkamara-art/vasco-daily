import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from '../lib/notifications'

function Settings() {
  const { settings, loading, updateSettings } = useSettings()
  const [permission, setPermission] = useState(getNotificationPermission())

  async function handleEnableBrowserNotifications() {
    if (!isNotificationSupported()) {
      alert('Your browser does not support notifications.')
      return
    }

    const result = await requestNotificationPermission()
    setPermission(result)

    if (result === 'granted') {
      await updateSettings({ browser_notifications_enabled: true })
    } else {
      await updateSettings({ browser_notifications_enabled: false })
    }
  }

  async function handleDisableBrowserNotifications() {
    await updateSettings({ browser_notifications_enabled: false })
  }

  if (loading) {
    return <p className="text-slate-400">Loading settings...</p>
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 p-4 rounded-lg">
        <h2 className="text-white font-semibold mb-3">Notifications</h2>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Browser Notifications</span>
              {settings.browser_notifications_enabled ? (
                <button
                  onClick={handleDisableBrowserNotifications}
                  className="text-sm bg-slate-700 text-white px-3 py-1 rounded"
                >
                  Turn Off
                </button>
              ) : (
                <button
                  onClick={handleEnableBrowserNotifications}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Turn On
                </button>
              )}
            </div>

            {permission === 'denied' && (
              <p className="text-xs text-red-400 mt-1">
                Notifications are blocked in your browser settings. You'll need
                to allow them manually — click the lock/info icon in your
                browser's address bar, find "Notifications," and set it to
                "Allow."
              </p>
            )}

            {permission === 'unsupported' && (
              <p className="text-xs text-yellow-400 mt-1">
                Your browser does not support notifications.
              </p>
            )}

            <p className="text-xs text-slate-500 mt-1">
              Only works while this app is open in a browser tab. For
              reminders when the app is fully closed, use WhatsApp or Email
              (coming soon).
            </p>

            {settings.browser_notifications_enabled && (
              <button
                onClick={() =>
                  new Notification('Test Notification', {
                    body: 'If you can see this, browser notifications are working!',
                  })
                }
                className="text-sm bg-slate-700 text-white px-3 py-1 rounded mt-2"
              >
                Send Test Notification
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings