import type { Dictionary } from './types';

// La descripción de la página de contacto es la misma que su texto de presentación.
const contactDescription =
  'Abierto a oportunidades en ingeniería de software, investigación aeroespacial y colaboración tecnológica.';

export const es: Dictionary = {
  languageName: 'Español',
  pages: {
    index: {
      title: 'Daniel Carrasco García | Portfolio',
      description:
        'Estudiante de Ingeniería Informática y apasionado por la tecnología aeroespacial y el desarrollo de software.',
    },
    proyectos: {
      title: 'Proyectos | Daniel Carrasco García',
      description: 'Trayectoria técnica y proyectos destacados.',
    },
    habilidades: {
      title: 'Habilidades | Daniel Carrasco García',
      description: 'Stack tecnológico y competencias técnicas.',
    },
    logros: {
      title: 'Logros | Daniel Carrasco García',
      description: 'Reconocimientos y premios obtenidos.',
    },
    contacto: {
      title: 'Contacto | Daniel Carrasco García',
      description: contactDescription,
    },
  },
  common: {
    skipToContent: 'Saltar al contenido',
    opensInNewTab: '(se abre en una pestaña nueva)',
  },
  nav: {
    pages: {
      index: 'Inicio',
      proyectos: 'Proyectos',
      habilidades: 'Habilidades',
      logros: 'Logros',
      contacto: 'Contacto',
    },
    mainLabel: 'Navegación principal',
    mobileLabel: 'Menú de navegación',
    openMenu: 'Abrir menú de navegación',
    closeMenu: 'Cerrar menú de navegación',
    cv: 'CV',
    downloadCv: 'Descargar CV de Daniel Carrasco García',
    languageLabel: 'Idioma',
  },
  home: {
    availability: 'Disponible para oportunidades',
    greeting: 'Hola, soy',
    role: 'Estudiante de Ingeniería Informática',
    roleTagline: 'Software, Hardware & Aerospace Tech',
    about:
      'Soy estudiante de Ingeniería Informática con una gran vocación por la tecnología, el desarrollo de software y el sector aeroespacial. Disfruto creando soluciones completas combinando hardware y software, desde el diseño de PCBs y enlaces de radiofrecuencia hasta el desarrollo de aplicaciones y modelos de IA. Siempre busco innovar y aportar valor técnico en cada proyecto.',
    photoAlt: 'Daniel Carrasco García',
    ctaProjects: 'Ver mis proyectos',
    ctaCv: 'Descargar CV',
    unpublished: {
      subtitle: 'Estudiante de Ingeniería Informática',
      subtitleHighlight: ' · Apasionado por la tecnología aeroespacial y el desarrollo de software',
      description:
        'Estudiante en la <strong>Universidad de Málaga (UMA)</strong> con un historial comprobado en el liderazgo de misiones suborbitales complejas y la ingeniería de enlaces de comunicación LoRa. Mi objetivo es dominar los protocolos de prueba ambiental y AIT de naves espaciales para cumplir con los más altos estándares del sector espacial europeo.',
      location: {
        title: 'Ubicación',
        city: 'Málaga / Algeciras',
        country: 'España · GMT+2',
      },
      volunteering: {
        title: 'Ingeniería con Propósito',
        description:
          'Voluntario en la Fundación <strong>"Por Una Sonrisa"</strong>, apoyando a niños y adolescentes con cáncer, uniendo la tecnología con el apoyo emocional.',
        badge: 'Voluntariado Activo',
      },
      focus: {
        title: 'Actualmente enfocado en:',
        items: [
          'Spacecraft AIT',
          'Environmental Testing',
          'PCB Prototyping',
          'RF Link Design',
          'LoRa Communications',
          'Astro Framework',
        ],
      },
      ctaBox: {
        title: 'Explorar\nMisiones y\nProyectos',
        description: 'Misiones suborbitales, CanSat, diseño RF, voluntariado y más.',
        button: 'Ver proyectos',
        ariaLabel: 'Ver todos los proyectos de Daniel Carrasco García',
      },
    },
  },
  projects: {
    tag: 'Trayectoria técnica',
    title: 'Misiones y Proyectos',
    titleHighlight: ' Destacados',
    subtitle:
      'Desde misiones CanSat a 45.000 m hasta modelos de IA y aplicaciones Full-Stack. Cada proyecto refleja un compromiso con la excelencia técnica y el impacto real.',
    statusActive: 'Activo',
    statusCompleted: 'Completado',
    present: 'Actualidad',
    longTerm: 'Enfoque a Largo Plazo',
    milestones: 'Hitos',
    tags: 'Etiquetas',
    items: {
      ksat: {
        title: 'Málaga Space Team',
        organization:
          'Universidad de Málaga, Mobilenet - Mobile & Aerospace Networks Lab (University of Málaga) & Albor Space',
        description:
          'Iniciativa principal del Málaga Space Team para desarrollar una plataforma modular <strong>1U CubeSat</strong>. Demostrador tecnológico de arquitecturas de comunicación de largo alcance y bajo consumo.',
        milestones: [
          'Arquitectura del subsistema de RF con modulación LoRa',
          'Pruebas funcionales y de verificación del sistema',
          'Análisis de Link Budget para cobertura orbital',
          'Reportes técnicos en LaTeX',
        ],
        tags: ['LoRa', 'RF', 'CubeSat', 'LaTeX'],
      },
      emprendimiento: {
        title: 'Programa Desafío Emprendedor Innovador - Málaga (II Edición)',
        organization: 'EOI & Promálaga',
        description:
          'Iniciativa impulsada por la EOI y Promálaga (Ayuntamiento de Málaga). Programa intensivo enfocado en la transformación de ideas en modelos de negocio reales y escalables dentro del ecosistema de innovación internacional de Málaga.',
        milestones: [
          'Transformación de ideas innovadoras en modelos de negocio reales',
          'Desarrollo de planes de negocio escalables',
          'Integración en el ecosistema de innovación de Málaga',
          'Formación intensiva de alto rendimiento empresarial',
        ],
        tags: ['Emprendimiento', 'Negocios', 'Innovación'],
      },
      kursaatelite: {
        title: 'Kursaatélite',
        organization: 'CanSat Esero · Proyecto Servet',
        description:
          'Programa de investigación aeroespacial en entornos suborbitales. Desde la competición CanSat Esero hasta el <strong>Proyecto Servet</strong>, alcanzando <strong>45.000 metros</strong> en globo estratosférico.',
        milestones: [
          'Único líder de ingeniería del equipo multidisciplinar',
          'Enlace de comunicación Near-Space (telemetría LoRa en tiempo real)',
          'Supervivencia ambiental: −50 °C y condiciones de casi-vacío',
          'Análisis de datos posvuelo y documentación técnica',
        ],
        tags: ['Hardware', 'Telemetría', 'CanSat', 'Data Analysis'],
      },
      kursaalmars: {
        title: 'KursaalMars',
        organization: 'Investigación Espacial',
        description:
          'Investigación sobre habitabilidad marciana. Diseño estructural de módulos de vida, automatización de sistemas de soporte vital y análisis de radiación y condiciones ambientales extremas.',
        milestones: [
          'Diseño estructural de módulos habitacionales',
          'Automatización de sistemas de soporte vital',
          'Análisis de radiación y ambiental marciano',
        ],
        tags: ['Automation', 'Space Research', 'Biology'],
      },
      oracle: {
        title: 'Oracle AI & Full-Stack',
        organization: 'Proyectos Software',
        description:
          'Modelo de IA para predecir éxitos musicales (<strong>Oracle Summer Hit Song 2025</strong>) con Python y ML. Desarrollo Full-Stack de sistema de gestión de viviendas compartidas con Firebase y autenticación en tiempo real.',
        milestones: [
          'Modelo ML de predicción de hits musicales (Python, scikit-learn)',
          'Sistema de gestión de viviendas con Firebase',
          'Autenticación y base de datos en tiempo real',
        ],
        tags: ['Python', 'AI / ML', 'Firebase', 'Full-Stack'],
      },
      porunasonrisa: {
        title: 'Por Una Sonrisa',
        organization: 'Iniciativa Solidaria',
        description:
          'Iniciativa solidaria dedicada a <strong>decorar satélites</strong> bajo el lema <em>“Llevamos la esperanza a las estrellas”</em>, para motivar a niños y niñas pacientes de cáncer.',
        milestones: [
          'Decoración de satélites experimentales con mensajes de esperanza',
          'Organización de exposiciones itinerantes para concienciación',
          'Recogida de premios simbólicos utilizando narices de payaso',
        ],
        tags: ['Decoración', 'Voluntariado'],
      },
      sensordeco2: {
        title: 'Sensor de CO₂',
        organization: 'Calidad del Aire · IES Kursaal',
        description:
          'Sistema IoT de monitorización de calidad del aire en tiempo real para aulas escolares, desarrollado como medida preventiva de ventilación durante la pandemia.',
        milestones: [
          'Integración de sensor MH-Z19B (NDIR) y pantalla OLED SSD1306',
          'Microcontrolador ESP8266 (NodeMCU) y transmisión a ThingSpeak',
          'Análisis de datos reales de ventilación escolar',
        ],
        tags: ['ESP8266', 'ThingSpeak', 'OLED'],
      },
      smartdoor: {
        title: 'SmartDoor',
        organization: 'Eficiencia Antártica · IES Kursaal',
        description:
          'Diseño estructural y automatización de una vivienda energéticamente eficiente adaptada a las condiciones extremas de la Antártida.',
        milestones: [
          'Sistema de entrada inteligente que minimiza la pérdida de calor',
          'Análisis de comportamiento térmico y estructural esférico',
          'Reducción de consumo energético y huella ambiental de generadores',
        ],
        tags: ['Antártida', 'Eficiencia'],
      },
      dustnet: {
        title: 'DustNet',
        organization: 'Calidad del Aire · IES Kursaal',
        description:
          'Proyecto de monitorización de partículas finas en suspensión utilizando redes inalámbricas de sensores de bajo coste.',
        milestones: [
          'Uso de tecnología inalámbrica de largo alcance (LoRaWAN)',
          'Monitorización en tiempo real de concentraciones PM10 y PM2.5',
          'Transmisión de datos ambientales a plataforma en la nube',
        ],
        tags: ['LoRaWAN', 'PM2.5'],
      },
      futuro: {
        title: 'Proyectos a Futuro',
        organization: 'Aspiraciones de Ingeniería',
        description:
          'Visión de desarrollo e investigación en el ámbito de las finanzas cuantitativas, computación cuántica y sostenibilidad.',
        milestones: [
          'Algoritmos de Trading Cuantitativo e Inteligencia Artificial',
          'Computación Cuántica y Criptografía avanzada',
          'Contribución a proyectos de IoT y código abierto sostenibles',
        ],
        tags: ['IA / ML', 'Trading', 'Quantum'],
      },
    },
  },
  skills: {
    tag: 'Competencias técnicas',
    title: 'Stack',
    titleHighlight: ' Tecnológico',
    subtitle:
      'Combinación de habilidades en software, hardware aeroespacial y comunicaciones RF aplicadas en proyectos reales.',
    categories: {
      programming: {
        title: 'Programación',
        description: 'Lenguajes de alto y bajo nivel para sistemas embebidos y computación científica.',
        skills: [
          {
            name: 'Python',
            note: 'IA, Data Analysis, Scripts',
          },
          {
            name: 'C++',
            note: 'Microcontroladores, OOP',
          },
          {
            name: 'C',
            note: 'Sistemas de bajo nivel',
          },
          {
            name: 'Java',
            note: 'POO, Backend',
          },
          {
            name: 'RISC-V',
            note: 'Arquitectura abierta',
          },
          {
            name: 'Assembly',
            note: 'Programación de bajo nivel',
          },
          {
            name: 'Bash',
            note: 'Scripting y automatización',
          },
        ],
      },
      'rf-embedded': {
        title: 'Comunicaciones, RF y Embebidos',
        description: 'Especialización en comunicaciones de largo alcance y protocolos aeroespaciales.',
        skills: [
          {
            name: 'LoRa / LoRaWAN',
            note: 'Telemetría Near-Space',
          },
          {
            name: 'RF Link Design',
            note: 'Diseño de enlace RF',
          },
          {
            name: 'Link Budget Analysis',
            note: 'Análisis potencia y SNR',
          },
          {
            name: 'I²C / SPI / UART',
            note: 'Protocolos embebidos',
          },
          {
            name: 'PCB Prototyping',
            note: 'KiCad, diseño de placas',
          },
          {
            name: 'Microcontroller Arch.',
            note: 'AVR, ARM Cortex',
          },
        ],
      },
      tools: {
        title: 'Herramientas y Entornos',
        description: 'Suite de herramientas para documentación, diseño electrónico y procesado de señales.',
        skills: [
          {
            name: 'LaTeX',
            note: 'Documentación y reportes técnicos',
          },
          {
            name: 'KiCad',
            note: 'Diseño de PCBs y esquemáticos',
          },
          {
            name: 'GNU Radio',
            note: 'Procesado de señales SDR',
          },
          {
            name: 'Arduino IDE',
            note: 'Prototipado embebido',
          },
          {
            name: 'VS Code',
            note: 'Entorno principal de desarrollo',
          },
          {
            name: 'Git / GitHub',
            note: 'Control de versiones',
          },
          {
            name: 'Firebase',
            note: 'Backend as a Service',
          },
        ],
      },
      languages: {
        title: 'Idiomas',
        description: 'Competencia lingüística para entornos científicos y técnicos internacionales.',
        skills: [
          {
            name: 'Español',
            note: 'Lengua materna',
          },
          {
            name: 'Inglés',
            note: 'C1 — Comprensión y producción avanzada',
          },
          {
            name: 'Francés',
            note: 'A2 — Usuario básico',
          },
        ],
      },
    },
  },
  achievements: {
    tag: 'Reconocimientos',
    title: 'Premios y Reconocimientos',
    subtitle:
      'reconocimientos en más de 6 años: competiciones internacionales, hackathons, investigación aeroespacial e inteligencia artificial.',
    footer: 'reconocimientos · Local, Nacional e Internacional',
    scopes: {
      international: 'Internacional',
      national: 'Nacional',
      regional: 'Regional',
      local: 'Local',
      academic: 'Académico',
      university: 'Universitario',
      institutional: 'Institucional',
    },
    items: {
      'eoi-entrepreneur-program': {
        organization: 'EOI & Promálaga',
        prize: 'Graduado',
        title: 'Programa Desafío Emprendedor Innovador - Málaga (II Edición)',
        description:
          'Graduación en el programa intensivo enfocado en la transformación de ideas en modelos de negocio reales y escalables dentro del ecosistema de innovación de Málaga, impulsado por la EOI y Promálaga.',
      },
      'talent-4-cyber': {
        organization: 'Ministerio de Defensa',
        prize: 'Finalista · Puesto 12 Nacional',
        title: 'Talent 4 Cyber 2025',
        description:
          'Finalista en el campeonato nacional de ciberseguridad organizado por el Ministerio de Defensa. Puesto 12 de España junto a su equipo.',
      },
      'malackaton-2025': {
        organization: 'Universidad de Málaga',
        prize: 'Finalista',
        title: 'Malackaton 2025',
        description: 'Finalista en el hackathon anual de la Universidad de Málaga.',
      },
      'crypto-trading-hackathon': {
        organization: 'La Térmica · Málaga',
        prize: 'Participante',
        title: 'Hackathon Crypto Trading',
        description:
          'Desarrollo de estrategias de trading algorítmico en el hackathon celebrado en La Térmica, Málaga.',
      },
      'malaga-space-team': {
        organization: 'Universidad de Málaga',
        prize: 'Miembro activo',
        title: 'Málaga Space Team – División de Comunicaciones',
        description:
          'Incorporación al equipo de la UMA dedicado al diseño y construcción de satélites. Responsable de comunicaciones y divulgación.',
      },
      'init-g': {
        organization: 'Init.g',
        prize: 'Participante',
        title: 'Participación en Init.g 2025',
        description: 'Participación en el evento tecnológico Init.g 2025.',
      },
      'oracle-summer-hit-song': {
        organization: 'Oracle',
        prize: '3er Premio',
        title: 'Oracle Challenge "Summer Hit Song 2025"',
        description:
          'Tercer premio en el "Reto Enseña" de Oracle. Desarrollo de una IA capaz de analizar canciones y predecir el próximo éxito del verano, basándose en patrones y tendencias musicales con Python y Machine Learning.',
      },
      'honors-degree': {
        organization: 'IES Kursaal · Algeciras',
        prize: 'Matrícula de Honor',
        title: 'Matrícula de Honor en Bachillerato',
        description:
          'Reconocimiento a la excelencia académica durante todo el bachillerato, obteniendo las máximas calificaciones en el IES Kursaal de Algeciras.',
      },
      'catch-a-star': {
        organization: 'Unión Europea · EAAE',
        prize: '2º Premio Internacional',
        title: 'Catch a Star (EAAE)',
        description:
          'Reconocimiento internacional en astronomía otorgado por la Asociación Europea para la Educación en Astronomía (European Association for Astronomy Education).',
      },
      'malackaton-2024': {
        organization: 'Universidad de Málaga',
        prize: 'Mejor equipo de 1er año',
        title: 'Malackaton 2024 – Mejor Equipo de Primer Año',
        description: 'Reconocimiento como el mejor equipo de primer año en el hackathon de la Universidad de Málaga.',
      },
      'cambridge-c1': {
        organization: 'Cambridge Assessment English',
        prize: 'Certificado con Mérito',
        title: 'Certificado C1 de Cambridge (Advanced)',
        description:
          'Obtenido con mérito, demostrando un nivel C1 avanzado de inglés (comprensión lectora, auditiva, expresión escrita y oral).',
      },
      diverciencia: {
        organization: 'Feria Diverciencia',
        prize: '1er Premio',
        title: 'Primer Premio en Diverciencia',
        description:
          'Máximo reconocimiento en la feria de ciencia por el desarrollo de proyectos innovadores de impacto social.',
      },
      'ciencia-en-accion-astronomy': {
        organization: 'Ministerio de Ciencia, Innovación y Universidades',
        prize: '1er Premio Nacional',
        title: 'Astronomía "Ciencia en Acción"',
        description:
          'Primer puesto nacional por investigación innovadora en astronomía. Máximo reconocimiento de la categoría a nivel de España.',
      },
      'open-science-cambre': {
        organization: 'IES David Buján',
        prize: 'Triple Ganador',
        title: 'Open Science Cambre – Triple Corona',
        description: 'Ganador de tres primeros premios en distintas categorías de la feria de ciencia abierta.',
      },
      'cadiz-programming-champion': {
        organization: 'Provincia de Cádiz',
        prize: '1er Premio Provincial',
        title: 'Campeón de Programación Sub-18 de Cádiz',
        description: 'Primer puesto en la competición provincial de programación para menores de 18 años.',
      },
      'cadiz-research-award': {
        organization: 'Diputación de Cádiz',
        prize: '1er Premio',
        title: 'Premio en Investigación Científica de Cádiz',
        description: 'Reconocimiento provincial a la excelencia investigadora.',
      },
      'infomatrix-2023': {
        organization: 'SOLACYT',
        prize: 'Medalla de Platino',
        title: 'Infomatrix Iberoamérica – Platino Internacional (Tecnología)',
        description: 'Máximo galardón en la final iberoamericana por innovación y excelencia técnica.',
      },
      'cansat-esero': {
        organization: 'ESA / ESERO',
        prize: 'Doble participación',
        title: 'CanSat Esero – Proyecto Kursaatélite',
        description:
          'Doble participación en el proyecto europeo de satélites experimentales CanSat (European Space Education Resource Office). Líder único de ingeniería.',
      },
      'servet-balloons': {
        organization: 'Proyecto Servet',
        prize: 'Doble lanzamiento',
        title: 'Proyecto Servet – Globos Sonda Estratosféricos',
        description:
          'Participación en dos lanzamientos de globos sonda alcanzando 35 km de altitud. Telemetría LoRa en tiempo real y análisis de datos posvuelo.',
      },
      'ciencia-en-accion-steam': {
        organization: 'Ministerio de Ciencia, Innovación y Universidades',
        prize: '2º Premio Nacional',
        title: 'STEAM "Ciencia en Acción"',
        description:
          'Segundo puesto nacional en la categoría STEAM, por proyecto interdisciplinar que integra Ciencia, Tecnología, Ingeniería, Arte y Matemáticas.',
      },
      'infomatrix-2022': {
        organization: 'SOLACYT',
        prize: 'Medalla de Platino',
        title: 'Infomatrix Iberoamérica – Platino Internacional (Ciencia)',
        description: 'Máximo reconocimiento en la final iberoamericana de proyectos de investigación científica.',
      },
      'infomatrix-2021': {
        organization: 'SOLACYT',
        prize: 'Medalla de Platino Internacional',
        title: 'Infomatrix Iberoamérica – Máximo Galardón Técnico',
        description:
          'Máximo galardón técnico de la competición iberoamericana, reconociendo la excelencia absoluta en desarrollo tecnológico.',
      },
      'cepsa-foundation': {
        organization: 'Fundación Cepsa',
        prize: '1er Premio',
        title: 'Primer Premio Fundación Cepsa',
        description: 'Reconocimiento al mejor proyecto de la comarca del Campo de Gibraltar.',
      },
      'uca-scholarship': {
        organization: 'Universidad de Cádiz (UCA)',
        prize: 'Beca de Excelencia',
        title: 'UCA Excellence Scholarship',
        description:
          'Participación en el programa de verano para estudiantes destacados. Otorgada por el potencial académico y técnico demostrado.',
      },
      'uex-science-fair': {
        organization: 'Universidad de Extremadura (UEX)',
        prize: '1er Premio',
        title: 'Ganador Feria de Ciencias UEX',
        description: 'Primer premio en la II Feria de Ciencias de la Universidad de Extremadura.',
      },
      'algeciras-young-researchers': {
        organization: 'Ayuntamiento de Algeciras',
        prize: '6 Primeros Premios',
        title: 'Premios Jóvenes Investigadores Algeciras',
        description:
          'Ganador de seis primeros premios en distintas ediciones del certamen municipal de jóvenes investigadores.',
      },
    },
  },
  contact: {
    tag: 'Disponible para nuevas oportunidades',
    title: 'Contacto',
    info: {
      title: '¿Hablamos?',
      description: contactDescription,
      channels: 'Medios de contacto',
      personalEmail: 'Email personal',
      umaEmail: 'Email UMA',
      phone: 'Teléfono',
      downloadCv: 'Descargar CV completo (PDF)',
      meetings: 'Reuniones: Lunes–Viernes · 17:00–20:00 GMT+2',
      languages: 'Español (Nativo) · Inglés C1 · Francés A2',
    },
    form: {
      title: 'Envíame un mensaje',
      name: 'Nombre',
      email: 'Email',
      subject: 'Asunto',
      message: 'Mensaje',
      required: 'Todos los campos son obligatorios.',
      placeholderName: 'Tu nombre completo',
      placeholderEmail: 'tu@email.com',
      placeholderSubject: '¿De qué quieres hablar?',
      placeholderMessage: 'Cuéntame tu propuesta, proyecto o simplemente saluda...',
      submit: 'Enviar mensaje',
      sending: 'Enviando…',
      notice:
        'Protegido por Cloudflare Turnstile. Se aplica la <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Política de privacidad de Turnstile</a>.',
      success: '¡Mensaje enviado! Te responderé lo antes posible.',
      errors: {
        required: 'Por favor, complete todos los campos requeridos.',
        invalidEmail: 'Introduce un email válido.',
        tooLong: 'Algún campo supera la longitud máxima.',
        rateLimit: 'Por favor, espere un minuto entre mensajes.',
        hourlyLimit: 'Ha excedido el límite de mensajes por hora.',
        dailyLimit: 'Se ha alcanzado el límite diario de mensajes. Escríbeme directamente por email.',
        verification: 'No se pudo verificar que eres una persona. Inténtalo de nuevo.',
        sending: 'Error al enviar. Por favor, inténtalo de nuevo.',
      },
    },
  },
  preferences: {
    open: 'Abrir menú de accesibilidad',
    title: 'Accesibilidad',
    close: 'Cerrar',
    theme: 'Tema',
    themes: {
      system: 'Automático',
      light: 'Claro',
      dark: 'Oscuro',
    },
    textSize: 'Tamaño de texto',
    textSizes: {
      small: 'Reducir tamaño de texto',
      normal: 'Tamaño de texto normal',
      large: 'Aumentar tamaño de texto',
    },
    contrast: 'Alto contraste',
    colorFilter: 'Modo daltonismo',
    colorFilters: {
      none: 'Ninguno',
      protanopia: 'Protanopia',
      deuteranopia: 'Deuteranopia',
      tritanopia: 'Tritanopia',
    },
    reset: 'Restablecer todo',
  },
  footer: {
    contact: 'Contacto',
    sections: 'Secciones',
    agents: 'Para agentes de IA',
    agentsDescription: 'El contenido también está disponible en Markdown, JSON y MCP.',
    source: 'Código fuente',
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o ha cambiado de dirección.',
    backHome: 'Volver al inicio',
  },
  markdown: {
    organization: 'Organización',
    status: 'Estado',
    period: 'Periodo',
    milestones: 'Hitos',
    tags: 'Etiquetas',
    video: 'Vídeo',
    date: 'Fecha',
    scope: 'Ámbito',
    issuer: 'Organismo',
    award: 'Premio',
    navigation: 'Navegación',
    otherLanguages: 'Otros idiomas',
    htmlVersion: 'Versión HTML de esta página',
    formFields: 'Campos del formulario (todos obligatorios)',
    agentsTitle: 'Para agentes de IA',
    agentsContact:
      'Un agente puede enviar este formulario con la herramienta WebMCP `send_contact_message` de esta página, o usar la herramienta del mismo nombre del servidor MCP del porfolio (requiere autorización OAuth; ver /auth.md). Confirma siempre el contenido con la persona antes de enviar.',
    agentResources: 'Recursos para agentes',
  },
  consent: {
    title: 'Autorizar acceso',
    heading: '{client} quiere conectarse al porfolio de Daniel Carrasco García',
    verified: 'Publicado por <strong>{domain}</strong>.',
    unverified: 'Esta aplicación se registró sola: su nombre no está verificado.',
    redirect: 'El acceso se enviará a <strong>{host}</strong>.',
    loopback:
      'El acceso irá a una aplicación de tu ordenador. Continúa solo si acabas de iniciar la conexión desde ella.',
    permissions: 'Permisos',
    scopes: {
      read: 'Leer la información pública del porfolio: perfil, proyectos, habilidades, logros y contacto.',
      contact: 'Enviar mensajes a Daniel en tu nombre (máximo 3 por hora).',
      offlineAccess: 'Mantener el acceso sin volver a preguntarte durante 30 días.',
    },
    anonymous: 'No necesitas cuenta: el acceso es anónimo y puedes revocarlo desde tu cliente.',
    allow: 'Permitir',
    deny: 'Denegar',
    captchaFailed: 'No se pudo verificar que eres una persona. Inténtalo de nuevo.',
    notConfigured: 'La autorización no está disponible ahora mismo.',
    expired: 'Esta solicitud ha caducado o ya se usó. Vuelve a conectar desde tu aplicación.',
    invalidClient: 'No se pudo verificar la aplicación que solicita el acceso.',
  },
};
