import React, { useState, useEffect } from 'react'

export const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatSegment = (num: number) => num.toString().padStart(2, '0')

  const hours = formatSegment(time.getHours())
  const minutes = formatSegment(time.getMinutes())
  const seconds = formatSegment(time.getSeconds())

  const formattedDate = time.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="p-6 rounded-2xl glass-premium text-center space-y-4 gpu-accelerated max-w-sm mx-auto min-h-[160px] flex flex-col justify-center">
      {/* Date */}
      <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
        {formattedDate}
      </span>

      {/* Clock display */}
      <div className="flex items-center justify-center space-x-2 font-mono text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(var(--primary-h),var(--primary-s),var(--primary-l),0.2)]">
        <span>{hours}</span>
        <span className="animate-pulse text-primary">:</span>
        <span>{minutes}</span>
        <span className="animate-pulse text-accent">:</span>
        <span className="text-2xl md:text-3xl self-end mb-1 text-zinc-400 font-semibold">{seconds}</span>
      </div>

      <div className="text-[10px] text-zinc-500 font-mono">
        ZONA HORARIA: {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </div>
    </div>
  )
}
