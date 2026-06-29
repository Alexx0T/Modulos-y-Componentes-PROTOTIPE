import React from 'react'

export function PrototipeLogo({ className = "w-10 h-10", animated = true }) {
  return (
    <svg 
      className={`${className} ${animated ? 'animate-pulse-slow' : ''}`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
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
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background glow overlay */}
      <circle cx="50" cy="50" r="30" fill="url(#logo-grad-primary)" opacity="0.15" filter="url(#logo-glow)" />

      {/* Hexagonal grid / modular structures */}
      <g strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Module Cube 1 - Left Outer */}
        <path 
          d="M25 35 L50 20 L50 50 L25 65 Z" 
          fill="url(#logo-grad-primary)" 
          fillOpacity="0.8" 
          stroke="hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) + 15%))" 
          strokeOpacity="0.9"
        />
        
        {/* Module Cube 2 - Right Outer */}
        <path 
          d="M50 50 L75 35 L75 65 L50 80 Z" 
          fill="url(#logo-grad-accent)" 
          fillOpacity="0.8" 
          stroke="hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) + 15%))" 
          strokeOpacity="0.9"
        />

        {/* Module Cube 3 - Top Outer Connecting Cap */}
        <path 
          d="M50 20 L75 35 L50 50 L25 35 Z" 
          fill="none" 
          stroke="hsl(var(--secondary-h) var(--secondary-s) calc(var(--secondary-l) + 20%))" 
          strokeWidth="3"
        />

        {/* Inner core connecting node */}
        <circle cx="50" cy="50" r="6" fill="#ffffff" filter="url(#logo-glow)" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="50" cy="50" r="4" fill="hsl(var(--accent-h) var(--accent-s) var(--accent-l))" />
      </g>
    </svg>
  )
}
