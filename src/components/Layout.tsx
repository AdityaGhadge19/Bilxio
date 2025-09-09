import React from 'react'
import { LogOut, Bell, Search, Plus, FileText, CreditCard, BarChart3, Settings, DollarSign, Target, Gem, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.svg'
import { useProfile } from '../hooks/useProfile'
import { useSettings } from '../contexts/SettingsContext'

interface LayoutProps {
  children: React.ReactNode
  activeTab: 'dashboard' | 'subscriptions' | 'documents' | 'budgets' | 'goals' | 'analytics'
  onTabChange: (tab: 'dashboard' | 'subscriptions' | 'documents' | 'budgets' | 'goals' | 'analytics') => void
  onShowAddSubscription?: () => void
  onShowAddDocument?: () => void
  onShowAddBudget?: () => void
  onShowAddGoal?: () => void
  onShowSettings?: () => void
}

export function Layout({
  children,
  activeTab,
  onTabChange,
  onShowAddSubscription,
  onShowAddDocument,
  onShowAddBudget,
  onShowAddGoal,
  onShowSettings
}: LayoutProps) {
  const { user, signOut } = useAuth()
  const { profile } = useProfile(user?.id)
  const { compactMode, showAnimations } = useSettings()

  const handleSignOut = async () => {
    alert("Are you sure you want to sign out?")
    await signOut()
  }

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subscriptions' as const, label: 'Subscriptions', icon: CreditCard },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    { id: 'budgets' as const, label: 'Budgets', icon: DollarSign },
    { id: 'goals' as const, label: 'Goals', icon: Target },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${compactMode ? 'h-12' : 'h-16'}`}>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 flex items-center gap-2">
                <img src={logo} alt="Bilxio Logo" className="h-8 w-8 mt-3" />
                <h1 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>
                  Bilxio
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                {activeTab === 'subscriptions' && onShowAddSubscription && (
                  <button
                    onClick={onShowAddSubscription}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 ${showAnimations ? 'transition-all duration-200' : ''}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Subscription
                  </button>
                )}
                {activeTab === 'documents' && onShowAddDocument && (
                  <button
                    onClick={onShowAddDocument}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 ${showAnimations ? 'transition-all duration-200' : ''}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Document
                  </button>
                )}
                {activeTab === 'budgets' && onShowAddBudget && (
                  <button
                    onClick={onShowAddBudget}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 ${showAnimations ? 'transition-all duration-200' : ''}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Budget
                  </button>
                )}
                {activeTab === 'goals' && onShowAddGoal && (
                  <button
                    onClick={onShowAddGoal}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 ${showAnimations ? 'transition-all duration-200' : ''}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-yellow-300 text-gray-900 hover:bg-yellow-400 transition mr-2">
                  <Gem className="h-4 w-4 block sm:hidden" />
                  <span className="hidden sm:inline">Upgrade to premium</span>
                </button>
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">{user?.email}</span>
                {onShowSettings && (
                  <button
                    onClick={onShowSettings}
                    className={`inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${showAnimations ? 'transition-colors duration-200' : ''}`}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className={`inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${showAnimations ? 'transition-colors duration-200' : ''}`}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${compactMode ? 'py-4' : 'py-8'}`}>
        {/* Navigation Tabs */}
        <div className={`flex flex-col gap-2 ${compactMode ? 'mb-4' : 'mb-8'}`}>
          <div className="flex space-x-1">

            <div className="bg-white dark:bg-gray-900 rounded-t-lg p-2 shadow-sm border gap-2 border-gray-200 dark:border-gray-700
             flex justify-around fixed bottom-0 left-0 right-0
             h-[10vh] md:h-auto
             md:static md:rounded-lg
             [&>*]:flex-1 text-center
             [&>*>span]:hidden md:[&>*>span]:inline
             [&>*>svg]:mx-auto md:[&>*>svg]:mr-2 md:[&>*>svg]:mx-0">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`inline-flex items-center justify-center md:justify-start ${compactMode ? 'px-3 py-1' : 'px-4 py-2'} text-sm font-medium rounded-md ${showAnimations ? 'transition-all duration-200' : ''} ${activeTab === tab.id ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>


          </div>
          <div className='ml-2 mt-4'>
            <span className="text-xl font-medium text-gray-700 dark:text-gray-200 font-extrabold">
              Hello{profile?.full_name ? `, ${profile.full_name}` : user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </span>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}