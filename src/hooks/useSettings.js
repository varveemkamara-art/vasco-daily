import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const DEFAULTS = {
  browser_notifications_enabled: false,
  whatsapp_notifications_enabled: false,
  whatsapp_number: '',
  email_notifications_enabled: false,
  notification_email: '',
  default_notification_method: 'browser',
  timezone: 'UTC',
  clock_format: '24h',
}

export function useSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  async function fetchSettings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!error && data) {
      setSettings(data)
    } else {
      // No row yet — create one with defaults
      const { data: created } = await supabase
        .from('user_settings')
        .insert([{ user_id: user.id, ...DEFAULTS }])
        .select()
        .single()
      if (created) setSettings(created)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchSettings()
  }, [user])

  async function updateSettings(updates) {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single()

    if (!error && data) setSettings(data)
    return { error }
  }

  return { settings, loading, updateSettings }
}