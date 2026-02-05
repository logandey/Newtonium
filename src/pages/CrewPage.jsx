import React from 'react'
import { Bot, Phone, Star, TrendingUp, Clock, Zap } from 'lucide-react'

export default function CrewPage() {
  return (
    <div className="min-h-full pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-lg border-b border-surface-800/50">
        <div className="px-5 pt-14 pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">My Crew</h1>
          <p className="text-sm text-surface-400 mt-1">Your AI workforce</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Active AI Employee Card */}
        <div className="animate-fade-in-up opacity-0 stagger-1 rounded-2xl border border-brand-600/30 bg-gradient-to-br from-brand-950/80 to-surface-900/80 overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-900/30 border-b border-brand-800/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
            <span className="text-xs font-medium text-emerald-400">Active — Answering Calls</span>
          </div>

          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                <Bot size={28} className="text-brand-400" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white">Alex</h3>
                <p className="text-sm text-surface-400">AI Receptionist</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs text-surface-400">4.9 caller satisfaction</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-surface-800/50 rounded-xl p-3 text-center">
                <Phone size={16} className="text-brand-400 mx-auto" />
                <p className="text-xl font-bold text-white mt-1">47</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider">Calls Today</p>
              </div>
              <div className="bg-surface-800/50 rounded-xl p-3 text-center">
                <TrendingUp size={16} className="text-emerald-400 mx-auto" />
                <p className="text-xl font-bold text-white mt-1">94%</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider">Captured</p>
              </div>
              <div className="bg-surface-800/50 rounded-xl p-3 text-center">
                <Clock size={16} className="text-amber-400 mx-auto" />
                <p className="text-xl font-bold text-white mt-1">1:42</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider">Avg Call</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hire New AI Employee */}
        <button className="animate-fade-in-up opacity-0 stagger-2 w-full rounded-2xl border-2 border-dashed border-surface-700/50 hover:border-brand-600/40 bg-surface-900/30 hover:bg-surface-800/30 transition-all p-6 text-center group">
          <div className="w-12 h-12 rounded-2xl bg-surface-800 group-hover:bg-brand-900/50 border border-surface-700 group-hover:border-brand-600/30 flex items-center justify-center mx-auto transition-all">
            <Zap size={22} className="text-surface-500 group-hover:text-brand-400 transition-colors" />
          </div>
          <p className="text-sm font-semibold text-surface-300 group-hover:text-white mt-3 transition-colors">
            Hire a New AI Employee
          </p>
          <p className="text-xs text-surface-500 mt-1">
            Coming soon — Estimator, Follow-Up Agent, and more
          </p>
        </button>

        {/* Team Overview placeholder */}
        <div className="animate-fade-in-up opacity-0 stagger-3 rounded-2xl border border-surface-800/40 bg-surface-900/50 p-4">
          <h3 className="text-sm font-semibold text-surface-300">Team Overview</h3>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center">
                  <Bot size={16} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Alex</p>
                  <p className="text-[11px] text-surface-500">AI Receptionist</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between opacity-40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center">
                  <Bot size={16} className="text-surface-500" />
                </div>
                <div>
                  <p className="text-sm text-surface-400 font-medium">Open Position</p>
                  <p className="text-[11px] text-surface-600">AI Estimator</p>
                </div>
              </div>
              <span className="text-xs text-surface-600 font-medium">Hire →</span>
            </div>
            <div className="flex items-center justify-between opacity-40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center">
                  <Bot size={16} className="text-surface-500" />
                </div>
                <div>
                  <p className="text-sm text-surface-400 font-medium">Open Position</p>
                  <p className="text-[11px] text-surface-600">Follow-Up Agent</p>
                </div>
              </div>
              <span className="text-xs text-surface-600 font-medium">Hire →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
