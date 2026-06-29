import React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function PrototipeLogo({ className = "w-10 h-10", animated = true }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for fluid 3D movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })

  // Map mouse position to rotation angles (max 25 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    // Calculate mouse position relative to the center of the element
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = (mouseX / width) - 0.5
    const yPct = (mouseY / height) - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    // Reset to center smoothly when mouse leaves
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={`relative flex items-center justify-center cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d", 
        perspective: 800 
      }}
    >
      <svg 
        className={`w-full h-full drop-shadow-2xl ${animated ? 'animate-pulse-slow' : ''}`} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "translateZ(30px)" }}
      >
        <defs>
          <linearGradient id="logo-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary-h) var(--primary-s) var(--primary-l))" />
            <stop offset="100%" stopColor="hsl(var(--secondary-h) var(--secondary-s) var(--secondary-l))" />
          </linearGradient>
          <linearGradient id="logo-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent-h) var(--accent-s) var(--accent-l))" />
            <stop offset="100%" stopColor="hsl(var(--primary-h) var(--primary-s) var(--primary-l))" />
          </linearGradient>
        </defs>
        
        {/* Background crisp circle */}
        <circle cx="100" cy="100" r="75" fill="url(#logo-grad-primary)" opacity="0.1" />

        <g strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Module Cube 1 - Left Outer */}
          <path 
            d="M50 70 L100 40 L100 100 L50 130 Z" 
            fill="url(#logo-grad-primary)" 
            fillOpacity="0.85" 
            stroke="hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) + 20%))" 
            strokeOpacity="1"
          />
          
          {/* Module Cube 2 - Right Outer */}
          <path 
            d="M100 100 L150 70 L150 130 L100 160 Z" 
            fill="url(#logo-grad-accent)" 
            fillOpacity="0.85" 
            stroke="hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) + 20%))" 
            strokeOpacity="1"
          />

          {/* Module Cube 3 - Top Outer Connecting Cap */}
          <path 
            d="M100 40 L150 70 L100 100 L50 70 Z" 
            fill="none" 
            stroke="hsl(var(--secondary-h) var(--secondary-s) calc(var(--secondary-l) + 25%))" 
            strokeWidth="5"
          />

          {/* Inner core connecting node */}
          <circle cx="100" cy="100" r="12" fill="#ffffff" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="100" cy="100" r="8" fill="hsl(var(--accent-h) var(--accent-s) var(--accent-l))" />
        </g>
      </svg>
    </motion.div>
  )
}
