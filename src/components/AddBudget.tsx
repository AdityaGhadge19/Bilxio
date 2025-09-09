import React from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { Budget } from '../lib/types'
import { useSettings } from '../contexts/SettingsContext'

interface AddBudgetProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => void
  editingBudget?: Budget
}

interface FormData {
  category: string
  monthly_limit: number
  alert_threshold: number
  is_active: boolean
}

const BUDGET_CATEGORIES = [
  'food',
  'rent',
  'entertainment',
  'transportation',
  'subscriptions',
  'utilities',
  'healthcare',
  'shopping',
  'education',
  'miscellaneous'
]

export function AddBudget({ isOpen, onClose, onSubmit, editingBudget }: AddBudgetProps) {
  const { compactMode, showAnimations } = useSettings()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: editingBudget ? {
      category: editingBudget.category,
      monthly_limit: editingBudget.monthly_limit,
      alert_threshold: editingBudget.alert_threshold,
      is_active: editingBudget.is_active,
    } : {
      category: 'miscellaneous',
      monthly_limit: 0,
      alert_threshold: 80,
      is_active: true,
    }
  })

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      user_id: '', // This will be set in the parent component
      current_spending: editingBudget?.current_spending || 0,
    })
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className={`flex items-center justify-between ${compactMode ? 'p-4' : 'p-6'} border-b border-gray-200 dark:border-gray-700`}>
          <h2 className={`${compactMode ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 dark:text-white`}>
            {editingBudget ? 'Edit Budget' : 'Add New Budget'}
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {BUDGET_CATEGORIES.map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="monthly_limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Limit *
            </label>
            <input
              type="number"
              id="monthly_limit"
              step="0.01"
              {...register('monthly_limit', { required: 'Monthly limit is required', min: 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="500.00"
            />
            {errors.monthly_limit && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.monthly_limit.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="alert_threshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alert Threshold (%)
            </label>
            <input
              type="number"
              id="alert_threshold"
              min="1"
              max="100"
              {...register('alert_threshold', { min: 1, max: 100 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="80"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Get notified when spending reaches this percentage of your limit
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Active budget
            </label>
          </div>

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
              className={`flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 ${showAnimations ? 'transition-all duration-200' : ''}`}
            >
              {editingBudget ? 'Update' : 'Add'} Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}