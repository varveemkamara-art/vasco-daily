import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchTasks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (!error) setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchTasks()
  }, [user])

  async function addTask(task) {
    const { error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: user.id }])

    if (!error) fetchTasks()
    return { error }
  }

  async function updateTask(id, updates) {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)

    if (!error) fetchTasks()
    return { error }
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) fetchTasks()
    return { error }
  }

  return { tasks, loading, addTask, updateTask, deleteTask, refetch: fetchTasks }
}