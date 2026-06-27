import { create } from 'zustand'

export interface HSLColor {
  h: number
  s: number
  l: number
}

export interface BrandingState {
  primary: HSLColor
  secondary: HSLColor
  accent: HSLColor
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  status?: 'thinking' | 'done' | 'executing'
  toolExecutions?: Array<{
    name: string
    params: Record<string, any>
    output: string
  }>
}

export interface RegisteredComponent {
  id: string
  name: string
  date: string
  description: string
  category: string
}

interface CatalogState {
  branding: BrandingState
  activeComponent: 'branding' | 'form' | 'chat' | 'clock' | 'calendar'
  chatMessages: Message[]
  formSchema: string
  formValues: Record<string, any>
  registeredComponents: RegisteredComponent[]
  setBranding: (branding: Partial<BrandingState>) => void
  setActiveComponent: (component: 'branding' | 'form' | 'chat' | 'clock' | 'calendar') => void
  addChatMessage: (msg: Message) => void
  clearChat: () => void
  setFormSchema: (schema: string) => void
  setFormValues: (values: Record<string, any>) => void
  resetBranding: () => void
}

const DEFAULT_BRANDING: BrandingState = {
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

export const useCatalogStore = create<CatalogState>((set) => ({
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
    { id: 'calendar', name: 'Component Calendar', date: '2026-06-27', description: 'Calendario interactivo de lanzamientos y registro de componentes.', category: 'Core Dashboard' }
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
