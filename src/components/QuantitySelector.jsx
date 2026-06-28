import React from 'react'

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  size = 'md',
  className = ''
}) {
  const safeMin = typeof min === 'number' && !isNaN(min) ? min : 1
  const safeMax = typeof max === 'number' && !isNaN(max) ? Math.max(safeMin, max) : Math.max(safeMin, 10)
  
  const rawVal = parseInt(value, 10)
  const numVal = isNaN(rawVal) ? safeMin : rawVal

  const handleDecrement = () => {
    if (numVal > safeMin) {
      if (typeof onChange === 'function') onChange(numVal - 1)
    }
  }

  const handleIncrement = () => {
    if (numVal < safeMax) {
      if (typeof onChange === 'function') onChange(numVal + 1)
    }
  }

  const isSm = size === 'sm'
  const containerHeight = isSm ? 'h-11' : 'h-14'
  const btnSize = isSm ? 'w-8 h-8' : 'w-11 h-11'
  const fontSize = isSm ? 'text-sm' : 'text-base'

  return (
    <div className={`flex items-center bg-[var(--color-surface-2)] rounded-full p-1 border border-[var(--color-border)] shrink-0 ${containerHeight} ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={numVal <= safeMin}
        className={`${btnSize} rounded-full flex items-center justify-center text-[var(--color-text)] bg-[var(--color-surface)] shadow-sm hover:bg-[var(--color-surface-2)] transition-transform active:scale-90 disabled:opacity-40 cursor-pointer`}
        aria-label="Disminuir cantidad"
      >
        <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      
      <input
        type="number"
        value={value !== undefined && value !== null ? value : ''}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10)
          if (typeof onChange === 'function') {
            onChange(isNaN(val) ? '' : val)
          }
        }}
        onBlur={() => {
          const val = parseInt(value, 10)
          if (typeof onChange === 'function') {
            if (isNaN(val) || val < safeMin) {
              onChange(safeMin)
            } else if (val > safeMax) {
              onChange(safeMax)
            }
          }
        }}
        className={`w-10 text-center font-bold text-[var(--color-text)] bg-transparent outline-none focus:outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${fontSize}`}
      />
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={numVal >= safeMax}
        className={`${btnSize} rounded-full flex items-center justify-center text-[var(--color-text)] bg-[var(--color-surface)] shadow-sm hover:bg-[var(--color-surface-2)] transition-transform active:scale-90 disabled:opacity-40 cursor-pointer`}
        aria-label="Aumentar cantidad"
      >
        <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  )
}
