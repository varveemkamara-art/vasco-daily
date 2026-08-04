import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({ full_name: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (data) setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) setProfile(data)
    return { error }
  }

  return { profile, loading, updateProfile }
}