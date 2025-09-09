import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Upload, FileText } from 'lucide-react'
import { Document } from '../lib/types'
import { uploadDocument } from '../lib/supabase'
import { useSettings } from '../contexts/SettingsContext'

interface AddDocumentProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Document, 'id' | 'upload_date'>) => void
  editingDocument?: Document
  userId: string
}

interface FormData {
  title: string
  category: string
  tags: string
}

export function AddDocument({ isOpen, onClose, onSubmit, editingDocument, userId }: AddDocumentProps) {
  const { compactMode, showAnimations } = useSettings()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: editingDocument ? {
      title: editingDocument.title,
      category: editingDocument.category,
      tags: editingDocument.tags?.join(', ') || '',
    } : {
      title: '',
      category: 'general',
      tags: '',
    }
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleFormSubmit = async (data: FormData) => {
    if (!editingDocument && !file) {
      alert('Please select a file to upload')
      return
    }

    setUploading(true)
    try {
      let fileUrl = editingDocument?.file_url || ''
      let fileName = editingDocument?.file_name || ''
      let fileSize = editingDocument?.file_size || 0

      if (file) {
        const { url } = await uploadDocument(file, userId)
        fileUrl = url
        fileName = file.name
        fileSize = file.size
      }

      const tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)

      onSubmit({
        title: data.title,
        category: data.category,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        tags,
        user_id: userId,
      })

      reset()
      setFile(null)
      onClose()
    } catch (error) {
      console.error('Error uploading document:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('Bucket not found')) {
        alert('Storage bucket not found. Please create a "documents" bucket in your Supabase Storage dashboard first.')
      } else {
        alert(`Error uploading document: ${errorMessage}. Please try again.`)
      }
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className={`flex items-center justify-between ${compactMode ? 'p-4' : 'p-6'} border-b border-gray-200 dark:border-gray-700`}>
          <h2 className={`${compactMode ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 dark:text-white`}>
            {editingDocument ? 'Edit Document' : 'Add New Document'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md ${showAnimations ? 'transition-colors duration-200' : ''}`}
          >
            <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className={`${compactMode ? 'p-4' : 'p-6'} space-y-4`}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title', { required: 'Document title is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Receipt, Contract, Invoice, etc."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="receipts">Receipts</option>
              <option value="contracts">Contracts</option>
              <option value="invoices">Invoices</option>
              <option value="warranties">Warranties</option>
              <option value="insurance">Insurance</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              {...register('tags')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="tag1, tag2, tag3"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate tags with commas</p>
          </div>

          {!editingDocument && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload File *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg ${compactMode ? 'p-4' : 'p-6'} text-center ${showAnimations ? 'transition-colors duration-200' : ''} ${
                  dragActive
                    ? 'border-gray-400 bg-gray-50 dark:bg-gray-800'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Drag and drop a file here, or click to select
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`inline-block px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 cursor-pointer ${showAnimations ? 'transition-colors duration-200' : ''}`}
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 ${showAnimations ? 'transition-colors duration-200' : ''}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 ${showAnimations ? 'transition-all duration-200' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {uploading ? 'Uploading...' : editingDocument ? 'Update' : 'Upload'} Document
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}