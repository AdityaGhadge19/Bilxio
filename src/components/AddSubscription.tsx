import React from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { Subscription } from '../lib/types'
import { useSettings } from '../contexts/SettingsContext'

interface AddSubscriptionProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => void
  editingSubscription?: Subscription
}

interface FormData {
  service_name: string
  cost: number
  renewal_date: string
  billing_cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  category: string
  notes: string
  is_active: boolean
}

export function AddSubscription({ isOpen, onClose, onSubmit, editingSubscription }: AddSubscriptionProps) {
  const { compactMode, showAnimations } = useSettings()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: editingSubscription ? {
      service_name: editingSubscription.service_name,
      cost: editingSubscription.cost,
      renewal_date: editingSubscription.renewal_date,
      billing_cycle: editingSubscription.billing_cycle,
      category: editingSubscription.category,
      notes: editingSubscription.notes || '',
      is_active: editingSubscription.is_active,
    } : {
      service_name: '',
      cost: 0,
      renewal_date: '',
      billing_cycle: 'monthly',
      category: 'other',
      notes: '',
      is_active: true,
    }
  })

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      user_id: '', // This will be set in the parent component
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
            {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
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
            <label htmlFor="service_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              id="service_name"
              {...register('service_name', { required: 'Service name is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Netflix, Spotify, etc."
            />
            {errors.service_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.service_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cost *
              </label>
              <input
                type="number"
                id="cost"
                step="0.01"
                {...register('cost', { required: 'Cost is required', min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="9.99"
              />
              {errors.cost && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cost.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="billing_cycle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Billing Cycle *
              </label>
              <select
                id="billing_cycle"
                {...register('billing_cycle', { required: 'Billing cycle is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="renewal_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Next Renewal *
              </label>
              <input
                type="date"
                id="renewal_date"
                {...register('renewal_date', { required: 'Renewal date is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {errors.renewal_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.renewal_date.message}</p>
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
                <option value="entertainment">Entertainment</option>
                <option value="productivity">Productivity</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              {...register('notes')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Optional notes about this subscription"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Active subscription
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
              {editingSubscription ? 'Update' : 'Add'} Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}