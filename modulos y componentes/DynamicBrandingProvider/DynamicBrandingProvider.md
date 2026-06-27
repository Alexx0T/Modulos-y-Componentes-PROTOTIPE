# Proveedor de Branding Dinámico (DynamicBrandingProvider)

Módulo de lógica y contexto para la inyección de colores HSL en el documento raíz y el cálculo del contraste WCAG de legibilidad.

---

## 1. Propósito y Casos de Uso
* **Adaptación de Marca Blanca:** Facilita la inyección en caliente de los colores primario, secundario y acento configurados por cada tenant en el SaaS multitenant.
* **Verificación de Legibilidad:** Evalúa el nivel de contraste WCAG AA entre el color de marca del cliente y los fondos claros/oscuros.
* **Casos de Uso:**
  * Componente raíz para toda aplicación SaaS multitenant de marca blanca.
  * Selector dinámico de temas de cliente en paneles de configuración.

---

## 2. Especificación Visual (Tailwind CSS HSL)
* **Branding Nativo:** Controla variables CSS en `:root` que actualizan de forma reactiva todas las clases de Tailwind que utilicen `var(--color-primary)`, etc.

---

## 3. Props y API del Componente
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `primary` | `object` | - | Objeto `{ h, s, l }` que define el tono primario. |
| `children` | `node` | - | Componentes descendientes. |

---

## 4. Código React Fuente Completo (`DynamicBrandingProvider.jsx`)
```jsx
import React from 'react';

export function getLuminance(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const y = k(n);
    const val = l - a * Math.max(-1, Math.min(y - 3, 9 - y, 1));
    return val;
  };
  
  const r = f(0);
  const g = f(8);
  const b = f(4);

  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1.h, color1.s, color1.l);
  const lum2 = getLuminance(color2.h, color2.s, color2.l);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export const BrandingContext = React.createContext({
  primaryContrastWithDarkBg: 4.5,
  primaryContrastWithLightText: 4.5,
  isAccessible: true,
});

export const DynamicBrandingProvider = ({ primary, children }) => {
  const darkBg = { h: 220, s: 20, l: 3 };
  const lightText = { h: 0, s: 0, l: 95 };

  const primaryContrastWithDarkBg = getContrastRatio(primary, darkBg);
  const primaryContrastWithLightText = getContrastRatio(primary, lightText);
  
  const isAccessible = primaryContrastWithDarkBg >= 3.0 || primaryContrastWithLightText >= 3.0;

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
  );
};
```

---

## 5. Origen
* **Extraído de:** `src/components/DynamicBrandingProvider.jsx`
* **Fecha de extracción:** 2026-06-25
* **Versión:** 1.0 (Refactorizado con HSL variables).
