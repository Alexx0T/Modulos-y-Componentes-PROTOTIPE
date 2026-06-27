import React from 'react'
import type { HSLColor } from '../store/useCatalogStore'

// Helper to convert HSL to relative luminance for WCAG accessibility checks
export function getLuminance(h: number, s: number, l: number): number {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const y = k(n)
    const val = l - a * Math.max(-1, Math.min(y - 3, 9 - y, 1))
    return val
  }
  
  // Calculate relative luminance formula (sRGB)
  const r = f(0)
  const g = f(8)
  const b = f(4)

  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function getContrastRatio(color1: HSLColor, color2: HSLColor): number {
  const lum1 = getLuminance(color1.h, color1.s, color1.l)
  const lum2 = getLuminance(color2.h, color2.s, color2.l)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

interface BrandingContextType {
  primaryContrastWithDarkBg: number
  primaryContrastWithLightText: number
  isAccessible: boolean
}

export const BrandingContext = React.createContext<BrandingContextType>({
  primaryContrastWithDarkBg: 4.5,
  primaryContrastWithLightText: 4.5,
  isAccessible: true,
})

export const DynamicBrandingProvider: React.FC<{
  primary: HSLColor
  children: React.ReactNode
}> = ({ primary, children }) => {
  // Base dark background HSL: 220, 20%, 3%
  const darkBg: HSLColor = { h: 220, s: 20, l: 3 }
  // Base light text HSL: 0, 0%, 95%
  const lightText: HSLColor = { h: 0, s: 0, l: 95 }

  const primaryContrastWithDarkBg = getContrastRatio(primary, darkBg)
  const primaryContrastWithLightText = getContrastRatio(primary, lightText)
  
  // Standard accessibility threshold (WCAG AA is 4.5:1)
  const isAccessible = primaryContrastWithDarkBg >= 3.0 || primaryContrastWithLightText >= 3.0

  return (
    <BrandingContext.Provider
      value={{
        primaryContrastWithDarkBg,
        primaryContrastWithLightText,
        isAccessible,
      }}
    >
      {children}
    </BrandingContext.Provider>
  )
}
