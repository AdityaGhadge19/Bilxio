import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data)
        setLoading(false)
      })
  }, [userId])

  return { profile, loading }
}