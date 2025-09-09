import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket name for documents
export const DOCUMENTS_BUCKET = 'documents'

// Helper function to upload document
export const uploadDocument = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(DOCUMENTS_BUCKET)
    .getPublicUrl(fileName)

  return {
    path: data.path,
    url: publicUrl
  }
}

// Helper function to delete document
export const deleteDocument = async (path: string) => {
  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .remove([path])

  if (error) {
    throw error
  }
}