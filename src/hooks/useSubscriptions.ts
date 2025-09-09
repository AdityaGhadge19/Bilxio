import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Subscription } from '../lib/types'

export function useSubscriptions(userId: string | undefined) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    fetchSubscriptions()

    // Set up real-time subscription
    const subscription = supabase
      .channel('subscriptions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSubscriptions(prev => [...prev, payload.new as Subscription])
          } else if (payload.eventType === 'UPDATE') {
            setSubscriptions(prev =>
              prev.map(sub =>
                sub.id === payload.new.id ? payload.new as Subscription : sub
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setSubscriptions(prev =>
              prev.filter(sub => sub.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('renewal_date', { ascending: true })

      if (error) throw error
      setSubscriptions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const addSubscription = async (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscription])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
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

  const deleteSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  return {
    subscriptions,
    loading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refetch: fetchSubscriptions
  }
}