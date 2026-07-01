# BreathingBackground (Fondo Orgánico Respirable)

Crea un efecto de fondo relajante mediante gradientes de color que aumentan y disminuyen lentamente su escala y posición, simulando una respiración. Diseñado específicamente para paneles SaaS multitenant premium, utilizando aceleración por GPU.

## 📖 Importación e Instanciación

```tsx
import { BreathingBackground } from './components/BreathingBackground'

const MiLayout = () => {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <BreathingBackground
        color1={{ h: 262, s: 83, l: 58 }}
        color2={{ h: 330, s: 98, l: 60 }}
        speed={12}
        blur={90}
        opacity={0.3}
        movementRange={40}
      />
      <div className="relative z-10">
        {/* Contenido de la Aplicación */}
      </div>
    </div>
  )
}
```

## ⚙️ Parámetros (Props)

- `color1` (`{ h: number, s: number, l: number }`): Color HSL del primer blob.
- `color2` (`{ h: number, s: number, l: number }`): Color HSL del segundo blob.
- `speed` (`number`): Duración en segundos de un ciclo de respiración completo (default: 10, rango: 1-60).
- `blur` (`number`): Filtro de desenfoque aplicado a los gradientes en píxeles (default: 80, rango: 0-250).
- `opacity` (`number`): Opacidad general del contenedor (default: 0.25, rango: 0-1).
- `scaleRange` (`[number, number]`): Rango de escala [mínima, máxima] para la animación (default: [0.8, 1.2]).
- `movementRange` (`number`): Rango máximo de translación de los blobs en píxeles (default: 50, rango: 0-300).
- `className` (`string`): Clases de CSS opcionales para el contenedor raíz.
- `style` (`object`): Estilos en línea opcionales para el contenedor raíz.
