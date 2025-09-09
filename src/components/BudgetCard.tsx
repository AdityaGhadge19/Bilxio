import React, { useState } from 'react'
import { DollarSign, Edit3, Trash2, MoreVertical, AlertTriangle } from 'lucide-react'
import { Budget } from '../lib/types'
import { useSettings } from '../contexts/SettingsContext'

interface BudgetCardProps {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { compactMode, showAnimations } = useSettings()
  const [showMenu, setShowMenu] = useState(false)

  const spentPercentage = (budget.current_spending / budget.monthly_limit) * 100
  const remainingAmount = budget.monthly_limit - budget.current_spending
  const isOverBudget = spentPercentage > 100
  const isNearLimit = spentPercentage >= budget.alert_threshold

  const getProgressBarColor = () => {
    if (isOverBudget) return 'bg-red-500'
    if (isNearLimit) return 'bg-yellow-500'
    return 'bg-gray-900 dark:bg-white'
  }

  const getStatusColor = () => {
    if (isOverBudget) return 'text-red-600 dark:text-red-400'
    if (isNearLimit) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-all duration-200' : ''} group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
            <DollarSign className="h-5 w-5 text-white dark:text-gray-900" />
          </div>
          <div>
            <h3 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white capitalize`}>
              {budget.category}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ${budget.current_spending.toFixed(2)} of ${budget.monthly_limit.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {(isOverBudget || isNearLimit) && (
            <AlertTriangle className={`h-4 w-4 ${isOverBudget ? 'text-red-500' : 'text-yellow-500'}`} />
          )}
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
                    onEdit(budget)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(budget.id)
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
      </div>

      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {Math.min(spentPercentage, 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressBarColor()} ${showAnimations ? 'transition-all duration-300' : ''}`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Remaining Amount */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
          <span className={`text-sm font-medium ${remainingAmount >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
            ${remainingAmount >= 0 ? remainingAmount.toFixed(2) : `(${Math.abs(remainingAmount).toFixed(2)})`}
          </span>
        </div>

        {/* Status Messages */}
        {isOverBudget && (
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-xs text-red-600 dark:text-red-400">
              Over budget by ${Math.abs(remainingAmount).toFixed(2)}
            </p>
          </div>
        )}
        {isNearLimit && !isOverBudget && (
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Approaching budget limit ({budget.alert_threshold}%)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}