
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Goal } from '../lib/types'

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    fetchGoals()

    // ✅ Setup real-time subscription (no filter param)
    const channel = supabase
      .channel('goals-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'goals' },
        (payload) => {
          const newGoal = payload.new as Goal | null
          const oldGoal = payload.old as Goal | null

          // Only handle events for this user
          if (newGoal?.user_id !== userId && oldGoal?.user_id !== userId) return

          if (payload.eventType === 'INSERT' && newGoal) {
            setGoals((prev) => [...prev, newGoal])
          } else if (payload.eventType === 'UPDATE' && newGoal) {
            setGoals((prev) =>
              prev.map((goal) =>
                goal.id === newGoal.id ? newGoal : goal
              )
            )
          } else if (payload.eventType === 'DELETE' && oldGoal) {
            setGoals((prev) =>
              prev.filter((goal) => goal.id !== oldGoal.id)
            )
          }
        }
      )
      .subscribe()

    // ✅ Proper cleanup
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const addGoal = async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([goal])
        .select()
        .single()

      if (error) throw error

      // ✅ Optimistic update
      if (data) {
        setGoals((prev) => [...prev, data])
      }

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
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

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  const addContribution = async (goalId: string, amount: number, description: string) => {
    try {
      // Add the transaction first
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: userId,
          goal_id: goalId,
          amount,
          description,
          category: 'goal_contribution',
          transaction_type: 'goal_contribution'
        }])

      if (transactionError) throw transactionError

      // Then update the goal's current amount
      const goal = goals.find(g => g.id === goalId)
      if (goal) {
        const newAmount = goal.current_amount + amount
        await updateGoal(goalId, { current_amount: newAmount })
      }

      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    refetch: fetchGoals,
  }
}