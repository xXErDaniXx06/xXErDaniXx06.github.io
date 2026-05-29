# 🚀 Portfolio Profesional Premium — Daniel Carrasco García

<p align="center">
  <img src="https://img.shields.io/badge/Astro-v6.4.2-%23FF5D01?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v3.4.17-%2338BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-%23F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/TypeScript-v5.8-%233178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/i18n_Localization-ES%20%7C%20EN%20%7C%20FR-%234285F4?style=for-the-badge" alt="i18n Localization" />
</p>

---

## 🌟 Sobre el Proyecto

Este repositorio contiene el **portfolio profesional y académico de Daniel Carrasco García**, estudiante de **Ingeniería Informática** en la **Universidad de Málaga (UMA)**, apasionado por el desarrollo de software, los sistemas embebidos, el diseño de hardware (PCB), la radiofrecuencia (RF) y la tecnología aeroespacial.

El portfolio está diseñado bajo estándares premium de desarrollo web, combinando una interfaz visualmente deslumbrante y fluida con un código limpio, estructurado y de alto rendimiento. Además, cuenta con características avanzadas como soporte multilenguaje completo en tres idiomas, menús de accesibilidad innovadores para diversidad cognitiva y visual, y estrictos perfiles de seguridad HTTP preconfigurados.

---

## 🛠️ Stack Tecnológico

El proyecto está construido sobre tecnologías web de vanguardia:

- **Core Framework**: [Astro v6.4.2](https://astro.build/) — Framework web optimizado para la velocidad con arquitectura de islas y generación estática ultra rápida (SSG).
- **Estilos y Layout**: [Tailwind CSS v3.4.17](https://tailwindcss.com/) — Framework CSS utility-first para un control milimétrico del diseño responsivo, transiciones complejas y efectos visuales de alta gama.
- **Tipografía y Gráficos**: Google Fonts (Inter, Roboto, Outfit) y SVG vectoriales puros para máxima nitidez y rendimiento de carga.
- **Seguridad y Despliegue**: Configuración avanzada de cabeceras de seguridad HTTP (CSP, X-Frame-Options) en Netlify y Vercel. Despliegue automatizado con GitHub Actions.

---

## ⚡ Características Clave

El portfolio destaca por varias características avanzadas de diseño e ingeniería de software:

### 1. 🌐 Internacionalización Dinámica (i18n)
El sitio está completamente localizado en tres idiomas: **Español, Inglés y Francés**. 
- Todo el contenido textual está centralizado en un diccionario inteligente en `src/utils/i18n.js`.
- Las rutas están organizadas de forma limpia mediante subcarpetas (`/es/`, `/en/`, `/fr/`).
- La raíz `/` detecta y redirecciona de forma instantánea al idioma por defecto de manera eficiente.

### 2. 🎨 Estética Premium y Micro-animaciones
El diseño visual está concebido para asombrar en la primera impresión:
- Fondos oscuros profundos con gradientes suaves HSL en azul, cielo e índigo.
- "Glows" decorativos interactivos detrás de las imágenes de perfil que reaccionan al pasar el ratón.
- Efectos de **Glassmorphic UI** (bordes semi-transparentes de color blanco/10 y desenfoque `backdrop-blur`).
- Foto de perfil con morphing de enmascaramiento blob orgánico dinámico en hover (`transition-all duration-700`).

### 3. ♿ Menú de Accesibilidad Universal (a11y)
Siguiendo los principios de inclusión tecnológica, se ha implementado un menú de accesibilidad avanzado (`AccessibilityMenu.astro`) accesible desde cualquier página:
- **Modo Alto Contraste**: Inversión y realce cromático de elementos críticos para usuarios con baja visión.
- **Tamaño de Texto Ajustable**: Aumento dinámico de fuentes para lectura simplificada.
- **Fuente de Dislexia**: Opción para cambiar la tipografía global por la fuente especializada *OpenDyslexic*, facilitando la comprensión lectora.

### 4. 🔒 Configuración de Seguridad Militar (CSP)
El portfolio cuenta con configuraciones estrictas de cabeceras de respuesta HTTP aplicadas para despliegues tanto en **Netlify** (`netlify.toml`) como en **Vercel** (`vercel.json`):
- **Content-Security-Policy (CSP)** restrictivo que mitiga ataques de Cross-Site Scripting (XSS) y Clickjacking.
- Cabeceras `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` y `Referrer-Policy: strict-origin-when-cross-origin`.
- Integración segura para la carga exclusiva de recursos desde CDNs verificados, Google Fonts, Google reCAPTCHA y EmailJS.

---

## 📂 Estructura del Proyecto

La arquitectura del proyecto sigue una estructura limpia y modular de Astro:

```text
mi-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de despliegue automático a GitHub Pages
├── public/                     # Recursos estáticos (documentos, imágenes, iconos)
│   ├── docs/
│   │   └── CV_Daniel.pdf       # Curriculum Vitae descargable
│   └── images/                 # Fotografías de perfil y recursos visuales
├── src/
│   ├── components/
│   │   ├── sections/           # Secciones modulares de las páginas (Hero, Contacto, etc.)
│   │   └── ui/
│   │       ├── AccessibilityMenu.astro # Menú de accesibilidad universal
│   │       └── Navbar.astro            # Navegación premium y adaptativa
│   ├── layouts/
│   │   └── Layout.astro        # Layout base con HTML, metadatos SEO y scripts globales
│   ├── pages/
│   │   ├── en/                 # Páginas localizadas en Inglés (index, proyectos, habilidades, etc.)
│   │   ├── es/                 # Páginas localizadas en Español
│   │   ├── fr/                 # Páginas localizadas en Francés
│   │   └── index.astro         # Archivo raíz que gestiona la redirección de idioma
│   ├── styles/                 # Estilos CSS globales y variables
│   └── utils/
│       └── i18n.js             # Motor de traducciones y diccionarios centralizados
├── astro.config.mjs            # Configuración general de Astro e integración de Tailwind
├── netlify.toml                # Cabeceras de seguridad y redirecciones para Netlify
├── vercel.json                 # Cabeceras de seguridad y redirecciones para Vercel
├── tailwind.config.mjs         # Personalización de la paleta de colores y plugins de Tailwind
└── package.json                # Dependencias, scripts de construcción y metadatos
```

---

## 📌 Avisos e Información Importante

> [!NOTE]  
> **Redirección de Idioma Automatizada:**  
> Cuando un usuario accede a la raíz del sitio web (`/`), la página ejecuta una redirección instantánea hacia la versión en español (`/es/`). Astro utiliza la directiva HTML `<meta http-equiv="refresh" content="0;url=/es/" />` para asegurar la máxima compatibilidad en navegadores y buscadores sin retardar el tiempo de renderizado.

> [!IMPORTANT]  
> **Modificación de Textos y Añadir Proyectos:**  
> Todas las cadenas de texto del portfolio, incluyendo la información detallada de los proyectos, logros y competencias, se gestionan desde `src/utils/i18n.js`. Si deseas añadir un nuevo logro o proyecto, no es necesario tocar el código HTML o Astro de los componentes; simplemente actualiza los arrays `projects.list`, `skills.categories` o `achievements.list` correspondientes a cada idioma (`es`, `en`, `fr`). ¡Así mantienes la consistencia multilingüe!

> [!TIP]  
> **Añadir Nuevas Cabeceras Externas en CSP:**  
> Si integras una nueva API o un script externo (por ejemplo, Google Analytics o un nuevo proveedor de chat en vivo), debes actualizar la cabecera `Content-Security-Policy` tanto en `netlify.toml` como en `vercel.json` agregando los dominios requeridos en las directivas `script-src` y `connect-src`. De lo contrario, los navegadores bloquearán la conexión por seguridad.

> [!WARNING]  
> **Formulario de Contacto en Entorno Local:**  
> El formulario de contacto premium de `/contacto` utiliza servicios de EmailJS y protección de spam de Google reCAPTCHA v3. Para que los envíos funcionen correctamente en producción o en un entorno de desarrollo propio, asegúrate de configurar las variables de entorno asociadas y actualizar las claves del sitio en el código del formulario.

---

## 🚀 Misiones y Proyectos Destacados de Daniel

El portfolio muestra una amplia variedad de proyectos técnicos de alta complejidad:

- **🛰️ Málaga Space Team (CubeSat 1U):** Desarrollo de una plataforma de satélite experimental CubeSat 1U en la Universidad de Málaga (Mobilenet Lab). Daniel diseña la arquitectura del subsistema de RF y enlaces de comunicación LoRa, y elabora los informes de Link Budget y documentación técnica.
- **🎈 Kursaatélite (CanSat Esero & Proyecto Servet):** Investigación aeroespacial en entornos suborbitales. Diseño y construcción de una sonda que alcanzó **45.000 metros de altitud** a bordo de un globo estratosférico, implementando enlaces de telemetría de largo alcance LoRa que sobrevivieron a condiciones ambientales de −50 °C y casi-vacío. Daniel lideró el equipo de ingeniería al completo.
- **🧠 Oracle AI & Machine Learning:** Desarrollo de un modelo predictivo en Python y Scikit-Learn capaz de analizar datos de streaming y predecir el próximo éxito de verano de 2025. Galardonado con el **3er puesto nacional** en el reto de Oracle.

---

## 🏆 Logros y Reconocimientos Principales

El portfolio documenta más de **6 años de trayectoria y excelencia académica**:

- **🥈 Catch a Star (EAAE) - 2º Premio Internacional:** Premio de la Asociación Europea para la Educación en Astronomía en el año 2024.
- **🥇 Ciencia en Acción - 1er Premio Nacional:** Primer puesto a nivel nacional en las categorías de Astronomía (2023) y 2º Puesto en STEAM (2022).
- **💎 Infomatrix Iberoamérica - Medalla de Platino Internacional:** Doble Medalla de Platino en Ciencia y Tecnología (2022 y 2023) y Máximo Galardón Técnico de la competición (2021).
- **🛡️ Talent 4 Cyber - Finalista Nacional:** Puesto 12 nacional en el campeonato de ciberseguridad del Ministerio de Defensa (2025).
- **🎓 Matrícula de Honor en Bachillerato:** Máximo rendimiento académico en el IES Kursaal de Algeciras (2024).

---

## 💻 Desarrollo Local

Si deseas ejecutar o modificar este portfolio en tu máquina local, sigue estos pasos:

### 1. Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 20 o superior recomendado, el flujo de trabajo de GitHub usa Node 22).

### 2. Instalación de Dependencias
Clona el repositorio y ejecuta el siguiente comando en la raíz del proyecto para descargar todas las dependencias necesarias:
```bash
npm install --legacy-peer-deps
```

### 3. Servidor de Desarrollo
Inicia el entorno de desarrollo local. Podrás ver los cambios en tiempo real en `http://localhost:4321`:
```bash
npm run dev
```

### 4. Construcción para Producción
Para compilar la aplicación optimizada para producción (SSG) en la carpeta `/dist`:
```bash
npm run build
```

### 5. Vista Previa de Producción
Para previsualizar localmente la versión compilada:
```bash
npm run preview
```

---

## 🌐 Integración Continua y Despliegue (CI/CD)

El proyecto incluye un flujo de integración continua automatizado mediante **GitHub Actions** (`.github/workflows/deploy.yml`):
- Cada vez que se realiza un `push` a la rama `main`, la acción compila automáticamente el sitio con Astro.
- Tras verificar la compilación, despliega de forma transparente los archivos estáticos en **GitHub Pages**.
- El flujo de trabajo deshabilita la telemetría de Astro para acelerar la compilación (`ASTRO_TELEMETRY_DISABLED: 1`).

---

## 📄 Licencia

Este portfolio es de código abierto. Siéntete libre de explorar el código para aprender cómo se estructura un sitio internacionalizado y accesible con Astro 6.x.

Desarrollado con dedicación y pasión técnica por **Daniel Carrasco García**.
