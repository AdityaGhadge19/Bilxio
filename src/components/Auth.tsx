import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, CreditCard } from 'lucide-react'
import logo from '../assets/logo.svg'
import background from '../assets/background.png'
import { useAuth } from '../hooks/useAuth'
import { useSettings } from '../contexts/SettingsContext'

interface AuthFormData {
  email: string
  password: string
  fullName?: string
}

export function Auth() {
  const { showAnimations } = useSettings()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormData>()

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true)
    setError('')

    try {
      let result
      if (isSignUp) {
        result = await signUp(data.email, data.password, data.fullName || '')
      } else {
        result = await signIn(data.email, data.password)
      }

      if (result.error) {
        setError(result.error.message)
      } else if (isSignUp) {
        setError('')
        reset()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetMessage('')
    if (!resetEmail) {
      setResetMessage('Please enter your email address.')
      return
    }
    const { error } = await resetPassword(resetEmail)
    if (error) {
      setResetMessage(error.message)
    } else {
      setResetMessage('Password reset email sent! Check your inbox.')
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mb-4 pt-3 pr-1">
            <img src={logo} alt="Logo" className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold text-white dark:text-gray-900 mb-2">Bilxio</h1>
          <p className="text-gray-200 dark:text-gray-700">
            Track subscriptions, manage receipts, organize documents
          </p>
        </div>

        {/* Auth Form or Reset Password */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {showReset ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Enter your email to receive a password reset link.</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                {resetMessage && <p className="text-sm text-red-600 dark:text-red-400">{resetMessage}</p>}
                <button
                  type="submit"
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
                >
                  Send Reset Link
                </button>
              </form>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => { setShowReset(false); setResetMessage(''); setResetEmail('') }}
                  className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isSignUp
                    ? 'Sign up to start managing your subscriptions'
                    : 'Sign in to your account to continue'
                  }
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      {...register('fullName', { required: isSignUp ? 'Full name is required' : false })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 ${showAnimations ? 'transition-all duration-200' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
                {!isSignUp && (
                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                      onClick={() => setShowReset(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError('')
                      reset()
                    }}
                    className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}