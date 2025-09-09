import React, { useState, useMemo } from 'react'
import { useAuth } from './hooks/useAuth'
import { useSubscriptions } from './hooks/useSubscriptions'
import { useDocuments } from './hooks/useDocuments'
import { useBudgets } from './hooks/useBudgets'
import { useGoals } from './hooks/useGoals'
import { useSettings } from './contexts/SettingsContext'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { SubscriptionCard } from './components/SubscriptionCard'
import { DocumentCard } from './components/DocumentCard'
import { BudgetCard } from './components/BudgetCard'
import { GoalCard } from './components/GoalCard'
import { AddSubscription } from './components/AddSubscription'
import { AddDocument } from './components/AddDocument'
import { AddBudget } from './components/AddBudget'
import { AddGoal } from './components/AddGoal'
import { SettingsPanel } from './components/SettingsPanel'
import { SearchBar } from './components/SearchBar'
import { Auth } from './components/Auth'
import { Subscription, Document, Budget, Goal, DashboardStats } from './lib/types'

type TabType = 'dashboard' | 'subscriptions' | 'documents' | 'budgets' | 'goals' | 'analytics'

function App() {
  const { user, loading: authLoading } = useAuth()
  const { compactMode } = useSettings()
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription, refetch: refetchSubscriptions } = useSubscriptions(user?.id)
  const { documents, addDocument, updateDocument, deleteDocument, refetch: refetchDocuments } = useDocuments(user?.id)
  const { budgets, addBudget, updateBudget, deleteBudget, refetch: refetchBudgets } = useBudgets(user?.id)
  const { goals, addGoal, updateGoal, deleteGoal, addContribution, refetch: refetchGoals } = useGoals(user?.id)
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [showAddSubscription, setShowAddSubscription] = useState(false)
  const [showAddDocument, setShowAddDocument] = useState(false)
  const [showAddBudget, setShowAddBudget] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>()
  const [editingDocument, setEditingDocument] = useState<Document | undefined>()
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>()
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  // Calculate dashboard stats
  const stats = useMemo((): DashboardStats => {
    const activeSubscriptions = subscriptions.filter(sub => sub.is_active)
    const activeBudgets = budgets.filter(budget => budget.is_active)
    const activeGoals = goals.filter(goal => goal.is_active)
    
    const monthlySpend = activeSubscriptions.reduce((total, sub) => {
      switch (sub.billing_cycle) {
        case 'weekly': return total + (sub.cost * 4.33)
        case 'monthly': return total + sub.cost
        case 'quarterly': return total + (sub.cost / 3)
        case 'yearly': return total + (sub.cost / 12)
        default: return total + sub.cost
      }
    }, 0)

    const totalBudgetLimit = activeBudgets.reduce((total, budget) => total + budget.monthly_limit, 0)
    const totalBudgetSpent = activeBudgets.reduce((total, budget) => total + budget.current_spending, 0)
    const totalGoalProgress = activeGoals.length > 0 
      ? activeGoals.reduce((total, goal) => total + (goal.current_amount / goal.target_amount), 0) / activeGoals.length * 100
      : 0

    return {
      totalMonthlySpend: monthlySpend,
      totalYearlySpend: monthlySpend * 12,
      activeSubscriptions: activeSubscriptions.length,
      upcomingRenewals: 0, // Calculated in Dashboard component
      documentsCount: documents.length,
      totalBudgetLimit,
      totalBudgetSpent,
      activeGoals: activeGoals.length,
      totalGoalProgress
    }
  }, [subscriptions, documents, budgets, goals])

  // Filter data based on search and category
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const matchesSearch = sub.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !filterCategory || sub.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [subscriptions, searchQuery, filterCategory])

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = !filterCategory || doc.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [documents, searchQuery, filterCategory])

  const filteredBudgets = useMemo(() => {
    return budgets.filter(budget => {
      const matchesSearch = budget.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !filterCategory || budget.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [budgets, searchQuery, filterCategory])

  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      const matchesSearch = goal.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [goals, searchQuery])

  // Get unique categories
  const subscriptionCategories = useMemo(() => {
    return [...new Set(subscriptions.map(sub => sub.category))]
  }, [subscriptions])

  const documentCategories = useMemo(() => {
    return [...new Set(documents.map(doc => doc.category))]
  }, [documents])

  const budgetCategories = useMemo(() => {
    return [...new Set(budgets.map(budget => budget.category))]
  }, [budgets])

  const handleAddSubscription = async (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    const subscriptionData = { ...data, user_id: user.id }
    if (editingSubscription) {
      await updateSubscription(editingSubscription.id, subscriptionData)
      setEditingSubscription(undefined)
    } else {
      await addSubscription(subscriptionData)
    }
    setShowAddSubscription(false)
    refetchSubscriptions()
  }

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setShowAddSubscription(true)
  }

  const handleDeleteSubscription = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      await deleteSubscription(id)
      refetchSubscriptions()
    }
  }

  const handleAddDocument = async (data: Omit<Document, 'id' | 'upload_date'>) => {
    if (!user) return
    if (editingDocument) {
      await updateDocument(editingDocument.id, data)
      setEditingDocument(undefined)
    } else {
      await addDocument(data)
    }
    setShowAddDocument(false)
    refetchDocuments()
  }

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document)
    setShowAddDocument(true)
  }

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id)
      refetchDocuments()
    }
  }

  const handleAddBudget = async (data: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    const budgetData = { ...data, user_id: user.id }
    if (editingBudget) {
      await updateBudget(editingBudget.id, budgetData)
      setEditingBudget(undefined)
    } else {
      await addBudget(budgetData)
    }
    setShowAddBudget(false)
    refetchBudgets()
  }

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setShowAddBudget(true)
  }

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id)
      refetchBudgets()
    }
  }

  const handleAddGoal = async (data: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    const goalData = { ...data, user_id: user.id }
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData)
      setEditingGoal(undefined)
    } else {
      await addGoal(goalData)
    }
    setShowAddGoal(false)
    refetchGoals()
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setShowAddGoal(true)
  }

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id)
      refetchGoals()
    }
  }

  const handleAddContribution = async (goalId: string, amount: number, description: string) => {
    await addContribution(goalId, amount, description)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onShowAddSubscription={() => setShowAddSubscription(true)}
      onShowAddDocument={() => setShowAddDocument(true)}
      onShowAddBudget={() => setShowAddBudget(true)}
      onShowAddGoal={() => setShowAddGoal(true)}
      onShowSettings={() => setShowSettings(true)}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          subscriptions={subscriptions}
          documents={documents}
          budgets={budgets}
          goals={goals}
          stats={stats}
        />
      )}

      {activeTab === 'subscriptions' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>Subscriptions</h1>
          </div>
          
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            categories={subscriptionCategories}
            placeholder="Search subscriptions..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscriptions.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || filterCategory ? 'No subscriptions match your search criteria.' : 'No subscriptions added yet.'}
                </p>
              </div>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onEdit={handleEditSubscription}
                  onDelete={handleDeleteSubscription}
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>Documents</h1>
          </div>
          
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            categories={documentCategories}
            placeholder="Search documents..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || filterCategory ? 'No documents match your search criteria.' : 'No documents uploaded yet.'}
                </p>
              </div>
            ) : (
              filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onEdit={handleEditDocument}
                  onDelete={handleDeleteDocument}
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'budgets' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>Budgets</h1>
          </div>
          
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            categories={budgetCategories}
            placeholder="Search budgets..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBudgets.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || filterCategory ? 'No budgets match your search criteria.' : 'No budgets created yet.'}
                </p>
              </div>
            ) : (
              filteredBudgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>Goals</h1>
          </div>
          
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory=""
            onFilterChange={() => {}}
            categories={[]}
            placeholder="Search goals..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No goals match your search criteria.' : 'No goals created yet.'}
                </p>
              </div>
            ) : (
              filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onAddContribution={handleAddContribution}
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <h1 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white mb-6`}>Analytics</h1>
          <div className={`bg-white dark:bg-gray-900 ${compactMode ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              Advanced analytics coming soon! Track spending patterns, subscription trends, and more.
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddSubscription
        isOpen={showAddSubscription}
        onClose={() => {
          setShowAddSubscription(false)
          setEditingSubscription(undefined)
        }}
        onSubmit={handleAddSubscription}
        editingSubscription={editingSubscription}
      />

      <AddDocument
        isOpen={showAddDocument}
        onClose={() => {
          setShowAddDocument(false)
          setEditingDocument(undefined)
        }}
        onSubmit={handleAddDocument}
        editingDocument={editingDocument}
        userId={user.id}
      />

      <AddBudget
        isOpen={showAddBudget}
        onClose={() => {
          setShowAddBudget(false)
          setEditingBudget(undefined)
        }}
        onSubmit={handleAddBudget}
        editingBudget={editingBudget}
      />

      <AddGoal
        isOpen={showAddGoal}
        onClose={() => {
          setShowAddGoal(false)
          setEditingGoal(undefined)
        }}
        onSubmit={handleAddGoal}
        editingGoal={editingGoal}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </Layout>
  )
}

export default App