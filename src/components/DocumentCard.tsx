import React, { useState } from 'react'
import { FileText, Download, Edit3, Trash2, MoreVertical, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { Document } from '../lib/types'
import { useSettings } from '../contexts/SettingsContext'

interface DocumentCardProps {
  document: Document
  onEdit: (document: Document) => void
  onDelete: (id: string) => void
}

export function DocumentCard({ document, onEdit, onDelete }: DocumentCardProps) {
  const { compactMode, showAnimations } = useSettings()
  const [showMenu, setShowMenu] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'receipts': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
      case 'contracts': return 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
      case 'invoices': return 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white'
      case 'warranties': return 'bg-gray-400 dark:bg-gray-500 text-white dark:text-gray-100'
      case 'insurance': return 'bg-gray-500 dark:bg-gray-400 text-white dark:text-gray-900'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleView = () => {
    window.open(document.file_url, '_blank')
  }

  const handleDownload = () => {
    const link = window.document.createElement('a')
    link.href = document.file_url
    link.download = document.file_name
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
  }

  return (
    <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-all duration-200' : ''} group overflow-hidden`} style={{ maxWidth: '100%' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
            <FileText className="h-5 w-5 text-white dark:text-gray-900" />
          </div>
          <div>
            <h3 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 ${showAnimations ? 'transition-colors duration-200' : ''} line-clamp-2 break-words`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {document.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{document.file_name}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${showAnimations ? 'transition-colors duration-200' : ''}`}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 -mt-6 mr-6 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <button
                onClick={() => {
                  handleView()
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View
              </button>
              <button
                onClick={() => {
                  handleDownload()
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => {
                  onEdit(document)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(document.id)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(document.category)}`}>
            {document.category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatFileSize(document.file_size)}
          </span>
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {document.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Uploaded {format(new Date(document.upload_date), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  )
}