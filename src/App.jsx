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
import { PrototipeLogo } from '../modulos y componentes/PrototipeLogo/PrototipeLogo.jsx'
import { DatePicker, DatePickerBody, DatePickerCalendar, DatePickerInput, DatePickerPanel, DatePickerPopup, DatePickerPortal, DatePickerPositioner } from '../modulos y componentes/DatePicker/DatePicker.jsx'

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
  const [simpleTime, setSimpleTime] = useState(new Date().toLocaleTimeString())
  const [dateRange, setDateRange] = useState(null)

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setSimpleTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(clockTimer)
  }, [])

  useEffect(() => {
    setSchemaText(formSchema)
  }, [formSchema])

  const getComponentIcon = (id) => {
    switch (id) {
      case 'branding':
        return (
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v9h9" />
            <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
            <circle cx="10.5" cy="7.5" r="1.5" fill="currentColor" />
            <circle cx="7.5" cy="15" r="1.5" fill="currentColor" />
          </svg>
        )
      case 'form':
        return (
          <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 8h10M7 12h10M7 16h5" />
          </svg>
        )
      case 'chat':
        return (
          <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )
      case 'clock':
        return (
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 5 12 12 16 14" />
          </svg>
        )
      case 'calendar':
        return (
          <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )
      case 'datepicker':
        return (
          <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <rect x="8" y="14" width="8" height="4" rx="1" fill="currentColor" opacity="0.3" />
          </svg>
        )
      case 'quantity':
        return (
          <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="7" width="18" height="10" rx="5" />
            <circle cx="8" cy="12" r="3" fill="currentColor" />
            <line x1="14" y1="12" x2="18" y2="12" />
            <line x1="16" y1="10" x2="16" y2="14" />
          </svg>
        )
      case 'tapshield':
        return (
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 11l2 2 4-4" strokeWidth="2" />
          </svg>
        )
      case 'background':
        return (
          <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
            <path d="M7 10h10" />
          </svg>
        )
      case 'prototipelogo':
        return (
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="12" />
            <line x1="22" y1="8.5" x2="12" y2="12" />
            <line x1="2" y1="8.5" x2="12" y2="12" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        )
    }
  }

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
      <div className="relative w-screen h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden antialiased font-sans">
        <BreathingBackground
          color1={backgroundConfig.color1}
          color2={backgroundConfig.color2}
          speed={backgroundConfig.speed}
          blur={backgroundConfig.blur}
          opacity={backgroundConfig.opacity}
          movementRange={backgroundConfig.movementRange}
          scaleRange={[backgroundConfig.scaleMin, backgroundConfig.scaleMax]}
          className="fixed inset-0 z-0 pointer-events-none"
        />

        <aside className="w-80 h-full border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-xl flex flex-col shrink-0 z-20 relative">
          <div className="p-6 border-b border-zinc-900/60 flex items-center space-x-3">
            <div className="w-10 h-10 flex-shrink-0">
              <PrototipeLogo className="w-full h-full" animated={true} />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none tracking-tight m-0 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent uppercase font-mono">
                PROTOTIPE
              </h1>
              <p className="text-[9px] text-zinc-500 font-mono mt-1">SAAS MULTITENANT READY</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            <button
              onClick={() => setActiveComponent('dashboard')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-3 border ${
                activeComponent === 'dashboard'
                  ? 'bg-primary/10 border-primary/25 text-primary shadow shadow-primary/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Pantalla Principal</span>
            </button>

            <div className="pt-2 border-t border-zinc-900/60">
              <h2 className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase px-2 mb-2">Componentes</h2>
              
              <div className="relative mb-3">
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

              <div className="flex flex-wrap gap-1 mb-3">
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

              {/* Component List Grid (Only Logos) */}
              <div className="grid grid-cols-4 gap-2">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((comp) => {
                    const isActive = activeComponent === comp.id;
                    return (
                      <button
                        key={comp.id}
                        title={`${comp.name} - ${comp.category}`}
                        onClick={() => {
                          setActiveComponent(comp.id)
                          setActiveTab('preview')
                        }}
                        className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-primary/10 border-primary/40 text-primary shadow-lg shadow-primary/10 scale-105'
                            : 'border-transparent bg-zinc-900/30 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="transform scale-[0.6] pointer-events-none flex items-center justify-center">
                          {getComponentIcon(comp.id)}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-4 text-zinc-600 text-[10px] py-4 text-center border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
                    Sin coincidencias.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-900/60 space-y-3 bg-zinc-950/40">
            <button
              onClick={resetBranding}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
              </svg>
              <span>Restablecer Branding</span>
            </button>
            <p className="text-[9px] text-zinc-600 font-mono text-center m-0">PROTOTIPE © 2026</p>
          </div>
        </aside>

        <main className="flex-1 h-full overflow-y-auto flex flex-col relative z-10">
          <AnimatePresence mode="wait">
            {activeComponent === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-8 max-w-6xl w-full mx-auto space-y-8 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-8">
                  <div className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-gradient-to-br from-zinc-950/70 via-zinc-900/30 to-primary/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
                    <div className="space-y-4 max-w-xl text-center md:text-left">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-wider">
                        <span>●</span>
                        <span>Ecosistema Calibrado</span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        Catálogo de Módulos <br />
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">PROTOTIPE</span>
                      </h1>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Bienvenido al entorno de desarrollo y pruebas de la biblioteca de componentes multitenant de alto rendimiento. Modifica el branding dinámico, genera formularios dinámicos con validación y prueba la aceleración por hardware de nuestros blobs interactivos.
                      </p>
                    </div>
                    
                    <div className="w-48 h-48 flex items-center justify-center bg-zinc-900/20 border border-white/5 rounded-2xl backdrop-blur-sm p-4 relative group">
                      <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:bg-primary/20 transition-all duration-300 pointer-events-none" />
                      <PrototipeLogo className="w-36 h-36 relative z-10" animated={true} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">Componentes</div>
                        <div className="text-xl font-bold text-zinc-200">{registeredComponents.length} Activos</div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">WCAG AA</div>
                        <div className="text-xl font-bold text-zinc-200">
                          {primaryContrast >= 3.0 ? 'Pasa (Accesible)' : 'Bajo Contraste'}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">Hora Local</div>
                        <div className="text-sm font-bold text-zinc-200 font-mono tracking-wider">{simpleTime}</div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-850 flex items-center justify-center text-zinc-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">Tenant ID</div>
                        <div className="text-xs font-bold text-zinc-400 font-mono truncate max-w-[130px]">PROTOTIPE_Alpha</div>
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="pt-12 text-center text-[10px] text-zinc-600 font-mono">
                  PROTOTIPE Multitenant SaaS Component Library & Catalog • Versión 1.0.0
                </footer>
              </motion.div>
            ) : (
              /* DETAILED COMPONENT PLAYGROUND SHOWCASE */
              (() => {
                const activeCompInfo = registeredComponents.find(c => c.id === activeComponent) || {};
                return (
                  <motion.div
                    key={activeComponent}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="p-8 max-w-6xl w-full mx-auto space-y-6 flex-1 flex flex-col"
                  >
                    {/* Showcase Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-5 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{activeCompInfo.name}</h2>
                          <span className="text-[10px] px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono capitalize">
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Control Sliders Column */}
                                <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md space-y-5">
                                  <div>
                                    <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Ajustes de Branding HSL</h3>
                                    <p className="text-xs text-zinc-500 mt-1">
                                      Modifica las variables HSL dinámicas de este tenant.
                                    </p>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold text-zinc-300">Color Primario</span>
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
                                      <span className="text-xs font-semibold text-zinc-300">Color Secundario</span>
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

                                {/* Showcase & Validation Column */}
                                <div className="space-y-6">
                                  {/* Validador WCAG */}
                                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md space-y-4">
                                    <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Validador de Contraste WCAG</h3>
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

                                  {/* Derivación Visual */}
                                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-4">
                                    <div>
                                      <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Derivación Matemática</h3>
                                      <p className="text-[11px] text-zinc-500 mt-1">
                                        Derivado nativamente con CSS.
                                      </p>
                                    </div>
                                    <div className="space-y-3">
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
                                <div className="md:col-span-12">
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
                              <div className="py-12 flex justify-center">
                                <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md shadow-2xl">
                                  <DigitalClock />
                                </div>
                              </div>
                            )}

                            {activeComponent === 'calendar' && (
                              <ComponentCalendar components={registeredComponents} />
                            )}

                            {activeComponent === 'datepicker' && (
                              <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                                <div>
                                  <h3 className="text-lg font-bold text-zinc-100 text-center">Date Picker Range (Demo)</h3>
                                  <p className="text-xs text-zinc-400 text-center mt-1">Selecciona un rango de fechas en el calendario.</p>
                                </div>
                                
                                <div className="flex items-center space-x-8">
                                  <DatePicker value={dateRange} selectionMode="range" manualInput={false} onValueChange={(e) => setDateRange(e.value)}>
                                      <DatePickerInput placeholder="Seleccionar fechas..." className="text-zinc-900" />
                                      <DatePickerPortal>
                                          <DatePickerPositioner>
                                              <DatePickerPopup>
                                                  <DatePickerBody>
                                                      <DatePickerPanel>
                                                          <DatePickerCalendar />
                                                      </DatePickerPanel>
                                                  </DatePickerBody>
                                              </DatePickerPopup>
                                          </DatePickerPositioner>
                                      </DatePickerPortal>
                                  </DatePicker>
                                </div>
                              </div>
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Adjustments column */}
                                <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md space-y-5">
                                  <div>
                                    <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Ajustes del Fondo</h3>
                                    <p className="text-xs text-zinc-500 mt-1">
                                      Personaliza los parámetros del fondo respirable en tiempo real.
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

                                {/* Interactive Preview Canvas */}
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
                                  
                                  <div className="z-10 text-center max-w-sm space-y-4 p-5 rounded-2xl bg-zinc-950/85 border border-white/5 backdrop-blur-md shadow-2xl">
                                    <h4 className="text-sm font-bold text-zinc-100 font-sans">Fondo Respirando</h4>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                                      El contenedor exterior está usando el componente `BreathingBackground`. Mueve el cursor sobre esta visualización para interactuar con el fondo.
                                    </p>
                                    
                                    <div className="flex justify-center">
                                      <button
                                        onClick={() => setIsBgModalOpen(true)}
                                        className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-[10px] font-semibold transition-all shadow-md shadow-primary/20 active:scale-95 cursor-pointer flex items-center space-x-1.5"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0l-6-6" />
                                        </svg>
                                        <span>Ver Pantalla Completa</span>
                                      </button>
                                    </div>

                                    <div className="pt-2 flex justify-center space-x-3 text-[9px] text-zinc-500 font-mono border-t border-white/5">
                                      <span>FPS: ~60</span>
                                      <span>•</span>
                                      <span>GPU: Activa</span>
                                    </div>
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
                            className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-6 max-h-[600px] overflow-y-auto scrollbar-thin"
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

                            {activeComponent === 'datepicker' && (
                              <div className="prose prose-invert max-w-none space-y-6">
                                <h3 className="text-xl font-bold text-zinc-100">Date Picker (Range Mode)</h3>
                                <p className="text-sm text-zinc-400">Componente extraído de PrimeReact Headless y adaptado a Tailwind CSS para seleccionar rangos de fechas. Construido con arquitectura de sub-componentes (Root, Input, Portal, Popup, etc.).</p>
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
                                <div className="overflow-x-auto w-full border border-zinc-800 rounded-xl">
                                  <table className="min-w-full text-xs text-zinc-400">
                                    <thead>
                                      <tr className="bg-zinc-900/60 border-b border-zinc-800">
                                        <th className="p-2.5 text-left font-semibold">Prop</th>
                                        <th className="p-2.5 text-left font-semibold">Tipo</th>
                                        <th className="p-2.5 text-left font-semibold">Default</th>
                                        <th className="p-2.5 text-left font-semibold">Descripción</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/60">
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">value</td>
                                        <td className="p-2.5 font-mono">number</td>
                                        <td className="p-2.5 font-mono">-</td>
                                        <td className="p-2.5">Cantidad numérica actual.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">onChange</td>
                                        <td className="p-2.5 font-mono">function</td>
                                        <td className="p-2.5 font-mono">-</td>
                                        <td className="p-2.5">Callback invocado al cambiar la cantidad.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">min</td>
                                        <td className="p-2.5 font-mono">number</td>
                                        <td className="p-2.5 font-mono">1</td>
                                        <td className="p-2.5">Límite mínimo de selección.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">max</td>
                                        <td className="p-2.5 font-mono">number</td>
                                        <td className="p-2.5 font-mono">10</td>
                                        <td className="p-2.5">Límite máximo de selección.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">size</td>
                                        <td className="p-2.5 font-mono">string</td>
                                        <td className="p-2.5 font-mono">"md"</td>
                                        <td className="p-2.5">Tamaño de presentación: "sm" | "md".</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
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
                                <div className="overflow-x-auto w-full border border-zinc-800 rounded-xl">
                                  <table className="min-w-full text-xs text-zinc-400">
                                    <thead>
                                      <tr className="bg-zinc-900/60 border-b border-zinc-800">
                                        <th className="p-2.5 text-left font-semibold">Prop</th>
                                        <th className="p-2.5 text-left font-semibold">Tipo</th>
                                        <th className="p-2.5 text-left font-semibold">Descripción</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/60">
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">isOpen</td>
                                        <td className="p-2.5 font-mono">boolean</td>
                                        <td className="p-2.5">Indica si el modal está abierto.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">onClose</td>
                                        <td className="p-2.5 font-mono">function</td>
                                        <td className="p-2.5">Callback ejecutado para cerrar el modal.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">title</td>
                                        <td className="p-2.5 font-mono">string</td>
                                        <td className="p-2.5">Título de la cabecera.</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {activeComponent === 'background' && (
                              <div className="prose prose-invert max-w-none space-y-6">
                                <h3 className="text-xl font-bold text-zinc-100">Fondo Orgánico Respirable (BreathingBackground)</h3>
                                <p className="text-sm text-zinc-400">Este componente crea un fondo orgánico con gradientes de color que aumentan y disminuyen lentamente su escala y posición, imitando una respiración. Es ideal para fondos elegantes de fondos SaaS multitenant.</p>
                                
                                <h4 className="text-sm font-bold text-zinc-300">1. Propósito y Casos de Uso</h4>
                                <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                                  <li>Micro-interacción Orgánica: Añade dinamismo y sensación de "vida" a la interfaz sin distraer.</li>
                                  <li>Optimización Extrema: Utiliza animaciones de propiedades compuestas (`scale`, `translate3d`) aceleradas por GPU, garantizando cero reflows en el DOM.</li>
                                </ul>

                                <h4 className="text-sm font-bold text-zinc-300">2. Props y API del Componente</h4>
                                <div className="overflow-x-auto w-full border border-zinc-800 rounded-xl">
                                  <table className="min-w-full text-xs text-zinc-400">
                                    <thead>
                                      <tr className="bg-zinc-900/60 border-b border-zinc-800">
                                        <th className="p-2.5 text-left font-semibold">Prop</th>
                                        <th className="p-2.5 text-left font-semibold">Tipo</th>
                                        <th className="p-2.5 text-left font-semibold">Default</th>
                                        <th className="p-2.5 text-left font-semibold">Descripción</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/60">
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">color1</td>
                                        <td className="p-2.5 font-mono">object</td>
                                        <td className="p-2.5 font-mono">HSL</td>
                                        <td className="p-2.5">Objeto HSL del primer blob respirable.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">color2</td>
                                        <td className="p-2.5 font-mono">object</td>
                                        <td className="p-2.5 font-mono">HSL</td>
                                        <td className="p-2.5">Objeto HSL del segundo blob respirable.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">speed</td>
                                        <td className="p-2.5 font-mono">number</td>
                                        <td className="p-2.5 font-mono">10</td>
                                        <td className="p-2.5">Duración en segundos de un ciclo completo de respiración.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">blur</td>
                                        <td className="p-2.5 font-mono">number</td>
                                        <td className="p-2.5 font-mono">80</td>
                                        <td className="p-2.5">Filtro de desenfoque aplicado a los gradientes (en px).</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">opacity</td>
                                        <td className="p-2.5 font-mono">number</td>
                                        <td className="p-2.5 font-mono">0.25</td>
                                        <td className="p-2.5">Opacidad general del contenedor (0 a 1).</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2.5 font-mono text-primary">movementRange</td>
                                        <td className="p-2.5 font-mono">number</td>
                                        <td className="p-2.5 font-mono">50</td>
                                        <td className="p-2.5">Límite de translación de movimiento de los blobs (en px).</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })()
            )}
          </AnimatePresence>
        </main>

        {/* MODALS */}
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
      </div>
    </DynamicBrandingProvider>
  )
}

export default App
