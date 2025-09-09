import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Document } from '../lib/types'

export function useDocuments(userId: string | undefined) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    fetchDocuments()

    // Set up real-time subscription
    const subscription = supabase
      .channel('documents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDocuments(prev => [...prev, payload.new as Document])
          } else if (payload.eventType === 'UPDATE') {
            setDocuments(prev =>
              prev.map(doc =>
                doc.id === payload.new.id ? payload.new as Document : doc
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setDocuments(prev =>
              prev.filter(doc => doc.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const addDocument = async (document: Omit<Document, 'id' | 'upload_date'>) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([document])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const { data, error } = await supabase
        .from('documents')
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

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments
  }
}