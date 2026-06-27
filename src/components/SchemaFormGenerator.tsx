import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SchemaProperty {
  type: 'string' | 'number' | 'boolean'
  title?: string
  description?: string
  placeholder?: string
  enum?: string[]
  minimum?: number
  maximum?: number
  default?: any
}

interface JSONSchema {
  title?: string
  description?: string
  type: string
  required?: string[]
  properties: Record<string, SchemaProperty>
}

interface SchemaFormGeneratorProps {
  schemaJson: string
  onSubmit?: (values: Record<string, any>) => void
  onChange?: (values: Record<string, any>) => void
}

export const SchemaFormGenerator: React.FC<SchemaFormGeneratorProps> = ({
  schemaJson,
  onSubmit,
  onChange,
}) => {
  const [schema, setSchema] = useState<JSONSchema | null>(null)
  const [values, setValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [parseError, setParseError] = useState<string | null>(null)

  // Parse and initialize schema
  useEffect(() => {
    try {
      const parsed = JSON.parse(schemaJson) as JSONSchema
      if (!parsed.properties || typeof parsed.properties !== 'object') {
        throw new Error('El esquema debe contener un objeto "properties".')
      }
      setSchema(parsed)
      setParseError(null)

      // Set default values
      const initialValues: Record<string, any> = {}
      Object.entries(parsed.properties).forEach(([key, prop]) => {
        if (prop.default !== undefined) {
          initialValues[key] = prop.default
        } else if (prop.type === 'boolean') {
          initialValues[key] = false
        } else if (prop.type === 'number') {
          initialValues[key] = 0
        } else {
          initialValues[key] = ''
        }
      })
      setValues(initialValues)
      if (onChange) onChange(initialValues)
    } catch (err: any) {
      setParseError(err.message || 'JSON de esquema inválido.')
      setSchema(null)
    }
  }, [schemaJson])

  const handleInputChange = (key: string, value: any, property: SchemaProperty) => {
    const updatedValues = { ...values, [key]: value }
    setValues(updatedValues)

    // Validate on change
    const updatedErrors = { ...errors }
    if (schema?.required?.includes(key) && !value && value !== 0 && value !== false) {
      updatedErrors[key] = `El campo "${property.title || key}" es obligatorio.`
    } else if (property.type === 'number') {
      const numVal = Number(value)
      if (isNaN(numVal)) {
        updatedErrors[key] = 'Debe ser un número válido.'
      } else if (property.minimum !== undefined && numVal < property.minimum) {
        updatedErrors[key] = `El valor mínimo es ${property.minimum}.`
      } else if (property.maximum !== undefined && numVal > property.maximum) {
        updatedErrors[key] = `El valor máximo es ${property.maximum}.`
      } else {
        delete updatedErrors[key]
      }
    } else {
      delete updatedErrors[key]
    }

    setErrors(updatedErrors)
    if (onChange) onChange(updatedValues)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!schema) return

    // Final validation
    const validationErrors: Record<string, string> = {}
    schema.required?.forEach((key) => {
      const val = values[key]
      if (!val && val !== 0 && val !== false) {
        validationErrors[key] = 'Este campo es obligatorio.'
      }
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (onSubmit) {
      onSubmit(values)
    }
  }

  if (parseError) {
    return (
      <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 font-mono text-sm min-h-[120px] flex items-center justify-center">
        <div>
          <span className="font-bold block text-rose-400 mb-1">Error de parsing de esquema:</span>
          {parseError}
        </div>
      </div>
    )
  }

  if (!schema) {
    return (
      <div className="flex items-center justify-center text-zinc-400 min-h-[200px]">
        Cargando esquema...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{schema.title || 'Formulario'}</h3>
        {schema.description && (
          <p className="text-sm text-zinc-400 mt-1">{schema.description}</p>
        )}
      </div>

      <div className="space-y-5">
        {Object.entries(schema.properties).map(([key, prop]) => {
          const isRequired = schema.required?.includes(key)
          const error = errors[key]

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col space-y-1.5 min-h-[85px] relative" // CLS prevention: reserved min-height for input + errors
            >
              <label className="text-sm font-medium text-zinc-300 flex items-center">
                {prop.title || key}
                {isRequired && <span className="text-primary ml-1">*</span>}
              </label>

              {prop.enum ? (
                <select
                  value={values[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value, prop)}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                >
                  {prop.enum.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : prop.type === 'boolean' ? (
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id={key}
                    checked={!!values[key]}
                    onChange={(e) => handleInputChange(key, e.target.checked, prop)}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-primary focus:ring-primary/40 focus:ring-offset-zinc-950 transition-all duration-200"
                  />
                  <label htmlFor={key} className="ml-3 text-sm text-zinc-400 cursor-pointer select-none">
                    {prop.description || 'Habilitar'}
                  </label>
                </div>
              ) : (
                <input
                  type={prop.type === 'number' ? 'number' : 'text'}
                  placeholder={prop.placeholder || ''}
                  value={values[key] !== undefined ? values[key] : ''}
                  onChange={(e) => handleInputChange(key, e.target.value, prop)}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
              )}

              {/* CLS prevention: Reserve space for absolute warning to avoid shifting rest of fields */}
              <AnimatePresence>
                {error && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute -bottom-5 left-0 text-xs text-rose-400 font-medium"
                  >
                    {error}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
      >
        Guardar Configuración
      </button>
    </form>
  )
}
