import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from '../lib/notifications'

const TIMEZONES = [
  'UTC',
  'Africa/Monrovia',
  'Africa/Lagos',
  'Africa/Accra',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Kolkata',
]

function Settings() {
  const { user } = useAuth()
  const { settings, loading: settingsLoading, updateSettings } = useSettings()
  const { profile, loading: profileLoading, updateProfile } = useProfile()
  const [permission, setPermission] = useState(getNotificationPermission())
  const [fullName, setFullName] = useState('')
  const [nameLoaded, setNameLoaded] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  if (!nameLoaded && !profileLoading && profile.full_name !== undefined) {
    setFullName(profile.full_name || '')
    setNameLoaded(true)
  }

  if (!settingsLoading && emailInput === '' && settings.notification_email) {
    setEmailInput(settings.notification_email)
  }

  async function handleEnableBrowserNotifications() {
    if (!isNotificationSupported()) {
      alert('Your browser does not support notifications.')
      return
    }
    const result = await requestNotificationPermission()
    setPermission(result)
    await updateSettings({ browser_notifications_enabled: result === 'granted' })
  }

  async function handleDisableBrowserNotifications() {
    await updateSettings({ browser_notifications_enabled: false })
  }

  async function handleSaveName() {
    await updateProfile({ full_name: fullName })
  }

  async function handleSaveEmail() {
    await updateSettings({
      notification_email: emailInput,
      email_notifications_enabled: true,
    })
  }

  async function handleExportData() {
    const { data: tasks } = await supabase.from('tasks').select('*')
    const { data: categories } = await supabase.from('categories').select('*')
    const { data: completions } = await supabase.from('task_completions').select('*')

    const exportData = { tasks, categories, completions, exported_at: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vasco-daily-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== 'DELETE') return
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
  }

  if (settingsLoading || profileLoading) {
    return <p className="text-slate-500 dark:text-slate-400">Loading settings...</p>
  }

  const inputClass =
    'p-2 rounded bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white outline-none'
  const cardClass = 'bg-white dark:bg-slate-800 p-4 rounded-lg'
  const labelClass = 'text-sm text-slate-600 dark:text-slate-300 block mb-1'

  return (
    <div className="space-y-4">
      {/* Profile */}
      <div className={cardClass}>
        <h2 className="text-slate-900 dark:text-white font-semibold mb-3">Profile</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Email: {user.email}</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <button
            onClick={handleSaveName}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className={cardClass}>
        <h2 className="text-slate-900 dark:text-white font-semibold mb-3">Notifications</h2>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">Browser Notifications</span>
              {settings.browser_notifications_enabled ? (
                <button
                  onClick={handleDisableBrowserNotifications}
                  className="text-sm bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-1 rounded"
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
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Notifications are blocked. Click the lock icon in your
                browser's address bar, find "Notifications," and set it to
                "Allow."
              </p>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Only works while this app is open in a browser tab.
            </p>

            {settings.browser_notifications_enabled && (
              <button
                onClick={() =>
                  new Notification('Test Notification', {
                    body: 'If you can see this, browser notifications are working!',
                  })
                }
                className="text-sm bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-1 rounded mt-2"
              >
                Send Test Notification
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-300 block mb-2">Email Reminders</span>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={`flex-1 ${inputClass} text-sm`}
              />
              <button
                onClick={handleSaveEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded text-sm"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {settings.email_notifications_enabled
                ? 'Email reminders are enabled.'
                : 'Save an email to enable email reminders.'}
            </p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className={cardClass}>
        <h2 className="text-slate-900 dark:text-white font-semibold mb-3">Preferences</h2>

        <div className="space-y-3">
          <div>
            <label className={labelClass}>Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={`flex-1 text-sm py-2 rounded ${
                  settings.theme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`flex-1 text-sm py-2 rounded ${
                  settings.theme !== 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => updateSettings({ timezone: e.target.value })}
              className={`w-full ${inputClass} text-sm`}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Clock Format</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateSettings({ clock_format: '12h' })}
                className={`flex-1 text-sm py-2 rounded ${
                  settings.clock_format === '12h'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                12-hour
              </button>
              <button
                onClick={() => updateSettings({ clock_format: '24h' })}
                className={`flex-1 text-sm py-2 rounded ${
                  settings.clock_format === '24h'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                24-hour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data & Account */}
      <div className={cardClass}>
        <h2 className="text-slate-900 dark:text-white font-semibold mb-3">Data & Account</h2>

        <button
          onClick={handleExportData}
          className="w-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white p-2 rounded text-sm mb-3"
        >
          Export My Data (JSON)
        </button>

        <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
          <p className="text-sm text-red-500 dark:text-red-400 mb-2">Danger Zone</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
            This permanently deletes your tasks, categories, and profile data.
            Type DELETE below to confirm.
          </p>
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className={`w-full ${inputClass} text-sm mb-2`}
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== 'DELETE'}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 rounded text-sm"
          >
            Delete My Account Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings