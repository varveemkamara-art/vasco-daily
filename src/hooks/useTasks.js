import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { getOccurrences } from '../utils/recurrence'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchTasks() {
    setLoading(true)

    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    const { data: completionData, error: completionError } = await supabase
      .from('task_completions')
      .select('*')

    if (!taskError) setTasks(taskData)
    if (!completionError) setCompletions(completionData)
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchTasks()
  }, [user])

  // Expand recurring tasks into individual occurrences for display
  const occurrences = tasks.flatMap((task) => {
    const dates = getOccurrences(task)
    return dates.map((occDate) => {
      const isCompleted = task.is_recurring
        ? completions.some(
            (c) => c.task_id === task.id && c.completed_date === occDate
          )
        : task.status === 'completed'

      return {
        ...task,
        occurrenceDate: occDate,
        // A stable unique key for React lists
        occurrenceId: `${task.id}_${occDate}`,
        isCompleted,
      }
    })
  })

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

  async function toggleOccurrence(task, occurrenceDate) {
    if (!task.is_recurring) {
      // Simple one-time task: just flip its status
      return updateTask(task.id, {
        status: task.status === 'completed' ? 'pending' : 'completed',
      })
    }

    // Recurring task: check if this specific date is already completed
    const existing = completions.find(
      (c) => c.task_id === task.id && c.completed_date === occurrenceDate
    )

    if (existing) {
      const { error } = await supabase
        .from('task_completions')
        .delete()
        .eq('id', existing.id)
      if (!error) fetchTasks()
      return { error }
    } else {
      const { error } = await supabase.from('task_completions').insert([
        {
          task_id: task.id,
          user_id: user.id,
          completed_date: occurrenceDate,
        },
      ])
      if (!error) fetchTasks()
      return { error }
    }
  }

  return {
    tasks,
    occurrences,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleOccurrence,
  }
}