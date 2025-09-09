import { useRef, useEffect, useState } from 'react'
import { Calendar, DollarSign, FileText, CreditCard, TrendingUp, Clock, Target, AlertTriangle } from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import { Subscription, Document, Budget, Goal, DashboardStats } from '../lib/types'
import { useSettings } from '../contexts/SettingsContext'

interface DashboardProps {
  subscriptions: Subscription[]
  documents: Document[]
  budgets: Budget[]
  goals: Goal[]
  stats: DashboardStats
}

export function Dashboard({ subscriptions, documents, budgets, goals, stats }: DashboardProps) {
  const { compactMode, showAnimations } = useSettings()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const cardCount = 6

  // Auto-rotate carousel on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (!isMobile) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % cardCount)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to card on index change (mobile only)
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (!isMobile) return
    if (carouselRef.current) {
      const card = carouselRef.current.children[currentIndex] as HTMLElement
      if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [currentIndex])
  const today = new Date()
  const nextWeek = addDays(today, 7)

  const upcomingRenewals = subscriptions.filter(sub => {
    const renewalDate = new Date(sub.renewal_date)
    return isAfter(renewalDate, today) && isBefore(renewalDate, nextWeek) && sub.is_active
  })

  const alertBudgets = budgets.filter(budget => {
    const spentPercentage = (budget.current_spending / budget.monthly_limit) * 100
    return spentPercentage >= budget.alert_threshold && budget.is_active
  })

  const activeGoals = goals.filter(goal => goal.is_active)
  const recentDocuments = documents.slice(0, 5)

  return (
    <div className="space-y-6">
  {/* Stats Cards: Carousel on mobile, grid on md+ */}
  <div ref={carouselRef} className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:grid-cols-5 md:overflow-x-visible md:gap-4 scrollbar-hide snap-x snap-mandatory">
  <div className={`min-w-[85vw] md:min-w-0 bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-shadow duration-200' : ''} snap-center h-[30vh] flex flex-col justify-center items-center md:h-auto md:items-start md:justify-start`}>
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="p-2 bg-gray-900 dark:bg-white rounded-lg mb-2">
        <DollarSign className="h-8 w-8 text-white dark:text-gray-900" />
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">Monthly Spend</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalMonthlySpend.toFixed(2)}</p>
    </div>
  </div>

  <div className={`min-w-[85vw] md:min-w-0 bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-shadow duration-200' : ''} snap-center h-[30vh] flex flex-col justify-center items-center md:h-auto md:items-start md:justify-start`}>
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="p-2 bg-gray-900 dark:bg-white rounded-lg mb-2">
        <CreditCard className="h-8 w-8 text-white dark:text-gray-900" />
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">Active Subscriptions</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</p>
    </div>
  </div>

  <div className={`min-w-[85vw] md:min-w-0 bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-shadow duration-200' : ''} snap-center h-[30vh] flex flex-col justify-center items-center md:h-auto md:items-start md:justify-start`}>
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="p-2 bg-gray-900 dark:bg-white rounded-lg mb-2">
        <Clock className="h-8 w-8 text-white dark:text-gray-900" />
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">Upcoming Renewals</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingRenewals.length}</p>
    </div>
  </div>

  <div className={`min-w-[85vw] md:min-w-0 bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-shadow duration-200' : ''} snap-center h-[30vh] flex flex-col justify-center items-center md:h-auto md:items-start md:justify-start`}>
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="p-2 bg-gray-900 dark:bg-white rounded-lg mb-2">
        <FileText className="h-8 w-8 text-white dark:text-gray-900" />
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">Documents</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.documentsCount}</p>
    </div>
  </div>

  <div className={`min-w-[85vw] md:min-w-0 bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-shadow duration-200' : ''} snap-center h-[30vh] flex flex-col justify-center items-center md:h-auto md:items-start md:justify-start`}>
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="p-2 bg-gray-900 dark:bg-white rounded-lg mb-2">
        <DollarSign className="h-8 w-8 text-white dark:text-gray-900" />
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">Budget Usage</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBudgetLimit > 0 ? `${((stats.totalBudgetSpent / stats.totalBudgetLimit) * 100).toFixed(1)}%` : '0%'}</p>
    </div>
  </div>

  <div className={`min-w-[85vw] md:min-w-0 bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md ${showAnimations ? 'transition-shadow duration-200' : ''} snap-center h-[30vh] flex flex-col justify-center items-center md:h-auto md:items-start md:justify-start`}>
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="p-2 bg-gray-900 dark:bg-white rounded-lg mb-2">
        <Target className="h-8 w-8 text-white dark:text-gray-900" />
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">Goals Progress</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGoalProgress.toFixed(1)}%</p>
    </div>
  </div>
      </div>

      {/* Budget Alerts */}
      {alertBudgets.length > 0 && (
        <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl ${compactMode ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <h2 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-yellow-800 dark:text-yellow-200`}>Budget Alerts</h2>
          </div>
          <div className="space-y-2">
            {alertBudgets.map((budget) => {
              const spentPercentage = (budget.current_spending / budget.monthly_limit) * 100
              const isOverBudget = spentPercentage > 100
              return (
                <div key={budget.id} className="flex items-center justify-between">
                  <span className="text-sm text-yellow-800 dark:text-yellow-200 capitalize">{budget.category}</span>
                  <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {isOverBudget ? 'Over budget' : `${spentPercentage.toFixed(1)}% used`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Renewals */}
        <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white`}>Upcoming Renewals</h2>
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {upcomingRenewals.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No renewals in the next 7 days
              </p>
            ) : (
              upcomingRenewals.map((subscription) => (
                <div key={subscription.id} className={`flex items-center justify-between ${compactMode ? 'p-3' : 'p-4'} bg-gray-50 dark:bg-gray-800 rounded-lg`}>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{subscription.service_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Renews {format(new Date(subscription.renewal_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${subscription.cost}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{subscription.billing_cycle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white`}>Recent Documents</h2>
            <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentDocuments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No documents uploaded yet
              </p>
            ) : (
              recentDocuments.map((document) => (
                <div key={document.id} className={`flex items-center justify-between ${compactMode ? 'p-3' : 'p-4'} bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${showAnimations ? 'transition-colors duration-200' : ''}`}>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{document.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{document.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(document.upload_date), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Goals */}
        <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white`}>Active Goals</h2>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {activeGoals.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No active goals
              </p>
            ) : (
              activeGoals.slice(0, 5).map((goal) => {
                const progressPercentage = (goal.current_amount / goal.target_amount) * 100
                return (
                  <div key={goal.id} className={`${compactMode ? 'p-3' : 'p-4'} bg-gray-50 dark:bg-gray-800 rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">{goal.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{progressPercentage.toFixed(1)}%</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${progressPercentage >= 100 ? 'bg-green-500' : 'bg-gray-900 dark:bg-white'}`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ${goal.current_amount.toFixed(2)} of ${goal.target_amount.toFixed(2)}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Yearly Projection */}
      <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white`}>Yearly Projection</h2>
          <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${compactMode ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 dark:text-white`}>
              ${stats.totalYearlySpend.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Estimated yearly spend based on current subscriptions
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Average per month: ${(stats.totalYearlySpend / 12).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}