# PROTOTIPE Component Catalog & Manager

Este es el catálogo local e interactivo de componentes reutilizables del ecosistema **PROTOTIPE**, diseñado especialmente para aplicaciones SaaS Multitenant de marca blanca y preparado para interactuar con agentes de Inteligencia Artificial (IA).

## 🚀 Tecnologías Principales

- **React 19** & **Vite 8**
- **Tailwind CSS v4** (Inyección de tokens dinámicos HSL)
- **Zustand 5** (Gestión de estado global y persistencia)
- **Framer Motion 12** (Animaciones aceleradas por hardware GPU)
- **React Portals** (Modales y Bottom Sheets con Tap-Shield de seguridad)

---

## 🛠️ Componentes Incluidos

1. **Inspector de Temas (Branding HSL):** Permite actualizar en tiempo real el tono, la saturación y la luminosidad primarios y secundarios, calculando la accesibilidad según los estándares WCAG AA.
2. **Generador Dinámico de Formularios (`SchemaFormGenerator`):** Renderiza formularios reactivos a partir de esquemas JSON estructurados, sin desplazamientos bruscos de pantalla (CLS = 0).
3. **Interfaz de Chat de Agente (`AgentChatInterface`):** Muestra el flujo de razonamiento y la ejecución de herramientas (`Tool Calls`) del agente inteligente, con aceleración por hardware.
4. **Reloj Digital (`DigitalClock`):** Reloj minimalista sincronizado con zona horaria del cliente.
5. **Calendario de Componentes (`ComponentCalendar`):** Visualizador interactivo mensual para rastrear fechas de publicación e hitos del catálogo.

---

## 📖 Instrucciones de Uso

Para ver el catálogo interactivo y la documentación técnica de cada componente:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Levantar el servidor local
```bash
npm run dev
```
Accede a [http://localhost:5173/](http://localhost:5173/) desde tu navegador.

### 3. Generar la build de producción
```bash
npm run build
```

---

## 📂 Documentación Técnica Completa
Para una explicación más detallada de las props, diagramas de flujo Mermaid y changelog de la biblioteca, consulta el archivo:
📄 **[DOCUMENTACION.md](file:///c:/Users/Usuario/Desktop/Proyectos%20Antigravity/Modulos%20y%20Componentes%20PROTOTIPE/DOCUMENTACION.md)**
