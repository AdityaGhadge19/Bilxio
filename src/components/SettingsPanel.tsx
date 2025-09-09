import React from 'react'
import { X, Moon, Sun, Zap, RefreshCw, Bell, Monitor, Minimize2, Maximize2 } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    theme,
    setTheme,
    compactMode,
    setCompactMode,
    showAnimations,
    setShowAnimations,
    autoRefresh,
    setAutoRefresh,
    notificationsEnabled,
    setNotificationsEnabled
  } = useSettings()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                  </div>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                      theme === 'light'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {compactMode ? (
                    <Minimize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Compact Mode</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing and padding</p>
                  </div>
                </div>
                <button
                  onClick={() => setCompactMode(!compactMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    compactMode ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform duration-200 ${
                      compactMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Animations</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enable smooth transitions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnimations(!showAnimations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    showAnimations ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform duration-200 ${
                      showAnimations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Auto Refresh</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically update data</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    autoRefresh ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform duration-200 ${
                      autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about renewals</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    notificationsEnabled ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform duration-200 ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Bilxio v1.0.0</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Subscription & Document Manager
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}