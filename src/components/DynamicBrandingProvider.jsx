import React from 'react'

export function getLuminance(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const y = k(n)
    const val = l - a * Math.max(-1, Math.min(y - 3, 9 - y, 1))
    return val
  }
  
  const r = f(0)
  const g = f(8)
  const b = f(4)

  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1.h, color1.s, color1.l)
  const lum2 = getLuminance(color2.h, color2.s, color2.l)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

export const BrandingContext = React.createContext({
  primaryContrastWithDarkBg: 4.5,
  primaryContrastWithLightText: 4.5,
  isAccessible: true,
})

export const DynamicBrandingProvider = ({ primary, children }) => {
  // Validate and sanitize primary HSL input to avoid crashes on bad tenant configs
  const sanitizeColor = (color) => {
    if (!color || typeof color !== 'object') {
      return { h: 262, s: 83, l: 58 } // safe default
    }
    const h = typeof color.h === 'number' && !isNaN(color.h) ? Math.max(0, Math.min(360, color.h)) : 262
    const s = typeof color.s === 'number' && !isNaN(color.s) ? Math.max(0, Math.min(100, color.s)) : 83
    const l = typeof color.l === 'number' && !isNaN(color.l) ? Math.max(0, Math.min(100, color.l)) : 58
    return { h, s, l }
  }

  const safePrimary = sanitizeColor(primary)
  const darkBg = { h: 220, s: 20, l: 3 }
  const lightText = { h: 0, s: 0, l: 95 }

  const primaryContrastWithDarkBg = getContrastRatio(safePrimary, darkBg)
  const primaryContrastWithLightText = getContrastRatio(safePrimary, lightText)
  
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
