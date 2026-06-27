import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCatalogStore } from './store/useCatalogStore.js'
import { DynamicBrandingProvider, getContrastRatio } from './components/DynamicBrandingProvider.jsx'
import { SchemaFormGenerator } from './components/SchemaFormGenerator.jsx'
import { AgentChatInterface } from './components/AgentChatInterface.jsx'
import { TapShieldModal } from './components/TapShieldModal.jsx'
import { DigitalClock } from './components/DigitalClock.jsx'
import { ComponentCalendar } from './components/ComponentCalendar.jsx'
import QuantitySelector from './components/QuantitySelector.jsx'

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
  const [activeTab, setActiveTab] = useState('preview')
  const [qtyValue, setQtyValue] = useState(3)

  const navScrollRef = useRef(null)

  const scrollNav = (direction) => {
    if (navScrollRef.current) {
      const scrollAmount = 150
      navScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    setSchemaText(formSchema)
  }, [formSchema])

  const darkBg = { h: 220, s: 20, l: 3 }
  const lightText = { h: 0, s: 0, l: 95 }
  const primaryContrast = getContrastRatio(branding.primary, darkBg)
  const textContrast = getContrastRatio(branding.primary, lightText)

  const handleUserMessage = (text) => {
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
      status: 'done'
    }
    addChatMessage(userMsg)

    setIsTyping(true)
    setTimeout(() => {
      const toolCallMsg = {
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

      setTimeout(() => {
        const finalMsg = {
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

  const handleColorChange = (key, channel, val) => {
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
                PROTOTIPE Ecosystem (JS)
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
          {/* Left Panel */}
          <section className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-6">
              <div>
                <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Inyección de Branding HSL</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Modifica las variables HSL dinámicas y observa cómo cambia toda la interfaz en tiempo real.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Color Primario (Primary HSL)</span>
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Hue (Matiz)</span>
                      <span>{branding.primary.h}º</span>
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

              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Color Secundario (Secondary HSL)</span>
                  <div className="w-4 h-4 rounded-full bg-secondary" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Hue</span>
                      <span>{branding.secondary.h}º</span>
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
            </div>

            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-4">
              <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Validador de Contraste WCAG</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 font-medium">Contraste vs Fondo Oscuro</div>
                  <div className="text-lg font-bold mt-1 text-zinc-200">{primaryContrast.toFixed(2)}:1</div>
                  <div className="mt-1">
                    {primaryContrast >= 3.0 ? (
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/30">Pasa WCAG AA</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/30">No Accesible</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 font-medium">Contraste vs Texto Claro</div>
                  <div className="text-lg font-bold mt-1 text-zinc-200">{textContrast.toFixed(2)}:1</div>
                  <div className="mt-1">
                    {textContrast >= 3.0 ? (
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/30">Pasa WCAG AA</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/30">No Accesible</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel */}
          <section className="lg:col-span-8 flex flex-col space-y-6">
            {/* Component Picker Navigation */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-zinc-900 pb-3 gap-3">
              <div className="flex items-center space-x-1 flex-1 min-w-0 max-w-full md:max-w-md lg:max-w-lg">
                <button
                  type="button"
                  onClick={() => scrollNav('left')}
                  className="p-1.5 rounded-lg hover:bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div
                  ref={navScrollRef}
                  className="flex flex-1 overflow-x-auto whitespace-nowrap space-x-1.5 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80 scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {['branding', 'form', 'chat', 'clock', 'calendar', 'quantity', 'tapshield'].map((id) => (
                    <button
                      key={id}
                      onClick={() => setActiveComponent(id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-shrink-0 capitalize ${
                        activeComponent === id ? 'bg-primary text-white shadow shadow-primary/20' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {id === 'branding' ? 'Theme Inspector' : id === 'chat' ? 'AI Chat Interface' : id === 'tapshield' ? 'Tap-Shield Modal' : id.replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => scrollNav('right')}
                  className="p-1.5 rounded-lg hover:bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Preview vs Docs Switcher */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'preview' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Visualizador
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col space-y-2">
                            <span className="text-xs font-semibold text-zinc-300">Variaciones del Primario</span>
                            <div className="h-10 rounded-lg bg-primary flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg shadow-primary/10">
                              Principal
                            </div>
                            <div
                              style={{ backgroundColor: `hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) - 10%))` }}
                              className="h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white shadow-md"
                            >
                              Hover (-10% Lightness)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeComponent === 'form' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col space-y-4">
                          <textarea
                            value={schemaText}
                            onChange={(e) => {
                              setSchemaText(e.target.value)
                              setFormSchema(e.target.value)
                            }}
                            className="flex-1 w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none min-h-[300px]"
                          />
                        </div>
                        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10">
                          <SchemaFormGenerator
                            schemaJson={formSchema}
                            onChange={(values) => setFormValues(values)}
                          />
                        </div>
                      </div>
                    )}

                    {activeComponent === 'chat' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8">
                          <AgentChatInterface
                            messages={chatMessages}
                            onSendMessage={handleUserMessage}
                            onClearChat={clearChat}
                            isTyping={isTyping}
                          />
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

                    {activeComponent === 'quantity' && (
                      <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-100 text-center">Quantity Selector (Playground)</h3>
                          <p className="text-xs text-zinc-400 text-center mt-1">Incrementa o decrementa la cantidad con límites (Min: 1, Max: 15).</p>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Variante Normal (md)</span>
                            <QuantitySelector
                              value={qtyValue}
                              onChange={setQtyValue}
                              min={1}
                              max={15}
                              size="md"
                            />
                          </div>

                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Variante Pequeña (sm)</span>
                            <QuantitySelector
                              value={qtyValue}
                              onChange={setQtyValue}
                              min={1}
                              max={15}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeComponent === 'tapshield' && (
                      <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-100 text-center">Tap-Shield Modal (Playground)</h3>
                          <p className="text-xs text-zinc-400 text-center mt-1">Este componente utiliza un Portal de React para renderizarse fuera del árbol del DOM principal.</p>
                        </div>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
                        >
                          Abrir Modal de Prueba
                        </button>
                      </div>
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
                        <p className="text-sm text-zinc-400">Este sistema inyecta tokens de branding HSL dinámicos en el elemento raíz del DOM (`:root`) como variables CSS nativas.</p>
                      </div>
                    )}

                    {activeComponent === 'form' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía de SchemaFormGenerator</h3>
                        <p className="text-sm text-zinc-400">El `SchemaFormGenerator` procesa dinámicamente un esquema estructurado (JSON Schema estándar) y dibuja los controles necesarios.</p>
                      </div>
                    )}

                    {activeComponent === 'chat' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía del AgentChatInterface</h3>
                        <p className="text-sm text-zinc-400">La interfaz de chat de agente incluye micro-animaciones fluidas con Framer Motion y una visualización clara para llamadas a herramientas de agentes inteligentes.</p>
                      </div>
                    )}

                    {activeComponent === 'clock' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía de DigitalClock</h3>
                        <p className="text-sm text-zinc-400">Muestra la hora local del cliente en formato de 24 horas con segundero desacoplado.</p>
                      </div>
                    )}

                    {activeComponent === 'calendar' && (
                      <div className="prose prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-bold text-zinc-100">Guía de ComponentCalendar</h3>
                        <p className="text-sm text-zinc-400">Calendario de cuadrícula interactiva que despliega los lanzamientos e hitos del catálogo en base a metadatos estructurados.</p>
                      </div>
                    )}

                    {activeComponent === 'quantity' && (
                      <div className="prose prose-invert max-w-none space-y-6">
                        <h3 className="text-xl font-bold text-zinc-100">Selector de Cantidad (QuantitySelector)</h3>
                        <p className="text-sm text-zinc-400">Componente atómico para el ajuste e incremento/decremento de cantidades de artículos con soporte de límites mínimos y máximos, estados deshabilitados y consumo de variables HSL.</p>
                        
                        <h4 className="text-sm font-bold text-zinc-300">1. Propósito y Casos de Uso</h4>
                        <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                          <li>Control Fino: Evita que el usuario seleccione una cantidad menor que el mínimo o mayor que el stock límite/máximo.</li>
                          <li>Consistencia Visual: Diseño en píldora con botones redondos flotantes y feedback visual de escala activa (active:scale-90).</li>
                        </ul>

                        <h4 className="text-sm font-bold text-zinc-300">2. Especificación Visual (Tailwind CSS HSL)</h4>
                        <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                          <li>Diseño en Píldora: Contenedor redondeado (rounded-full) con bordes sutiles y botones concéntricos.</li>
                          <li>Tamaños Parametrizados: Soporta variante pequeña (size="sm") e intermedia (size="md").</li>
                        </ul>

                        <h4 className="text-sm font-bold text-zinc-300">3. Props y API del Componente</h4>
                        <table className="min-w-full text-xs text-zinc-400 border border-zinc-800">
                          <thead>
                            <tr className="bg-zinc-900">
                              <th className="border border-zinc-800 p-2 text-left">Prop</th>
                              <th className="border border-zinc-800 p-2 text-left">Tipo</th>
                              <th className="border border-zinc-800 p-2 text-left">Default</th>
                              <th className="border border-zinc-800 p-2 text-left">Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">value</td>
                              <td className="border border-zinc-800 p-2 font-mono">number</td>
                              <td className="border border-zinc-800 p-2 font-mono">-</td>
                              <td className="border border-zinc-800 p-2">Cantidad numérica actual.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">onChange</td>
                              <td className="border border-zinc-800 p-2 font-mono">function</td>
                              <td className="border border-zinc-800 p-2 font-mono">-</td>
                              <td className="border border-zinc-800 p-2">Callback invocado al cambiar la cantidad.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">min</td>
                              <td className="border border-zinc-800 p-2 font-mono">number</td>
                              <td className="border border-zinc-800 p-2 font-mono">1</td>
                              <td className="border border-zinc-800 p-2">Límite mínimo de selección.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">max</td>
                              <td className="border border-zinc-800 p-2 font-mono">number</td>
                              <td className="border border-zinc-800 p-2 font-mono">10</td>
                              <td className="border border-zinc-800 p-2">Límite máximo de selección.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">size</td>
                              <td className="border border-zinc-800 p-2 font-mono">string</td>
                              <td className="border border-zinc-800 p-2 font-mono">"md"</td>
                              <td className="border border-zinc-800 p-2">Tamaño de presentación: "sm" | "md".</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeComponent === 'tapshield' && (
                      <div className="prose prose-invert max-w-none space-y-6">
                        <h3 className="text-xl font-bold text-zinc-100">Modal Tap-Shield Mobile-First (TapShieldModal)</h3>
                        <p className="text-sm text-zinc-400">Componente de interfaz para renderizar modales flotantes mediante React Portals, bloqueando scrolls y clicks externos.</p>
                        
                        <h4 className="text-sm font-bold text-zinc-300">1. Propósito y Casos de Uso</h4>
                        <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                          <li>Captura de Taps: Intercepta interacciones exteriores previniendo interacciones fantasma en dispositivos móviles.</li>
                          <li>Prevención de Desplazamientos: Bloquea temporalmente el scroll del body del documento mientras está abierto.</li>
                        </ul>

                        <h4 className="text-sm font-bold text-zinc-300">2. Props y API del Componente</h4>
                        <table className="min-w-full text-xs text-zinc-400 border border-zinc-800">
                          <thead>
                            <tr className="bg-zinc-900">
                              <th className="border border-zinc-800 p-2 text-left">Prop</th>
                              <th className="border border-zinc-800 p-2 text-left">Tipo</th>
                              <th className="border border-zinc-800 p-2 text-left">Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">isOpen</td>
                              <td className="border border-zinc-800 p-2 font-mono">boolean</td>
                              <td className="border border-zinc-800 p-2">Indica si el modal está abierto.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">onClose</td>
                              <td className="border border-zinc-800 p-2 font-mono">function</td>
                              <td className="border border-zinc-800 p-2">Callback ejecutado para cerrar el modal.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">title</td>
                              <td className="border border-zinc-800 p-2 font-mono">string</td>
                              <td className="border border-zinc-800 p-2">Título de la cabecera.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>

        <TapShieldModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Prueba de Tap-Shield & Portal"
        >
          <p className="text-zinc-300">Esta ventana flotante utiliza React Portals para montarse directamente en la raíz del documento.</p>
        </TapShieldModal>

        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 font-mono">
          PROTOTIPE Multitenant SaaS Component Library & Catalog © 2026
        </footer>
      </div>
    </DynamicBrandingProvider>
  )
}

export default App
