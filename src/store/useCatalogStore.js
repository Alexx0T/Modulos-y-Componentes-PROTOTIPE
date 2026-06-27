import { create } from 'zustand'

const DEFAULT_BRANDING = {
  primary: { h: 262, s: 83, l: 58 },
  secondary: { h: 217, s: 91, l: 60 },
  accent: { h: 330, s: 98, l: 60 }
}

const DEFAULT_SCHEMA = `{
  "title": "Configuración del Agente de Ventas",
  "description": "Establece los parámetros y el comportamiento de tu agente conversacional.",
  "type": "object",
  "required": ["agentName", "temperature", "role"],
  "properties": {
    "agentName": {
      "type": "string",
      "title": "Nombre del Agente",
      "placeholder": "ej. Alex, Key Account Executive"
    },
    "role": {
      "type": "string",
      "title": "Rol y Enfoque",
      "enum": ["Ventas Consultivas", "Soporte Técnico Nivel 1", "Atención al Cliente"],
      "default": "Ventas Consultivas"
    },
    "temperature": {
      "type": "number",
      "title": "Temperatura de Creatividad",
      "minimum": 0,
      "maximum": 1,
      "default": 0.7
    },
    "enableWebSearch": {
      "type": "boolean",
      "title": "Habilitar Búsqueda Web en tiempo real",
      "default": false
    }
  }
}`

export const useCatalogStore = create((set) => ({
  branding: DEFAULT_BRANDING,
  activeComponent: 'branding',
  chatMessages: [
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toLocaleTimeString(),
      status: 'done'
    }
  ],
  formSchema: DEFAULT_SCHEMA,
  formValues: {},
  registeredComponents: [
    { id: 'branding', name: 'Theme Inspector', date: '2026-06-25', description: 'Sistema de inyección de colores HSL y cálculo de contraste WCAG.', category: 'Branding' },
    { id: 'form', name: 'Dynamic Form Generator', date: '2026-06-26', description: 'Generador de formularios reactivos a partir de esquemas JSON.', category: 'UI Core' },
    { id: 'chat', name: 'AI Agent Chat Interface', date: '2026-06-26', description: 'Chat con acordeón para Tool Calls de IA y aceleración GPU.', category: 'AI Integration' },
    { id: 'clock', name: 'Digital Clock', date: '2026-06-27', description: 'Reloj digital sincronizado con zona horaria del cliente.', category: 'Utility' },
    { id: 'calendar', name: 'Component Calendar', date: '2026-06-27', description: 'Calendario interactivo de lanzamientos y registro de componentes.', category: 'Core Dashboard' },
    { id: 'quantity', name: 'Quantity Selector', date: '2026-06-06', description: 'Selector de cantidad atómico con botones circulares y límites de stock.', category: 'UI Atomic' },
    { id: 'tapshield', name: 'Tap-Shield Modal', date: '2026-06-27', description: 'Modal seguro con React Portals y backdrop oscurecido para mobile-first.', category: 'UI Atomic' }
  ],
  
  setBranding: (newBranding) => set((state) => {
    const updated = { ...state.branding, ...newBranding }
    
    // Apply CSS custom variables dynamically to the document root
    Object.entries(updated).forEach(([key, color]) => {
      document.documentElement.style.setProperty(`--${key}-h`, `${color.h}`)
      document.documentElement.style.setProperty(`--${key}-s`, `${color.s}%`)
      document.documentElement.style.setProperty(`--${key}-l`, `${color.l}%`)
    })
    
    return { branding: updated }
  }),
  
  setActiveComponent: (comp) => set({ activeComponent: comp }),
  
  addChatMessage: (msg) => set((state) => ({ 
    chatMessages: [...state.chatMessages, msg] 
  })),
  
  clearChat: () => set({
    chatMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Chat reiniciado. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date().toLocaleTimeString(),
        status: 'done'
      }
    ]
  }),
  
  setFormSchema: (schema) => set({ formSchema: schema }),
  setFormValues: (values) => set({ formValues: values }),
  
  resetBranding: () => {
    Object.entries(DEFAULT_BRANDING).forEach(([key, color]) => {
      document.documentElement.style.setProperty(`--${key}-h`, `${color.h}`)
      document.documentElement.style.setProperty(`--${key}-s`, `${color.s}%`)
      document.documentElement.style.setProperty(`--${key}-l`, `${color.l}%`)
    })
    set({ branding: DEFAULT_BRANDING })
  }
}))
