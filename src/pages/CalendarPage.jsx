import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Phone } from 'lucide-react'

const TODAY = new Date()

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    title: 'Leak Repair — Rodriguez',
    time: '9:00 AM',
    endTime: '10:30 AM',
    address: '4821 Bayshore Blvd, Tampa',
    phone: '(813) 555-0142',
    type: 'job',
    color: 'bg-brand-600',
  },
  {
    id: 2,
    title: 'Estimate — Water Heater',
    time: '11:00 AM',
    endTime: '11:45 AM',
    address: '890 Fruitville Rd, Sarasota',
    phone: '(941) 555-0267',
    type: 'estimate',
    color: 'bg-amber-600',
  },
  {
    id: 3,
    title: 'Supply Pickup — Ferguson',
    time: '1:00 PM',
    endTime: '1:30 PM',
    address: '2200 N Westshore Blvd, Tampa',
    phone: '',
    type: 'errand',
    color: 'bg-surface-600',
  },
  {
    id: 4,
    title: 'Repipe Walkthrough — Peterson',
    time: '3:00 PM',
    endTime: '4:00 PM',
    address: '1200 Central Ave, St. Petersburg',
    phone: '(727) 555-0198',
    type: 'estimate',
    color: 'bg-amber-600',
  },
]

function getDayNames() {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

function getWeekDates(baseDate) {
  const start = new Date(baseDate)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const weekDates = getWeekDates(selectedDate)
  const dayNames = getDayNames()

  const isToday = (date) =>
    date.getDate() === TODAY.getDate() &&
    date.getMonth() === TODAY.getMonth() &&
    date.getFullYear() === TODAY.getFullYear()

  const isSelected = (date) =>
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth()

  const monthYear = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-full pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-lg border-b border-surface-800/50">
        <div className="px-5 pt-14 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">Calendar</h1>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-600 hover:bg-brand-500 transition-colors">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Month & Nav */}
        <div className="flex items-center justify-between px-5 pb-2">
          <button
            onClick={() => {
              const d = new Date(selectedDate)
              d.setDate(d.getDate() - 7)
              setSelectedDate(d)
            }}
            className="p-1 text-surface-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-surface-300">{monthYear}</span>
          <button
            onClick={() => {
              const d = new Date(selectedDate)
              d.setDate(d.getDate() + 7)
              setSelectedDate(d)
            }}
            className="p-1 text-surface-400 hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Week Strip */}
        <div className="flex justify-around px-3 pb-3">
          {weekDates.map((date, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                isSelected(date)
                  ? 'bg-brand-600 text-white'
                  : isToday(date)
                  ? 'bg-surface-800 text-brand-400'
                  : 'text-surface-400 hover:bg-surface-800/50'
              }`}
            >
              <span className="text-[10px] font-medium uppercase">{dayNames[i]}</span>
              <span className={`text-lg font-semibold ${isSelected(date) ? 'text-white' : ''}`}>
                {date.getDate()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Summary Banner */}
      <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-brand-900/50 to-brand-800/30 border border-brand-700/30">
        <p className="text-sm font-medium text-brand-300">
          Today's Summary
        </p>
        <p className="text-xs text-surface-400 mt-1">
          {MOCK_APPOINTMENTS.length} appointments · First job at 9:00 AM · Last at 3:00 PM
        </p>
      </div>

      {/* Appointments List */}
      <div className="px-4 pt-4 space-y-3">
        {MOCK_APPOINTMENTS.map((apt, index) => (
          <div
            key={apt.id}
            className={`animate-fade-in-up stagger-${index + 1} opacity-0 flex gap-3 p-3.5 rounded-2xl bg-surface-800/60 border border-surface-700/40 hover:border-surface-600/50 transition-all cursor-pointer`}
          >
            {/* Color bar */}
            <div className={`w-1 self-stretch rounded-full ${apt.color} flex-shrink-0`} />

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{apt.title}</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Clock size={12} className="text-surface-500" />
                <span className="text-xs text-surface-400">{apt.time} — {apt.endTime}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} className="text-surface-500" />
                <span className="text-xs text-surface-400 truncate">{apt.address}</span>
              </div>
              {apt.phone && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Phone size={12} className="text-surface-500" />
                  <a href={`tel:${apt.phone}`} className="text-xs text-brand-400">{apt.phone}</a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
