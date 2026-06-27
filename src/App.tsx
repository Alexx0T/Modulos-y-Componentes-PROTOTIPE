import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCatalogStore } from './store/useCatalogStore'
import type { Message } from './store/useCatalogStore'
import { DynamicBrandingProvider, getContrastRatio } from './components/DynamicBrandingProvider'
import { SchemaFormGenerator } from './components/SchemaFormGenerator'
import { AgentChatInterface } from './components/AgentChatInterface'
import { TapShieldModal } from './components/TapShieldModal'
import { DigitalClock } from './components/DigitalClock'
import { ComponentCalendar } from './components/ComponentCalendar'

function App() {
  const {
    branding,
    activeComponent,
    chatMessages,
    formSchema,
    formValues,
    registeredComponents,
    setBranding,
    setActiveComponent,
    addChatMessage,
    clearChat,
    setFormSchema,
    setFormValues,
    resetBranding
  } = useCatalogStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [schemaText, setSchemaText] = useState(formSchema)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'docs'>('preview')

  const navScrollRef = useRef<HTMLDivElement>(null)

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const scrollAmount = 150
      navScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Keep internal schema state sync with store
  useEffect(() => {
    setSchemaText(formSchema)
  }, [formSchema])

  // Contrast calculations
  const darkBg = { h: 220, s: 20, l: 3 }
  const lightText = { h: 0, s: 0, l: 95 }
  const primaryContrast = getContrastRatio(branding.primary, darkBg)
  const textContrast = getContrastRatio(branding.primary, lightText)

  // Simulation handler for Chat UI
  const handleUserMessage = (text: string) => {
    // User message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
      status: 'done'
    }
    addChatMessage(userMsg)

    // Simulate Agent Thinking & Tool Calling
    setIsTyping(true)
    setTimeout(() => {
      // Step 1: Simulated Tool Call
      const toolCallMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Analizando tus requerimientos en base de datos SaaS...',
        timestamp: new Date().toLocaleTimeString(),
        status: 'executing',
        toolExecutions: [
          {
            name: 'consultarBaseTenant',
            params: { query: text },
            output: '{\n  "tenantId": "Tenant_PROTOTIPE_Alpha",\n  "status": "active",\n  "quotaUsed": 84.5\n}'
          }
        ]
      }
      addChatMessage(toolCallMsg)
      setIsTyping(false)

      // Step 2: Final answer streaming
      setTimeout(() => {
        const finalMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `Procesamiento completado para el query: "${text}". He verificado que la cuota de tu tenant actual es del 84.5% y todos los sistemas están operando con normalidad. ¿Hay algún otro componente o parámetro que quieras modificar?`,
          timestamp: new Date().toLocaleTimeString(),
          status: 'done'
        }
        addChatMessage(finalMsg)
      }, 1500)
    }, 1500)
  }

  // Update HSL sliders dynamically
  const handleColorChange = (key: 'primary' | 'secondary' | 'accent', channel: 'h' | 's' | 'l', val: number) => {
    setBranding({
      [key]: {
        ...branding[key],
        [channel]: val
      }
    })
  }

  return (
    <DynamicBrandingProvider primary={branding.primary}>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
        {/* Header */}
        <header className="border-b border-zinc-900 bg-zinc-950/80 sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white shadow-md shadow-primary/20">
              P
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight m-0 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                PROTOTIPE Ecosystem
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ESTADO: MULTITENANT READY</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
            >
              Test Mobile Tap Shield
            </button>
            <button
              onClick={resetBranding}
              className="text-xs text-zinc-500 hover:text-primary transition-colors cursor-pointer"
            >
              Restablecer Branding
            </button>
          </div>
        </header>

        {/* Main Content Layout */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl w-full mx-auto">
          {/* Left Panel: dynamic variables & customizers */}
          <section className="lg:col-span-4 space-y-6">
            {/* Branding customizer */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-6">
              <div>
                <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Inyección de Branding HSL</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Modifica las variables HSL dinámicas y observa cómo cambia toda la interfaz en tiempo real.
                </p>
              </div>

              {/* Sliders for Primary Color */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Color Primario (Primary HSL)</span>
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Hue (Matiz)</span>
                      <span>{branding.primary.h}°</span>
                    </div>
                    <input
                      type="range" min="0" max="360"
                      value={branding.primary.h}
                      onChange={(e) => handleColorChange('primary', 'h', Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Saturation (Saturación)</span>
                      <span>{branding.primary.s}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100"
                      value={branding.primary.s}
                      onChange={(e) => handleColorChange('primary', 's', Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Lightness (Luminosidad)</span>
                      <span>{branding.primary.l}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100"
                      value={branding.primary.l}
                      onChange={(e) => handleColorChange('primary', 'l', Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Sliders for Secondary Color */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Color Secundario (Secondary HSL)</span>
                  <div className="w-4 h-4 rounded-full bg-secondary" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Hue</span>
                      <span>{branding.secondary.h}°</span>
                    </div>
                    <input
                      type="range" min="0" max="360"
                      value={branding.secondary.h}
                      onChange={(e) => handleColorChange('secondary', 'h', Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Sliders for Accent Color */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Color Acento (Accent HSL)</span>
                  <div className="w-4 h-4 rounded-full bg-accent" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Hue</span>
                      <span>{branding.accent.h}°</span>
                    </div>
                    <input
                      type="range" min="0" max="360"
                      value={branding.accent.h}
                      onChange={(e) => handleColorChange('accent', 'h', Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Metrics */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-4">
              <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Validador de Contraste WCAG</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 font-medium">Contraste vs Fondo Oscuro</div>
                  <div className="text-lg font-bold mt-1 text-zinc-200">{primaryContrast.toFixed(2)}:1</div>
                  <div className="mt-1">
                    {primaryContrast >= 4.5 ? (
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/30">Pasa WCAG AA</span>
                    ) : primaryContrast >= 3.0 ? (
                      <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/30">Pasa Textos Grandes</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/30">No Accesible</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 font-medium">Contraste vs Texto Claro</div>
                  <div className="text-lg font-bold mt-1 text-zinc-200">{textContrast.toFixed(2)}:1</div>
                  <div className="mt-1">
                    {textContrast >= 4.5 ? (
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/30">Pasa WCAG AA</span>
                    ) : textContrast >= 3.0 ? (
                      <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/30">Pasa Textos Grandes</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/30">No Accesible</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel: Showcase Playgrounds & Docs */}
          <section className="lg:col-span-8 flex flex-col space-y-6">
            {/* Component Picker Navigation */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-zinc-900 pb-3 gap-3">
              {/* Slider wrapper with arrow buttons */}
              <div className="flex items-center space-x-1 flex-1 min-w-0 max-w-full md:max-w-md lg:max-w-lg">
                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={() => scrollNav('left')}
                  className="p-1.5 rounded-lg hover:bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer flex-shrink-0"
                  aria-label="Desplazar izquierda"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Nav buttons scrollable container */}
                <div
                  ref={navScrollRef}
                  className="flex flex-1 overflow-x-auto whitespace-nowrap space-x-1.5 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80 scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <button
                    onClick={() => setActiveComponent('branding')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
                      activeComponent === 'branding' ? 'bg-primary text-white shadow shadow-primary/20' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Theme Inspector
                  </button>
                  <button
                    onClick={() => setActiveComponent('form')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
                      activeComponent === 'form' ? 'bg-primary text-white shadow shadow-primary/20' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Dynamic Form
                  </button>
                  <button
                    onClick={() => setActiveComponent('chat')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
                      activeComponent === 'chat' ? 'bg-primary text-white shadow shadow-primary/20' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    AI Chat Interface
                  </button>
                  <button
                    onClick={() => setActiveComponent('clock')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
                      activeComponent === 'clock' ? 'bg-primary text-white shadow shadow-primary/20' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Digital Clock
                  </button>
                  <button
                    onClick={() => setActiveComponent('calendar')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
                      activeComponent === 'calendar' ? 'bg-primary text-white shadow shadow-primary/20' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Component Calendar
                  </button>
                </div>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={() => scrollNav('right')}
                  className="p-1.5 rounded-lg hover:bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer flex-shrink-0"
                  aria-label="Desplazar derecha"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Preview vs Documentation Switcher */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'preview' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Visualizador (Playground)
                </button>
                <button
                  onClick={() => setActiveTab('docs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'docs' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Documentación
                </button>
              </div>
            </div>

            {/* Showcase Stage */}
            <div className="flex-1 min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === 'preview' ? (
                  <motion.div
                    key={`${activeComponent}-preview`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {activeComponent === 'branding' && (
                      <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-6">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-100">Visor de Derivación del Branding HSL</h3>
                          <p className="text-xs text-zinc-400 mt-1">
                            Calculamos automáticamente variaciones de color en base a cálculos matemáticos usando las variables nativas HSL.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col space-y-4">
                            <span className="text-xs font-semibold text-zinc-300">Variaciones del Primario</span>
                            <div className="space-y-2">
                              <div className="h-10 rounded-lg bg-primary flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg shadow-primary/10">
                                Principal (HSL)
                              </div>
                              <div
                                style={{
                                  backgroundColor: `hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) - 10%))`
                                }}
                                className="h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white shadow-md"
                              >
                                Hover (-10% Lightness)
                              </div>
                              <div
                                style={{
                                  backgroundColor: `hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) + 15%))`
                                }}
                                className="h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-zinc-950"
                              >
                                Brillante (+15% Lightness)
                              </div>
                            </div>
                          </div>

                          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col space-y-4">
                            <span className="text-xs font-semibold text-zinc-300">Variaciones del Secundario</span>
                            <div className="space-y-2">
                              <div className="h-10 rounded-lg bg-secondary flex items-center justify-center text-xs font-mono font-bold text-white">
                                Secundario
                              </div>
                              <div
                                style={{
                                  backgroundColor: `hsl(var(--secondary-h) var(--secondary-s) calc(var(--secondary-l) - 10%))`
                                }}
                                className="h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white"
                              >
                                Hover (-10%)
                              </div>
                            </div>
                          </div>

                          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col space-y-4">
                            <span className="text-xs font-semibold text-zinc-300">Variaciones del Acento</span>
                            <div className="space-y-2">
                              <div className="h-10 rounded-lg bg-accent flex items-center justify-center text-xs font-mono font-bold text-white">
                                Acento
                              </div>
                              <div
                                style={{
                                  backgroundColor: `hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) - 10%))`
                                }}
                                className="h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white"
                              >
                                Hover (-10%)
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive UI Cards using dynamic variables */}
                        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-4">
                          <div>
                            <h4 className="text-zinc-100 font-bold">Tarjeta de Prueba de Branding</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">Esta tarjeta hereda el color del borde y fondo dinámicamente.</p>
                          </div>
                          <button className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md shadow-primary/15 cursor-pointer">
                            Botón Primario Dinámico
                          </button>
                        </div>
                      </div>
                    )}

                    {activeComponent === 'form' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Interactive schema editor */}
                        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col space-y-4">
                          <div>
                            <h3 className="text-sm font-bold text-zinc-300">Editor de Esquema JSON</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Cambia el esquema JSON y el formulario de la derecha se actualizará dinámicamente.
                            </p>
                          </div>
                          <textarea
                            value={schemaText}
                            onChange={(e) => {
                              setSchemaText(e.target.value)
                              setFormSchema(e.target.value)
                            }}
                            className="flex-1 w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none min-h-[300px]"
                          />
                        </div>

                        {/* Form render stage */}
                        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10">
                          <SchemaFormGenerator
                            schemaJson={formSchema}
                            onChange={(values) => setFormValues(values)}
                          />

                          {/* Show Form State */}
                          <div className="mt-6 pt-6 border-t border-zinc-900">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Estado de Valores (Salida JSON):</h4>
                            <pre className="mt-2 p-3 bg-zinc-950 rounded-xl border border-zinc-900 text-xs font-mono text-zinc-300 overflow-x-auto">
                              {JSON.stringify(formValues, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeComponent === 'chat' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Simulated Agent Chat Component */}
                        <div className="md:col-span-8">
                          <AgentChatInterface
                            messages={chatMessages}
                            onSendMessage={handleUserMessage}
                            onClearChat={clearChat}
                            isTyping={isTyping}
                          />
                        </div>

                        {/* Simulation controls panel */}
                        <div className="md:col-span-4 p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-4 h-fit">
                          <h3 className="text-sm font-bold text-zinc-300">Controles de Simulación</h3>
                          <p className="text-xs text-zinc-500">
                            Prueba interacciones asíncronas imitando el flujo de agentes inteligentes de IA.
                          </p>

                          <div className="space-y-2 pt-2">
                            <button
                              onClick={() => handleUserMessage("Consulta los detalles de cuota de almacenamiento del tenant.")}
                              className="w-full text-left p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all text-xs font-medium cursor-pointer"
                            >
                              Simular consulta de cuotas (Tool call)
                            </button>
                            <button
                              onClick={() => {
                                setIsTyping(true)
                                setTimeout(() => setIsTyping(false), 2000)
                              }}
                              className="w-full text-left p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all text-xs font-medium cursor-pointer"
                            >
                              Simular burbuja de escritura (2 segundos)
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeComponent === 'clock' && (
                      <div className="py-12">
                        <DigitalClock />
                      </div>
                    )}

                    {activeComponent === 'calendar' && (
                      <ComponentCalendar components={registeredComponents} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${activeComponent}-docs`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-6 max-h-[600px] overflow-y-auto"
                  >
                    {activeComponent === 'branding' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía de Inyección de Branding Dinámico</h3>
                        <p className="text-sm text-zinc-400">
                          Este sistema inyecta tokens de branding HSL dinámicos en el elemento raíz del DOM (`:root`) como variables CSS nativas, permitiendo la adaptación en SaaS Multitenant.
                        </p>

                        <h4 className="text-sm font-bold text-zinc-300">Variables Utilizadas</h4>
                        <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300">
{`:root {
  --primary-h: 262;
  --primary-s: 83%;
  --primary-l: 58%;

  --color-primary: hsl(var(--primary-h) var(--primary-s) var(--primary-l));
  --color-primary-hover: hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) - 8%));
}`}
                        </pre>

                        <h4 className="text-sm font-bold text-zinc-300">Propiedades Clave</h4>
                        <ul className="list-disc pl-5 text-sm text-zinc-400 space-y-1">
                          <li>Accesibilidad verificada en tiempo real mediante cálculo de contraste WCAG.</li>
                          <li>Cálculo de estados hover mediante operaciones nativas CSS (`calc()`).</li>
                        </ul>
                      </div>
                    )}

                    {activeComponent === 'form' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía de SchemaFormGenerator</h3>
                        <p className="text-sm text-zinc-400">
                          El `SchemaFormGenerator` procesa dinámicamente un esquema estructurado (JSON Schema estándar) y dibuja los controles necesarios, resolviendo validaciones a nivel de UI sin Layout Shifts (CLS = 0).
                        </p>

                        <h4 className="text-sm font-bold text-zinc-300">Uso Básico</h4>
                        <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300">
{`import { SchemaFormGenerator } from './components/SchemaFormGenerator'

const miEsquema = {
  type: "object",
  required: ["agentName"],
  properties: {
    agentName: { type: "string", title: "Nombre del Agente" }
  }
};

<SchemaFormGenerator
  schemaJson={JSON.stringify(miEsquema)}
  onChange={(valores) => console.log(valores)}
/>`}
                        </pre>
                      </div>
                    )}

                    {activeComponent === 'chat' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía del AgentChatInterface</h3>
                        <p className="text-sm text-zinc-400">
                          La interfaz de chat de agente incluye micro-animaciones fluidas con Framer Motion, soporte mobile-first y una visualización clara para llamadas a herramientas de agentes inteligentes.
                        </p>

                        <h4 className="text-sm font-bold text-zinc-300">Características de Rendimiento</h4>
                        <ul className="list-disc pl-5 text-sm text-zinc-400 space-y-1">
                          <li>Aceleración GPU activa mediante `will-change: transform` y `backface-visibility: hidden`.</li>
                          <li>Prevención de Layout Shifts reservando la altura física de las burbujas de carga.</li>
                          <li>Portals integrados para overlays y backdrops.</li>
                        </ul>
                      </div>
                    )}
                    {activeComponent === 'clock' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía de DigitalClock</h3>
                        <p className="text-sm text-zinc-400">
                          Muestra la hora local del cliente en formato de 24 horas con segundero desacoplado y animaciones de latido en los delimitadores.
                        </p>
                        <h4 className="text-sm font-bold text-zinc-300">Uso Básico</h4>
                        <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300">
{`import { DigitalClock } from './components/DigitalClock'

<DigitalClock />`}
                        </pre>
                      </div>
                    )}

                    {activeComponent === 'calendar' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía de ComponentCalendar</h3>
                        <p className="text-sm text-zinc-400">
                          Calendario de cuadrícula interactiva que despliega los lanzamientos e hitos del catálogo en base a metadatos estructurados.
                        </p>
                        <h4 className="text-sm font-bold text-zinc-300">Uso Básico</h4>
                        <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300">
{`import { ComponentCalendar } from './components/ComponentCalendar'

<ComponentCalendar components={registeredComponents} />`}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>

        {/* Backdrop Tap-Shield modal trigger view */}
        <TapShieldModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Prueba de Tap-Shield & Portal"
        >
          <div className="space-y-4">
            <p className="text-zinc-300">
              Esta ventana flotante utiliza <strong>React Portals</strong> para montarse directamente en la raíz del documento, garantizando compatibilidad absoluta con la UI del dispositivo y previniendo colisiones de z-index.
            </p>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs font-mono text-primary flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Tap-Shield Backdrop activo. Cierra haciendo clic fuera o pulsando ESC.</span>
            </div>
          </div>
        </TapShieldModal>

        {/* Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 font-mono">
          PROTOTIPE Multitenant SaaS Component Library & Catalog © 2026
        </footer>
      </div>
    </DynamicBrandingProvider>
  )
}

export default App
