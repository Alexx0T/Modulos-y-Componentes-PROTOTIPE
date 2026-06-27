# Reloj Digital HSL (DigitalClock)

Componente de utilidad y hora en tiempo real con segundero desacoplado y consumo dinámico del branding HSL.

---

## 1. Propósito y Casos de Uso
* **Seguimiento del Tiempo:** Proporciona un visor estético de la hora en el cliente con formato de 24 horas y segundero.
* **Glow Efecto:** Usa sombras y filtros HSL dinámicos para integrarse con la marca seleccionada del tenant.
* **Casos de Uso:**
  * Bloque de control de tiempo en dashboards.
  * Tarjeta widget en paneles de administración SaaS.

---

## 2. Especificación Visual (Tailwind CSS HSL)
* **Diseño Glass:** Fondo difuminado y bordes sutiles con tipografía mono-espaciada de alta legibilidad.

---

## 3. Props y API del Componente
Este componente no recibe props y opera de forma autónoma con un intervalo de actualización de 1 segundo.

---

## 4. Código React Fuente Completo (`DigitalClock.jsx`)
```jsx
import React, { useState, useEffect } from 'react';

export const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSegment = (num) => num.toString().padStart(2, '0');

  const hours = formatSegment(time.getHours());
  const minutes = formatSegment(time.getMinutes());
  const seconds = formatSegment(time.getSeconds());

  const formattedDate = time.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6 rounded-2xl glass-premium text-center space-y-4 gpu-accelerated max-w-sm mx-auto min-h-[160px] flex flex-col justify-center">
      <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
        {formattedDate}
      </span>

      <div className="flex items-center justify-center space-x-2 font-mono text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(var(--primary-h),var(--primary-s),var(--primary-l),0.2)]">
        <span>{hours}</span>
        <span className="animate-pulse text-primary">:</span>
        <span>{minutes}</span>
        <span className="animate-pulse text-accent">:</span>
        <span className="text-2xl md:text-3xl self-end mb-1 text-zinc-400 font-semibold">{seconds}</span>
      </div>

      <div className="text-[10px] text-zinc-500 font-mono">
        ZONA HORARIA: {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </div>
    </div>
  );
};
```

---

## 5. Origen
* **Extraído de:** `src/components/DigitalClock.jsx`
* **Fecha de extracción:** 2026-06-27
* **Versión:** 1.0 (Refactorizado con HSL variables).
