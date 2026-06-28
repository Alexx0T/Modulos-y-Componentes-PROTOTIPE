import React from 'react'
import { motion } from 'framer-motion'

export function BreathingBackground({
  color1 = { h: 262, s: 83, l: 58 },
  color2 = { h: 330, s: 98, l: 60 },
  speed = 10,
  blur = 80,
  opacity = 0.25,
  scaleRange = [0.8, 1.2],
  movementRange = 50,
  className = '',
  style = {}
}) {
  // Validate and clamp HSL components to ensure robustness against malformed tenant config
  const sanitizeColor = (color, defaultHue) => {
    if (!color || typeof color !== 'object') {
      return { h: defaultHue, s: 80, l: 50 }
    }
    const h = typeof color.h === 'number' && !isNaN(color.h) ? Math.max(0, Math.min(360, color.h)) : defaultHue
    const s = typeof color.s === 'number' && !isNaN(color.s) ? Math.max(0, Math.min(100, color.s)) : 80
    const l = typeof color.l === 'number' && !isNaN(color.l) ? Math.max(0, Math.min(100, color.l)) : 50
    return { h, s, l }
  }

  const c1 = sanitizeColor(color1, 262)
  const c2 = sanitizeColor(color2, 330)

  // Clamp numeric parameters
  const clampedSpeed = typeof speed === 'number' && !isNaN(speed) ? Math.max(1, Math.min(60, speed)) : 10
  const clampedBlur = typeof blur === 'number' && !isNaN(blur) ? Math.max(0, Math.min(250, blur)) : 80
  const clampedOpacity = typeof opacity === 'number' && !isNaN(opacity) ? Math.max(0, Math.min(1, opacity)) : 0.25
  const clampedMovement = typeof movementRange === 'number' && !isNaN(movementRange) ? Math.max(0, Math.min(300, movementRange)) : 50

  const safeScaleRange = Array.isArray(scaleRange) && scaleRange.length === 2 && scaleRange.every(v => typeof v === 'number' && !isNaN(v))
    ? scaleRange.map(v => Math.max(0.1, Math.min(5, v)))
    : [0.8, 1.2]

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        opacity: clampedOpacity,
        filter: `blur(${clampedBlur}px)`,
        ...style
      }}
      data-testid="breathing-background-container"
    >
      {/* Dynamic Blob 1 */}
      <motion.div
        animate={{
          scale: safeScaleRange,
          x: [-clampedMovement, clampedMovement, -clampedMovement],
          y: [-clampedMovement / 2, clampedMovement / 2, -clampedMovement / 2],
        }}
        transition={{
          duration: clampedSpeed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[50%] h-[50%] rounded-full opacity-70 gpu-accelerated"
        style={{
          top: '10%',
          left: '10%',
          background: `radial-gradient(circle, hsl(${c1.h} ${c1.s}% ${c1.l}%) 0%, transparent 70%)`,
          willChange: 'transform',
        }}
      />

      {/* Dynamic Blob 2 */}
      <motion.div
        animate={{
          scale: [safeScaleRange[1], safeScaleRange[0], safeScaleRange[1]],
          x: [clampedMovement, -clampedMovement, clampedMovement],
          y: [clampedMovement / 2, -clampedMovement / 2, clampedMovement / 2],
        }}
        transition={{
          duration: clampedSpeed * 1.3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[55%] h-[55%] rounded-full opacity-60 gpu-accelerated"
        style={{
          bottom: '10%',
          right: '10%',
          background: `radial-gradient(circle, hsl(${c2.h} ${c2.s}% ${c2.l}%) 0%, transparent 70%)`,
          willChange: 'transform',
        }}
      />
    </div>
  )
}
