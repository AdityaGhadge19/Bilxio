import React, { useState } from 'react'
import { Target, Edit3, Trash2, MoreVertical, Plus } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { Goal } from '../lib/types'
import { useSettings } from '../contexts/SettingsContext'

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  onAddContribution: (goalId: string, amount: number, description: string) => void
}

export function GoalCard({ goal, onEdit, onDelete, onAddContribution }: GoalCardProps) {
  const { compactMode, showAnimations } = useSettings()
  const [showMenu, setShowMenu] = useState(false)
  const [showContribution, setShowContribution] = useState(false)
  const [contributionAmount, setContributionAmount] = useState('')
  const [contributionDescription, setContributionDescription] = useState('')

  const progressPercentage = (goal.current_amount / goal.target_amount) * 100
  const remainingAmount = goal.target_amount - goal.current_amount
  const isCompleted = progressPercentage >= 100

  const getEstimatedCompletion = () => {
    if (isCompleted || !goal.end_date) return null
    
    const daysRemaining = differenceInDays(new Date(goal.end_date), new Date())
    if (daysRemaining <= 0) return 'Overdue'
    
    return `${daysRemaining} days remaining`
  }

  const handleAddContribution = () => {
    const amount = parseFloat(contributionAmount)
    if (amount > 0 && contributionDescription.trim()) {
      onAddContribution(goal.id, amount, contributionDescription)
      setContributionAmount('')
      setContributionDescription('')
      setShowContribution(false)
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-all duration-200' : ''} group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-600' : 'bg-gray-900 dark:bg-white'}`}>
            <Target className={`h-5 w-5 ${isCompleted ? 'text-white' : 'text-white dark:text-gray-900'}`} />
          </div>
          <div>
            <h3 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white`}>
              {goal.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ${goal.current_amount.toFixed(2)} of ${goal.target_amount.toFixed(2)}
            </p>
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
                  setShowContribution(true)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contribution
              </button>
              <button
                onClick={() => {
                  onEdit(goal)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(goal.id)
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
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className={`text-sm font-medium ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {Math.min(progressPercentage, 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-900 dark:bg-white'} ${showAnimations ? 'transition-all duration-300' : ''}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Remaining Amount */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isCompleted ? 'Goal Completed!' : 'Remaining'}
          </span>
          <span className={`text-sm font-medium ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
            {isCompleted ? '🎉' : `$${remainingAmount.toFixed(2)}`}
          </span>
        </div>

        {/* Timeline */}
        {goal.end_date && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Target Date</span>
            <span className="text-sm text-gray-900 dark:text-white">
              {format(new Date(goal.end_date), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        {getEstimatedCompletion() && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            <span className={`text-sm ${getEstimatedCompletion() === 'Overdue' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {getEstimatedCompletion()}
            </span>
          </div>
        )}

        {/* Contribution Frequency */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Frequency</span>
          <span className="text-sm text-gray-900 dark:text-white capitalize">
            {goal.contribution_frequency}
          </span>
        </div>
      </div>

      {/* Add Contribution Modal */}
      {showContribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-sm w-full border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Contribution</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={contributionDescription}
                  onChange={(e) => setContributionDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Monthly savings, bonus, etc."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContribution(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContribution}
                  className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}