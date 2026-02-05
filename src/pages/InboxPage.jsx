import React, { useState } from 'react'
import { Phone, Clock, MapPin, ChevronRight, AlertTriangle, CheckCircle, Calendar } from 'lucide-react'

const MOCK_CALLS = [
  {
    id: 1,
    callerName: 'Maria Rodriguez',
    callerPhone: '(813) 555-0142',
    time: '2 min ago',
    summary: 'Kitchen sink is leaking badly under the cabinet. Water is pooling on the floor. Needs someone today if possible.',
    serviceNeeded: 'Leak repair',
    urgency: 'high',
    address: '4821 Bayshore Blvd, Tampa, FL',
    status: 'new',
  },
  {
    id: 2,
    callerName: 'James Peterson',
    callerPhone: '(727) 555-0198',
    time: '45 min ago',
    summary: 'Wants to get a quote on repiping the whole house. Built in 1972, still has original galvanized pipes. No rush, just planning.',
    serviceNeeded: 'Repiping estimate',
    urgency: 'low',
    address: '1200 Central Ave, St. Petersburg, FL',
    status: 'new',
  },
  {
    id: 3,
    callerName: 'Sarah Chen',
    callerPhone: '(941) 555-0267',
    time: '1 hour ago',
    summary: 'Water heater is making loud banging noises and water is lukewarm. Unit is about 12 years old. Available any morning this week.',
    serviceNeeded: 'Water heater service',
    urgency: 'medium',
    address: '890 Fruitville Rd, Sarasota, FL',
    status: 'reviewed',
  },
  {
    id: 4,
    callerName: 'Tom Bradley',
    callerPhone: '(813) 555-0331',
    time: '3 hours ago',
    summary: 'New construction project — needs rough-in plumbing for a 3-bed, 2-bath home. Wants to schedule a walkthrough with the GC.',
    serviceNeeded: 'New construction',
    urgency: 'low',
    address: '1550 N Dale Mabry, Tampa, FL',
    status: 'reviewed',
  },
]

const urgencyConfig = {
  high: { label: 'Urgent', color: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-500' },
  medium: { label: 'Medium', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dot: 'bg-amber-500' },
  low: { label: 'Low', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
}

export default function InboxPage() {
  const [expandedId, setExpandedId] = useState(null)
  const [calls] = useState(MOCK_CALLS)

  const newCount = calls.filter(c => c.status === 'new').length

  return (
    <div className="min-h-full pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-lg border-b border-surface-800/50">
        <div className="px-5 pt-14 pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Inbox</h1>
          <p className="text-sm text-surface-400 mt-1">
            {newCount} new {newCount === 1 ? 'call' : 'calls'} today
          </p>
        </div>
      </div>

      {/* Call List */}
      <div className="px-4 pt-3 space-y-3">
        {calls.map((call, index) => {
          const urgency = urgencyConfig[call.urgency]
          const isExpanded = expandedId === call.id
          const isNew = call.status === 'new'

          return (
            <div
              key={call.id}
              onClick={() => setExpandedId(isExpanded ? null : call.id)}
              className={`animate-fade-in-up stagger-${index + 1} opacity-0 rounded-2xl border transition-all duration-300 cursor-pointer ${
                isNew
                  ? 'bg-surface-800/80 border-surface-700/60 hover:border-brand-600/40'
                  : 'bg-surface-900/50 border-surface-800/40 hover:border-surface-700/60'
              }`}
            >
              {/* Card header */}
              <div className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isNew && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />}
                      <h3 className={`font-semibold truncate ${isNew ? 'text-white' : 'text-surface-300'}`}>
                        {call.callerName}
                      </h3>
                    </div>
                    <p className="text-sm text-surface-400 mt-1 line-clamp-1">
                      {call.serviceNeeded}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs text-surface-500">{call.time}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${urgency.color}`}>
                      {urgency.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-surface-800/50 animate-fade-in-up">
                  <div className="pt-3 space-y-3">
                    {/* Summary */}
                    <div>
                      <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">Summary</p>
                      <p className="text-sm text-surface-200 leading-relaxed">{call.summary}</p>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm text-surface-400">
                        <Phone size={14} className="text-surface-500" />
                        <a href={`tel:${call.callerPhone}`} className="text-brand-400 hover:text-brand-300">
                          {call.callerPhone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-surface-400">
                        <MapPin size={14} className="text-surface-500" />
                        <span>{call.address}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <a
                        href={`tel:${call.callerPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                      >
                        <Phone size={15} />
                        Call Back
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation() }}
                        className="flex-1 flex items-center justify-center gap-2 bg-surface-700 hover:bg-surface-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                      >
                        <Calendar size={15} />
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

