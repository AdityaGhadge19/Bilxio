import React, { useState } from 'react'
import { Calendar, DollarSign, Edit3, Trash2, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'
import { Subscription } from '../lib/types'
import { useSettings } from '../contexts/SettingsContext'

interface SubscriptionCardProps {
  subscription: Subscription
  onEdit: (subscription: Subscription) => void
  onDelete: (id: string) => void
}

export function SubscriptionCard({ subscription, onEdit, onDelete }: SubscriptionCardProps) {
  const { compactMode, showAnimations } = useSettings()
  const [showMenu, setShowMenu] = useState(false)

  const getBillingCycleColor = (cycle: string) => {
    switch (cycle) {
      case 'weekly': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
      case 'monthly': return 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
      case 'quarterly': return 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white'
      case 'yearly': return 'bg-gray-900 dark:bg-gray-300 text-white dark:text-gray-900'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'entertainment': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
      case 'productivity': return 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
      case 'business': return 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white'
      case 'health': return 'bg-gray-400 dark:bg-gray-500 text-white dark:text-gray-100'
      case 'education': return 'bg-gray-500 dark:bg-gray-400 text-white dark:text-gray-900'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-all duration-200' : ''} group`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 ${showAnimations ? 'transition-colors duration-200' : ''}`}>
            {subscription.service_name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(subscription.category)}`}>
              {subscription.category}
            </span>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getBillingCycleColor(subscription.billing_cycle)}`}>
              {subscription.billing_cycle}
            </span>
            {!subscription.is_active && (
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Inactive
              </span>
            )}
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
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <button
                onClick={() => {
                  onEdit(subscription)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(subscription.id)
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
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="text-sm">Cost</span>
          </div>
          <span className={`${compactMode ? 'text-lg' : 'text-xl'} font-bold text-gray-900 dark:text-white`}>${subscription.cost}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">Next renewal</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {format(new Date(subscription.renewal_date), 'MMM dd, yyyy')}
          </span>
        </div>

        {subscription.notes && (
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}