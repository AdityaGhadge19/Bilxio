
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Budget } from '../lib/types'

export function useBudgets(userId: string | undefined) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    fetchBudgets()

    // ✅ Setup real-time subscription
    const channel = supabase
      .channel('budgets-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'budgets' },
        (payload) => {
          const newBudget = payload.new as Budget | null
          const oldBudget = payload.old as Budget | null

          // Only handle events for this user
          if (newBudget?.user_id !== userId && oldBudget?.user_id !== userId) return

          if (payload.eventType === 'INSERT' && newBudget) {
            setBudgets((prev) => [...prev, newBudget])
          } else if (payload.eventType === 'UPDATE' && newBudget) {
            setBudgets((prev) =>
              prev.map((budget) =>
                budget.id === newBudget.id ? newBudget : budget
              )
            )
          } else if (payload.eventType === 'DELETE' && oldBudget) {
            setBudgets((prev) =>
              prev.filter((budget) => budget.id !== oldBudget.id)
            )
          }
        }
      )
      .subscribe()

    // ✅ Cleanup correctly
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('category', { ascending: true })

      if (error) throw error
      setBudgets(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const addBudget = async (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([budget])
        .select()
        .single()

      if (error) throw error

      // ✅ Optimistically update state
      if (data) {
        setBudgets((prev) => [...prev, data])
      }

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  }
}