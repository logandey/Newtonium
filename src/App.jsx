import React, { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState('inbox')

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
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
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
        {/* Safe area for phones with gesture bars */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
