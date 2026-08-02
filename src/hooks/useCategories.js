import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (!user) return

    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (!error) setCategories(data)
    }

    fetchCategories()
  }, [user])

  return { categories }
}