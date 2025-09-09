import React from 'react'
import { Search, Filter } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterCategory: string
  onFilterChange: (category: string) => void
  categories: string[]
  placeholder?: string
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
  categories,
  placeholder = "Search..."
}: SearchBarProps) {
  const { compactMode } = useSettings()

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${compactMode ? 'mb-4' : 'mb-6'}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <select
          value={filterCategory}
          onChange={(e) => onFilterChange(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[150px]"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category} className="capitalize">
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}