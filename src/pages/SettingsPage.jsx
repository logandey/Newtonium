import React, { useState } from 'react'
import { User, Building2, Phone, Bell, Shield, ChevronRight, LogOut, HelpCircle, MessageSquare } from 'lucide-react'

function SettingsGroup({ title, children }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider px-1 mb-2">{title}</p>
      <div className="rounded-2xl border border-surface-800/40 bg-surface-900/50 overflow-hidden divide-y divide-surface-800/30">
        {children}
      </div>
    </div>
  )
}

function SettingsRow({ icon: Icon, label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-800/30 transition-colors text-left"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        danger ? 'bg-red-500/10' : 'bg-surface-800'
      }`}>
        <Icon size={16} className={danger ? 'text-red-400' : 'text-surface-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-surface-200'}`}>{label}</p>
      </div>
      {value && <span className="text-sm text-surface-500 flex-shrink-0">{value}</span>}
      <ChevronRight size={16} className="text-surface-600 flex-shrink-0" />
    </button>
  )
}

export default function SettingsPage() {
  return (
    <div className="min-h-full pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-lg border-b border-surface-800/50">
        <div className="px-5 pt-14 pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        </div>
      </div>

      {/* Profile card */}
      <div className="px-4 pt-4 pb-2">
        <div className="animate-fade-in-up opacity-0 stagger-1 flex items-center gap-4 p-4 rounded-2xl bg-surface-800/60 border border-surface-700/40">
          <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
            <span className="text-xl font-bold text-brand-400">JD</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">John's Plumbing</h3>
            <p className="text-sm text-surface-400">Tampa, FL · Starter Plan</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-5 pt-3">
        <div className="animate-fade-in-up opacity-0 stagger-2">
          <SettingsGroup title="Business">
            <SettingsRow icon={Building2} label="Business Profile" value="Edit" />
            <SettingsRow icon={Phone} label="Call Forwarding Setup" value="Guide" />
            <SettingsRow icon={Bell} label="Notifications" value="SMS + Push" />
          </SettingsGroup>
        </div>

        <div className="animate-fade-in-up opacity-0 stagger-3">
          <SettingsGroup title="AI Receptionist">
            <SettingsRow icon={User} label="Name & Personality" value="Alex · Friendly" />
            <SettingsRow icon={MessageSquare} label="Greeting Script" value="Custom" />
            <SettingsRow icon={Shield} label="Services & Availability" value="4 services" />
          </SettingsGroup>
        </div>

        <div className="animate-fade-in-up opacity-0 stagger-4">
          <SettingsGroup title="Account">
            <SettingsRow icon={HelpCircle} label="Help & Support" />
            <SettingsRow icon={LogOut} label="Sign Out" danger />
          </SettingsGroup>
        </div>

        {/* Version */}
        <p className="text-center text-[11px] text-surface-600 pt-2">
          CrewAI v0.1.0 · MVP Beta
        </p>
      </div>
    </div>
  )
}
