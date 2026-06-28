import React, { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

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

  // Motion values to track mouse coordinate offsets (-1 to 1)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Responsive spring configuration for smooth cursor tracking
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  // Transform outputs for inverted and multi-layer parallax movement
  const springXInverted = useTransform(springX, (v) => -v)
  const springYInverted = useTransform(springY, (v) => -v)
  const springXCenter = useTransform(springX, (v) => v * 0.4)
  const springYCenter = useTransform(springY, (v) => v * 0.4)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleMouseMove = (e) => {
      // Calculate normalized cursor position relative to screen center (-0.5 to 0.5)
      const normX = (e.clientX / window.innerWidth) - 0.5
      const normY = (e.clientY / window.innerHeight) - 0.5

      // Calculate translation range based on viewport dimensions (e.g. 12% of screen size)
      const maxShiftX = window.innerWidth * 0.12
      const maxShiftY = window.innerHeight * 0.12

      mouseX.set(normX * maxShiftX)
      mouseY.set(normY * maxShiftY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

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
      {/* Blob 1: Top-Left Corner (Color 1) */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          willChange: 'transform',
        }}
        className="absolute top-[-25%] left-[-25%] w-[65vw] h-[65vh] rounded-full opacity-60"
      >
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
          className="absolute inset-0 rounded-full gpu-accelerated"
          style={{
            background: `radial-gradient(circle, hsl(${c1.h} ${c1.s}% ${c1.l}%) 0%, transparent 70%)`,
            willChange: 'transform',
          }}
        />
      </motion.div>

      {/* Blob 2: Bottom-Right Corner (Color 2) */}
      <motion.div
        style={{
          x: springXInverted,
          y: springYInverted,
          willChange: 'transform',
        }}
        className="absolute bottom-[-25%] right-[-25%] w-[65vw] h-[65vh] rounded-full opacity-55"
      >
        <motion.div
          animate={{
            scale: [safeScaleRange[1], safeScaleRange[0], safeScaleRange[1]],
            x: [clampedMovement, -clampedMovement, clampedMovement],
            y: [clampedMovement / 2, -clampedMovement / 2, clampedMovement / 2],
          }}
          transition={{
            duration: clampedSpeed * 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full gpu-accelerated"
          style={{
            background: `radial-gradient(circle, hsl(${c2.h} ${c2.s}% ${c2.l}%) 0%, transparent 70%)`,
            willChange: 'transform',
          }}
        />
      </motion.div>

      {/* Blob 3: Top-Right Corner (Color 2) */}
      <motion.div
        style={{
          x: springXInverted,
          y: springY,
          willChange: 'transform',
        }}
        className="absolute top-[-20%] right-[-20%] w-[55vw] h-[55vh] rounded-full opacity-45"
      >
        <motion.div
          animate={{
            scale: safeScaleRange,
            x: [clampedMovement / 1.5, -clampedMovement / 1.5, clampedMovement / 1.5],
            y: [-clampedMovement, clampedMovement, -clampedMovement],
          }}
          transition={{
            duration: clampedSpeed * 1.4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full gpu-accelerated"
          style={{
            background: `radial-gradient(circle, hsl(${c2.h} ${c2.s}% ${c2.l}%) 0%, transparent 70%)`,
            willChange: 'transform',
          }}
        />
      </motion.div>

      {/* Blob 4: Bottom-Left Corner (Color 1) */}
      <motion.div
        style={{
          x: springX,
          y: springYInverted,
          willChange: 'transform',
        }}
        className="absolute bottom-[-20%] left-[-20%] w-[55vw] h-[55vh] rounded-full opacity-45"
      >
        <motion.div
          animate={{
            scale: [safeScaleRange[1], safeScaleRange[0], safeScaleRange[1]],
            x: [-clampedMovement, clampedMovement, -clampedMovement],
            y: [clampedMovement, -clampedMovement, clampedMovement],
          }}
          transition={{
            duration: clampedSpeed * 1.1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full gpu-accelerated"
          style={{
            background: `radial-gradient(circle, hsl(${c1.h} ${c1.s}% ${c1.l}%) 0%, transparent 70%)`,
            willChange: 'transform',
          }}
        />
      </motion.div>

      {/* Blob 5: Center Glow (Soft Blend bridge) */}
      <motion.div
        style={{
          x: springXCenter,
          y: springYCenter,
          willChange: 'transform',
        }}
        className="absolute top-[20%] left-[20%] w-[60vw] h-[60vh] rounded-full opacity-20"
      >
        <motion.div
          animate={{
            scale: [0.9, 1.15, 0.9],
            x: [-clampedMovement / 3, clampedMovement / 3, -clampedMovement / 3],
            y: [-clampedMovement / 3, clampedMovement / 3, -clampedMovement / 3],
          }}
          transition={{
            duration: clampedSpeed * 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full gpu-accelerated"
          style={{
            background: `radial-gradient(circle, hsl(${c1.h} ${c1.s}% ${c1.l}%) 0%, transparent 80%)`,
            willChange: 'transform',
          }}
        />
      </motion.div>
    </div>
  )
}
