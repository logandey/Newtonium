import React, { useState } from 'react'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import AuthConfirmPage from './pages/AuthConfirmPage'
import InboxPage from './pages/InboxPage'
import CalendarPage from './pages/CalendarPage'
import CrewPage from './pages/CrewPage'
import SettingsPage from './pages/SettingsPage'
import { Phone, Calendar, Users, Settings } from 'lucide-react'

const tabs = [
  { id: 'inbox', label: 'Inbox', icon: Phone },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'crew', label: 'My Crew', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function App() {
  const { session, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('inbox')

  // Handle auth confirmation route
  if (window.location.pathname === '/auth/confirm') {
    return <AuthConfirmPage />
  }

  if (loading) {
    return (
      <div className="h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-3 animate-pulse-soft">
            <span className="text-xl font-bold text-brand-400">N</span>
          </div>
          <p className="text-sm text-surface-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <AuthPage />
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'inbox': return <InboxPage />
      case 'calendar': return <CalendarPage />
      case 'crew': return <CrewPage />
      case 'settings': return <SettingsPage />
      default: return <InboxPage />
    }
  }

  return (
    <div className="h-full flex flex-col bg-surface-950">
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

      <nav className="flex-shrink-0 bg-surface-900/95 backdrop-blur-lg border-t border-surface-800/50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all duration-200 ${
                  isActive
                    ? 'text-brand-400'
                    : 'text-surface-500 hover:text-surface-300'
                }`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                  {tab.id === 'inbox' && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
