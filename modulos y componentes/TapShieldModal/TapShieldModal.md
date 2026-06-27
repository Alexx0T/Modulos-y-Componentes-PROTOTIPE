# Modal Tap-Shield Mobile-First (TapShieldModal)

Componente de interfaz reutilizable para renderizar modales flotantes (overlays) mediante React Portals en la raíz del documento, interceptando interacciones externas no deseadas.

---

## 1. Propósito y Casos de Uso
* **Seguridad Mobile-First (Tap-Shield):** Asegura que los clicks o taps fuera del modal se capturen de manera controlada y previene la propagación indeseada de eventos o scrolls en el body.
* **Portal de Renderizado:** Se monta directamente al final del `document.body` evitando problemas de herencia de `z-index` o recortes (`overflow: hidden`) en layouts contenedores.
* **Casos de Uso:**
  * Ventanas emergentes de confirmación o alerta.
  * Formularios de edición en overlays limpios.
  * Modales informativos premium con desenfoque de fondo.

---

## 2. Especificación Visual (Tailwind CSS HSL)
* **Backdrop Premium:** Fondo oscurecido (`bg-black/85`) con desenfoque dinámico (`backdrop-blur-md`) integrado.
* **Animación Fluida:** Transición elástica (spring physics) al abrir y cerrar usando Framer Motion con aceleración por GPU (`gpu-accelerated`).

---

## 3. Props y API del Componente
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Indica si el modal se encuentra desplegado. |
| `onClose` | `function` | - | Callback invocado para cerrar el modal (al presionar Escape, botón cerrar o hacer click fuera). |
| `title` | `string` | - | Título principal de la ventana modal. |
| `children` | `ReactNode` | - | Contenido HTML o componentes secundarios a renderizar dentro del modal. |

---

## 4. Código React Fuente Completo (`TapShieldModal.jsx`)
```jsx
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export const TapShieldModal = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl z-10 relative gpu-accelerated"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-zinc-100 mb-2">{title}</h3>
            
            <div className="mt-4 text-sm text-zinc-300 leading-relaxed min-h-[100px]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
```

---

## 5. Origen
* **Extraído de:** `src/components/TapShieldModal.jsx`
* **Fecha de extracción:** 2026-06-27
* **Versión:** 1.0 (Integrado con React Portals y Framer Motion).
