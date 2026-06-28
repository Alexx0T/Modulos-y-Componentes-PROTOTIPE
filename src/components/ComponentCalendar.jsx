import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const ComponentCalendar = ({ components }) => {
  const safeComponents = Array.isArray(components) ? components : []
  const [currentYear] = useState(2026)
  const [currentMonth] = useState(5)
  const [selectedDayComponents, setSelectedDayComponents] = useState([])
  const [selectedDateStr, setSelectedDateStr] = useState(null)

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const firstDayIndex = 1
  const totalDays = 30

  const calendarCells = []
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null)
  }
  for (let day = 1; day <= totalDays; day++) {
    calendarCells.push(day)
  }

  const getFormattedDate = (day) => {
    const monthStr = (currentMonth + 1).toString().padStart(2, '0')
    const dayStr = day.toString().padStart(2, '0')
    return `${currentYear}-${monthStr}-${dayStr}`
  }

  const handleDayClick = (day) => {
    if (!day) return
    const dateStr = getFormattedDate(day)
    const filtered = safeComponents.filter(c => c && typeof c === 'object' && c.date === dateStr)
    setSelectedDayComponents(filtered)
    setSelectedDateStr(dateStr)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 min-h-[420px] gpu-accelerated">
      <div className="md:col-span-7 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-md font-bold text-zinc-200">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider">REGISTRO DE MÓDULOS</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-zinc-500">
          {daysOfWeek.map(d => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 min-h-[220px]">
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square bg-transparent" />
            }

            const dateStr = getFormattedDate(day)
            const dayComponents = safeComponents.filter(c => c && typeof c === 'object' && c.date === dateStr)
            const hasComponents = dayComponents.length > 0
            const isSelected = selectedDateStr === dateStr

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-between p-2.5 relative transition-all duration-200 hover:scale-[1.03] cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white border border-primary-hover shadow-lg shadow-primary/25'
                    : hasComponents
                    ? 'bg-zinc-900 border border-primary/40 text-primary-hover hover:border-primary'
                    : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span className="text-xs font-bold self-start">{day}</span>
                {hasComponents && (
                  <div className="flex space-x-1 justify-center w-full">
                    {dayComponents.map((_, cIdx) => (
                      <span
                        key={cIdx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-accent'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-zinc-900 pt-6 md:pt-0 md:pl-6 min-h-[160px] flex flex-col justify-start">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
          Detalles de Registro ({selectedDateStr || 'Selecciona un día'})
        </h4>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedDayComponents.length > 0 ? (
              <motion.div
                key={selectedDateStr}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3"
              >
                {selectedDayComponents.map(comp => {
                  if (!comp || typeof comp !== 'object') return null
                  return (
                    <div
                      key={comp.id || Math.random().toString()}
                      className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">{comp.category || 'General'}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">v1.0.0</span>
                      </div>
                      <h5 className="font-bold text-zinc-100">{comp.name || 'Component'}</h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">{comp.description || ''}</p>
                    </div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-zinc-500 italic h-full flex items-center justify-center border border-dashed border-zinc-900 rounded-xl p-6 text-center"
              >
                No hay componentes registrados en esta fecha. Selecciona los días resaltados en morado.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
