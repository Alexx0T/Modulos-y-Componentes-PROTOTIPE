# DatePicker

## 1. Propósito y Casos de Uso
Componente de selección de fecha altamente personalizable extraído de PrimeReact (Headless) y adaptado a los estilos de Tailwind CSS del proyecto. Permite a los usuarios seleccionar fechas, rangos de fechas (ej. `selectionMode="range"`), o incluso elegir meses y años específicos desde un calendario flotante (`DatePickerPopup`). Es ideal para usar en formularios de agendas, paneles de configuración y filtros de búsqueda que demanden una interfaz moderna, limpia y "premium".

## 2. Especificación Visual (Tailwind CSS HSL)
- Utiliza las clases `surface` (desde `surface-0` hasta `surface-900`) para generar un contraste impecable tanto en modos claros como oscuros.
- Adapta los colores primarios (`primary`, `primary-500/10`, `primary-contrast`, `primary-emphasis`) para destacar el día actual, selecciones activas, y rangos (`data-in-range`).
- Los bordes (`rounded-md`, `rounded-full`, `rounded-lg`) suavizan la interfaz dando un estilo sofisticado, complementado con sombras (`shadow-md`) y transiciones de fluidez nativa al abrir el calendario (`transition-[opacity,scale]`).

## 3. Props y API del Componente

| Prop / Componente | Descripción |
| :--- | :--- |
| `DatePicker` | Raíz del selector de fechas. Maneja propiedades globales como `value`, `disabled`, `fluid` y `invalid`. |
| `DatePickerInput` | Campo de texto que desencadena la apertura del calendario. Acepta el prop `placeholder`. |
| `DatePickerPortal` | Traslada el calendario al final del DOM para evitar problemas de z-index y de overflow. |
| `DatePickerPositioner` | Controla la ubicación del calendario flotante (offset y posiciones) en relación con el input. |
| `DatePickerPopup` | Contenedor principal estilizado (el "globo" flotante) de la interfaz de selección. |
| `DatePickerBody` / `DatePickerPanel` | Contenedores flexibles donde recae el calendario en sí (`DatePickerCalendar`). |
| `DatePickerCalendar` | Estructura interna de navegación (encabezado, meses, años y días). |
| `DatePickerTime` | Componente adicional opcional para seleccionar horas, minutos y segundos. |

**Ejemplos de Integración (Normal y por Rango):**

```jsx
import { DatePicker, DatePickerBody, DatePickerCalendar, DatePickerInput, DatePickerPanel, DatePickerPopup, DatePickerPortal, DatePickerPositioner } from '@/components/ui/datepicker'; // o ruta relativa
import * as React from 'react';

// Uso normal
<DatePicker value={date} onValueChange={(e) => setDate(e.value)}>
    <DatePickerInput />
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

// Uso de Rango
<DatePicker value={dateRange} selectionMode="range" manualInput={false} onValueChange={(e) => setDateRange(e.value)}>
    {/* ... (Misma estructura interna) */}
</DatePicker>
```

## 4. Código React Fuente Completo (`DatePicker.jsx`)

El código ha sido refactorizado a JavaScript estándar para mantener consistencia con las reglas globales, eliminando referencias explícitas a TypeScript.

*(Ver archivo `DatePicker.jsx` adjunto en la misma carpeta para copiar el código original, el cual incluye todas las sub-partes).*

## 5. Origen
- **Origen:** Componente extraído de PrimeReact (Headless) y estilizado con Tailwind CSS.
- **Fecha de extracción:** Junio de 2026.
- **Versión:** 1.0.0
