export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  service_name: string
  cost: number
  renewal_date: string
  billing_cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  category: string
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  title: string
  category: string
  file_url: string
  file_name: string
  file_size: number
  tags: string[]
  upload_date: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  message: string
  is_read: boolean
  created_at: string
}

export interface DashboardStats {
  totalMonthlySpend: number
  totalYearlySpend: number
  activeSubscriptions: number
  upcomingRenewals: number
  documentsCount: number
  totalBudgetLimit: number
  totalBudgetSpent: number
  activeGoals: number
  totalGoalProgress: number
}

export interface Budget {
  id: string
  user_id: string
  category: string
  monthly_limit: number
  current_spending: number
  alert_threshold: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  start_date: string
  end_date: string | null
  contribution_frequency: 'weekly' | 'monthly' | 'custom'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  budget_id: string | null
  goal_id: string | null
  amount: number
  description: string
  category: string
  transaction_type: 'expense' | 'income' | 'goal_contribution'
  transaction_date: string
  created_at: string
}