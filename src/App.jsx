import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCatalogStore } from './store/useCatalogStore.js'
import { DynamicBrandingProvider, getContrastRatio } from './components/DynamicBrandingProvider.jsx'
import { SchemaFormGenerator } from './components/SchemaFormGenerator.jsx'
import { AgentChatInterface } from './components/AgentChatInterface.jsx'
import { TapShield } from './components/TapShield.jsx'
import { DigitalClock } from './components/DigitalClock.jsx'
import { ComponentCalendar } from './components/ComponentCalendar.jsx'
import QuantitySelector from './components/QuantitySelector.jsx'
import { BreathingBackground } from './components/BreathingBackground.jsx'

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
    resetBranding,
    backgroundConfig,
    setBackgroundConfig
  } = useCatalogStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [schemaText, setSchemaText] = useState(formSchema)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('preview')
  const [qtyValue, setQtyValue] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [isBgModalOpen, setIsBgModalOpen] = useState(false)



  useEffect(() => {
    setSchemaText(formSchema)
  }, [formSchema])

  const filteredComponents = (Array.isArray(registeredComponents) ? registeredComponents : []).filter((comp) => {
    if (!comp || typeof comp !== 'object') return false
    const name = comp.name || ''
    const category = comp.category || ''
    const description = comp.description || ''
    const matchesCategory = selectedCategory === 'Todos' || category === selectedCategory;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              onClick={resetBranding}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
            >
              Restablecer Branding
            </button>
          </div>
        </header>

        {/* Main Content Layout */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl w-full mx-auto">
          {/* Left Panel */}
          <section className="lg:col-span-4 space-y-6">
            {/* Component List */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-5 space-y-4">
              <div>
                <h2 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Componentes del Catálogo</h2>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Explora y prueba la interactividad de los módulos del ecosistema.
                </p>
              </div>

              {/* Filtros de Búsqueda y Categorías */}
              <div className="space-y-3 pt-1 border-t border-zinc-900/60">
                {/* Campo de búsqueda */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar componente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-7 py-2 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-200 placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  />
                  <svg className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 text-xs p-0.5"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Chips de Categorías */}
                <div className="flex flex-wrap gap-1 overflow-x-auto pb-1 max-h-[85px] scrollbar-thin">
                  {['Todos', 'Branding', 'UI Core', 'AI Integration', 'Utility', 'Core Dashboard', 'UI Atomic', 'UI Background'].map((cat) => {
                    const isSel = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[9px] px-2 py-0.5 rounded-md border font-medium transition-all cursor-pointer ${
                          isSel
                            ? 'bg-primary border-primary text-white'
                            : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col space-y-1 pt-1 border-t border-zinc-900/60">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((comp) => {
                    const isActive = activeComponent === comp.id;
                    return (
                      <button
                        key={comp.id}
                        onClick={() => {
                          setActiveComponent(comp.id)
                          setActiveTab('preview')
                        }}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between border ${
                          isActive
                            ? 'bg-primary/10 border-primary/25 text-primary shadow shadow-primary/5'
                            : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {comp.id === 'branding' && (
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-2.235 2.236m11.352-8.24a3 3 0 10-4.243-4.242L4.05 16.293a3 3 0 01-1.285.786l-2.083.694a1 1 0 00-1.185 1.185l.694 2.083c.2.6.47 1.15.825 1.637m15.885-16.73L13.5 12" />
                            </svg>
                          )}
                          {comp.id === 'form' && (
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                          {comp.id === 'chat' && (
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          )}
                          {comp.id === 'clock' && (
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {comp.id === 'calendar' && (
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                          {comp.id === 'quantity' && (
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {comp.id === 'tapshield' && (
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          )}
                          {comp.id === 'background' && (
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                            </svg>
                          )}
                          <span className="truncate">{comp.name}</span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono capitalize shrink-0 ${
                          isActive 
                            ? 'bg-primary/10 border-primary/20 text-primary' 
                            : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                        }`}>
                          {comp.category}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-zinc-600 text-[11px] py-6 text-center border border-dashed border-zinc-900 rounded-2xl bg-zinc-950/20">
                    Ningún componente coincide.
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {activeComponent === 'branding' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-6 overflow-hidden"
                >
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
                </motion.div>
              )}

              {activeComponent === 'background' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-6">
                    <div>
                      <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Ajustes del Fondo Respirable</h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Personaliza los parámetros del componente y observa cómo respira en tiempo real.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Color 1 Hue */}
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Matiz Color 1 (H)</span>
                          <span>{backgroundConfig.color1.h}º</span>
                        </div>
                        <input
                          type="range" min="0" max="360"
                          value={backgroundConfig.color1.h}
                          onChange={(e) => setBackgroundConfig({
                            color1: { ...backgroundConfig.color1, h: Number(e.target.value) }
                          })}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      {/* Color 2 Hue */}
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Matiz Color 2 (H)</span>
                          <span>{backgroundConfig.color2.h}º</span>
                        </div>
                        <input
                          type="range" min="0" max="360"
                          value={backgroundConfig.color2.h}
                          onChange={(e) => setBackgroundConfig({
                            color2: { ...backgroundConfig.color2, h: Number(e.target.value) }
                          })}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>

                      {/* Velocidad */}
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Duración del Ciclo (Velocidad)</span>
                          <span>{backgroundConfig.speed}s</span>
                        </div>
                        <input
                          type="range" min="2" max="30" step="1"
                          value={backgroundConfig.speed}
                          onChange={(e) => setBackgroundConfig({ speed: Number(e.target.value) })}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      {/* Opacidad */}
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Opacidad</span>
                          <span>{Math.round(backgroundConfig.opacity * 100)}%</span>
                        </div>
                        <input
                          type="range" min="0.05" max="0.9" step="0.05"
                          value={backgroundConfig.opacity}
                          onChange={(e) => setBackgroundConfig({ opacity: Number(e.target.value) })}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      {/* Blur */}
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Desenfoque (Blur)</span>
                          <span>{backgroundConfig.blur}px</span>
                        </div>
                        <input
                          type="range" min="10" max="180" step="5"
                          value={backgroundConfig.blur}
                          onChange={(e) => setBackgroundConfig({ blur: Number(e.target.value) })}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      {/* Rango de Movimiento */}
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Rango de Movimiento</span>
                          <span>{backgroundConfig.movementRange}px</span>
                        </div>
                        <input
                          type="range" min="0" max="150" step="5"
                          value={backgroundConfig.movementRange}
                          onChange={(e) => setBackgroundConfig({ movementRange: Number(e.target.value) })}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Right Panel */}
          <section className="lg:col-span-8 flex flex-col space-y-6">
            {/* Showcase Header */}
            {(() => {
              const activeCompInfo = registeredComponents.find(c => c.id === activeComponent) || {};
              return (
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-5 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{activeCompInfo.name}</h2>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono capitalize">
                        {activeCompInfo.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{activeCompInfo.description}</p>
                  </div>

                  {/* Preview vs Docs Switcher */}
                  <div className="flex p-0.5 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 self-start md:self-auto">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'preview'
                          ? 'bg-zinc-800 text-zinc-100 shadow shadow-black/40'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Visualizador
                    </button>
                    <button
                      onClick={() => setActiveTab('docs')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'docs'
                          ? 'bg-zinc-800 text-zinc-100 shadow shadow-black/40'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Documentación
                    </button>
                  </div>
                </div>
              );
            })()}

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

                    {activeComponent === 'background' && (
                      <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col items-center justify-center space-y-6 min-h-[420px] relative overflow-hidden">
                        {/* Breathing background preview inside container */}
                        <BreathingBackground
                          color1={backgroundConfig.color1}
                          color2={backgroundConfig.color2}
                          speed={backgroundConfig.speed}
                          blur={backgroundConfig.blur}
                          opacity={backgroundConfig.opacity}
                          movementRange={backgroundConfig.movementRange}
                          scaleRange={[backgroundConfig.scaleMin, backgroundConfig.scaleMax]}
                        />
                        
                        <div className="z-10 text-center max-w-md space-y-4 p-6 rounded-2xl bg-zinc-950/85 border border-white/5 backdrop-blur-md shadow-2xl">
                          <h3 className="text-base font-bold text-zinc-100">Fondo Respirando</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            El contenedor exterior está usando el componente `BreathingBackground`. Mueve el cursor sobre esta visualización para interactuar con el fondo.
                          </p>
                          
                          <div className="flex justify-center pt-2">
                            <button
                              onClick={() => setIsBgModalOpen(true)}
                              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all shadow-md shadow-primary/20 active:scale-95 cursor-pointer flex items-center space-x-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0l-6-6" />
                              </svg>
                              <span>Probar en Pantalla Completa (Modal)</span>
                            </button>
                          </div>

                          <div className="pt-2 flex justify-center space-x-4 text-[10px] text-zinc-500 font-mono border-t border-white/5">
                            <span>FPS: ~60 (GPU)</span>
                            <span>•</span>
                            <span>Interactividad: Sí</span>
                          </div>
                        </div>
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
                        <h3 className="text-xl font-bold text-zinc-100">Modal Tap-Shield Mobile-First (TapShield)</h3>
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

                    {activeComponent === 'background' && (
                      <div className="prose prose-invert max-w-none space-y-6">
                        <h3 className="text-xl font-bold text-zinc-100">Fondo Orgánico Respirable (BreathingBackground)</h3>
                        <p className="text-sm text-zinc-400">Este componente crea un fondo orgánico con gradientes de color que aumentan y disminuyen lentamente su escala y posición, imitando una respiración. Es ideal para fondos elegantes de paneles SaaS multitenant.</p>
                        
                        <h4 className="text-sm font-bold text-zinc-300">1. Propósito y Casos de Uso</h4>
                        <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                          <li>Micro-interacción Orgánica: Añade dinamismo y sensación de "vida" a la interfaz sin distraer.</li>
                          <li>Optimización Extrema: Utiliza animaciones de propiedades compuestas (`scale`, `translate3d`) aceleradas por GPU, garantizando cero reflows en el DOM.</li>
                        </ul>

                        <h4 className="text-sm font-bold text-zinc-300">2. Props y API del Componente</h4>
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
                              <td className="border border-zinc-800 p-2 font-mono text-primary">color1</td>
                              <td className="border border-zinc-800 p-2 font-mono">object</td>
                              <td className="border border-zinc-800 p-2 font-mono">HSL</td>
                              <td className="border border-zinc-800 p-2">Objeto HSL del primer blob respirable.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">color2</td>
                              <td className="border border-zinc-800 p-2 font-mono">object</td>
                              <td className="border border-zinc-800 p-2 font-mono">HSL</td>
                              <td className="border border-zinc-800 p-2">Objeto HSL del segundo blob respirable.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">speed</td>
                              <td className="border border-zinc-800 p-2 font-mono">number</td>
                              <td className="border border-zinc-800 p-2 font-mono">10</td>
                              <td className="border border-zinc-800 p-2">Duración en segundos de un ciclo completo de respiración.</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">blur</td>
                              <td className="border border-zinc-800 p-2 font-mono">number</td>
                              <td className="border border-zinc-800 p-2 font-mono">80</td>
                              <td className="border border-zinc-800 p-2">Filtro de desenfoque aplicado a los gradientes (en px).</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">opacity</td>
                              <td className="border border-zinc-800 p-2 font-mono">number</td>
                              <td className="border border-zinc-800 p-2 font-mono">0.25</td>
                              <td className="border border-zinc-800 p-2">Opacidad general del contenedor (0 a 1).</td>
                            </tr>
                            <tr>
                              <td className="border border-zinc-800 p-2 font-mono text-primary">movementRange</td>
                              <td className="border border-zinc-800 p-2 font-mono">number</td>
                              <td className="border border-zinc-800 p-2 font-mono">50</td>
                              <td className="border border-zinc-800 p-2">Límite de translación de movimiento de los blobs (en px).</td>
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

        <TapShield
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Prueba de Tap-Shield & Portal"
        >
          <p className="text-zinc-300">Esta ventana flotante utiliza React Portals para montarse directamente en la raíz del DOM.</p>
        </TapShield>

        <TapShield
          isOpen={isBgModalOpen}
          onClose={() => setIsBgModalOpen(false)}
          title="Fondo Respirable Interactivo"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden bg-zinc-950 rounded-2xl">
            <BreathingBackground
              color1={backgroundConfig.color1}
              color2={backgroundConfig.color2}
              speed={backgroundConfig.speed}
              blur={backgroundConfig.blur}
              opacity={backgroundConfig.opacity}
              movementRange={backgroundConfig.movementRange}
              scaleRange={[backgroundConfig.scaleMin, backgroundConfig.scaleMax]}
            />
          </div>
          <div className="relative z-10 space-y-4">
            <p className="text-zinc-300 text-xs leading-relaxed">
              Mueve el mouse por la pantalla para ver el efecto de paralaje interactivo en tiempo real. Los blobs de color se desplazarán suavemente respondiendo a tu cursor, incluso sobre este modal.
            </p>
            <div className="flex justify-end pt-3">
              <button
                onClick={() => setIsBgModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-semibold transition-colors cursor-pointer border border-zinc-800"
              >
                Cerrar Vista
              </button>
            </div>
          </div>
        </TapShield>

        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 font-mono">
          PROTOTIPE Multitenant SaaS Component Library & Catalog © 2026
        </footer>
      </div>
    </DynamicBrandingProvider>
  )
}

export default App
