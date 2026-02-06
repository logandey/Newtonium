import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Bot, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setConfirmMessage('')
    setLoading(true)

    if (isSignUp) {
      const { data, error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setConfirmMessage('Check your email for a confirmation link!')
      }
    } else {
      const { data, error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-5">
      {/* Logo & Branding */}
      <div className="text-center mb-10 animate-fade-in-up opacity-0 stagger-1">
        <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
          <Bot size={32} className="text-brand-400" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Newtonium</h1>
        <p className="text-surface-400 mt-2">Hire your AI workforce</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-sm animate-fade-in-up opacity-0 stagger-2">
        <div className="rounded-2xl border border-surface-800/60 bg-surface-900/80 p-6">
          <h2 className="text-lg font-semibold text-white mb-5">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-surface-400 uppercase tracking-wider block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-800/80 border border-surface-700/50 text-white text-sm placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="you@business.com"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-surface-400 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-800/80 border border-surface-700/50 text-white text-sm placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all pr-10"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {confirmMessage && (
              <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                {confirmMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:text-surface-400 text-white font-medium py-2.5 rounded-xl transition-all text-sm"
            >
              {loading ? (
                <span className="animate-pulse-soft">Please wait...</span>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-4">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setConfirmMessage('')
            }}
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      <p className="text-[11px] text-surface-600 mt-10 animate-fade-in-up opacity-0 stagger-3">
        Newtonium v0.1.0 · MVP Beta
      </p>
    </div>
  )
}
