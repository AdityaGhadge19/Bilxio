import React from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { Goal } from '../lib/types'
import { useSettings } from '../contexts/SettingsContext'

interface AddGoalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => void
  editingGoal?: Goal
}

interface FormData {
  name: string
  target_amount: number
  start_date: string
  end_date: string
  contribution_frequency: 'weekly' | 'monthly' | 'custom'
  is_active: boolean
}

export function AddGoal({ isOpen, onClose, onSubmit, editingGoal }: AddGoalProps) {
  const { compactMode, showAnimations } = useSettings()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: editingGoal ? {
      name: editingGoal.name,
      target_amount: editingGoal.target_amount,
      start_date: editingGoal.start_date,
      end_date: editingGoal.end_date || '',
      contribution_frequency: editingGoal.contribution_frequency,
      is_active: editingGoal.is_active,
    } : {
      name: '',
      target_amount: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      contribution_frequency: 'monthly',
      is_active: true,
    }
  })

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      user_id: '', // This will be set in the parent component
      current_amount: editingGoal?.current_amount || 0,
      end_date: data.end_date || null,
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
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Goal Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Goal name is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Emergency Fund, Vacation, etc."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Amount *
            </label>
            <input
              type="number"
              id="target_amount"
              step="0.01"
              {...register('target_amount', { required: 'Target amount is required', min: 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="5000.00"
            />
            {errors.target_amount && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.target_amount.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                {...register('start_date', { required: 'Start date is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                id="end_date"
                {...register('end_date')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contribution_frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contribution Frequency
            </label>
            <select
              id="contribution_frequency"
              {...register('contribution_frequency')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Active goal
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
              {editingGoal ? 'Update' : 'Add'} Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}