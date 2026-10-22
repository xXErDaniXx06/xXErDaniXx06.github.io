import type { Dictionary } from './types';

// La descripción de la página de contacto es la misma que su texto de presentación.
const contactDescription =
  'Open to opportunities in software engineering, aerospace research, and technical collaboration.';

export const en: Dictionary = {
  languageName: 'English',
  pages: {
    index: {
      title: 'Daniel Carrasco García | Portfolio',
      description: 'Computer Engineering student and passionate about aerospace technology and software development.',
    },
    proyectos: {
      title: 'Projects | Daniel Carrasco García',
      description: 'Technical journey and featured projects.',
    },
    habilidades: {
      title: 'Skills | Daniel Carrasco García',
      description: 'Technical stack and technical competencies.',
    },
    logros: {
      title: 'Achievements | Daniel Carrasco García',
      description: 'Awards and recognitions obtained.',
    },
    contacto: {
      title: 'Contact | Daniel Carrasco García',
      description: contactDescription,
    },
  },
  common: {
    skipToContent: 'Skip to content',
    opensInNewTab: '(opens in a new tab)',
  },
  nav: {
    pages: {
      index: 'Home',
      proyectos: 'Projects',
      habilidades: 'Skills',
      logros: 'Achievements',
      contacto: 'Contact',
    },
    mainLabel: 'Main navigation',
    mobileLabel: 'Navigation menu',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    cv: 'Resume',
    downloadCv: "Download Daniel Carrasco García's Resume",
    languageLabel: 'Language',
  },
  home: {
    availability: 'Available for opportunities',
    greeting: "Hi, I'm",
    role: 'Computer Engineering Student',
    roleTagline: 'Software, Hardware & Aerospace Tech',
    about:
      "I'm Daniel Carrasco García, a Computer Engineering student at the University of Málaga, with a deep passion for technology, software development, and the aerospace sector. I enjoy building practical and innovative solutions by combining hardware and software, from PCB design and RF links to full-stack applications and AI models.",
    photoAlt: 'Daniel Carrasco García',
    ctaProjects: 'View my projects',
    ctaCv: 'Download Resume',
    unpublished: {
      subtitle: 'Computer Engineering Student',
      subtitleHighlight: ' · Passionate about aerospace technology and software development',
      description:
        'Computer Engineering student at the <strong>University of Málaga (UMA)</strong> with a proven track record in leading complex suborbital missions and engineering LoRa communication links. My goal is to master spacecraft environmental testing and AIT protocols to meet the highest standards of the European space sector.',
      location: {
        title: 'Location',
        city: 'Málaga / Algeciras',
        country: 'Spain · GMT+2',
      },
      volunteering: {
        title: 'Purpose-Driven Engineering',
        description:
          'Volunteer at the <strong>"Por Una Sonrisa"</strong> Foundation, supporting children and teenagers with cancer, bridging technology with emotional support.',
        badge: 'Active Volunteering',
      },
      focus: {
        title: 'Currently focused on:',
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
        title: 'Explore\nMissions &\nProjects',
        description: 'Suborbital missions, CanSat, RF design, volunteering, and more.',
        button: 'View projects',
        ariaLabel: 'View all projects by Daniel Carrasco García',
      },
    },
  },
  projects: {
    tag: 'Technical Journey',
    title: 'Missions & Featured',
    titleHighlight: ' Projects',
    subtitle:
      'From suborbital CanSat missions at 45,000 meters to AI models and Full-Stack applications. Each project reflects a commitment to technical excellence and real-world impact.',
    statusActive: 'Active',
    statusCompleted: 'Completed',
    present: 'Present',
    longTerm: 'Long-term Focus',
    milestones: 'Milestones',
    tags: 'Tags',
    items: {
      ksat: {
        title: 'Málaga Space Team',
        organization:
          'Universidad de Málaga, Mobilenet - Mobile & Aerospace Networks Lab (University of Málaga) & Albor Space',
        description:
          'Main initiative of the Málaga Space Team to develop a modular <strong>1U CubeSat</strong> platform. Technology demonstrator for long-range, low-power communication architectures.',
        milestones: [
          'RF subsystem architecture utilizing LoRa modulation',
          'System functional testing and verification',
          'Link Budget analysis for orbital coverage',
          'Technical reporting in LaTeX',
        ],
        tags: ['LoRa', 'RF', 'CubeSat', 'LaTeX'],
      },
      emprendimiento: {
        title: 'Innovative Entrepreneur Challenge Program - Málaga (II Edition)',
        organization: 'EOI & Promálaga',
        description:
          "Initiative promoted by EOI and Promálaga (Málaga City Council). Intensive program focused on transforming ideas into real and scalable business models within Málaga's international innovation ecosystem.",
        milestones: [
          'Transforming innovative ideas into viable business models',
          'Developing scalable business plans',
          "Integration into Málaga's international innovation ecosystem",
          'Intensive high-performance business training',
        ],
        tags: ['Entrepreneurship', 'Business', 'Innovation'],
      },
      kursaatelite: {
        title: 'Kursaatélite',
        organization: 'CanSat Esero · Servet Project',
        description:
          'Aerospace research program in suborbital environments. From the CanSat Esero competition to the <strong>Servet Project</strong>, reaching <strong>45,000 meters</strong> in a stratospheric balloon.',
        milestones: [
          'Sole engineering leader of the multidisciplinary team',
          'Near-Space communication link (real-time LoRa telemetry)',
          'Environmental survival: −50 °C and near-vacuum conditions',
          'Post-flight data analysis and technical documentation',
        ],
        tags: ['Hardware', 'Telemetry', 'CanSat', 'Data Analysis'],
      },
      kursaalmars: {
        title: 'KursaalMars',
        organization: 'Space Research',
        description:
          'Research on Martian habitability. Structural design of housing modules, automation of life support systems, and analysis of radiation and extreme environmental conditions.',
        milestones: [
          'Structural design of habitat modules',
          'Automation of life support systems',
          'Martian radiation and environmental analysis',
        ],
        tags: ['Automation', 'Space Research', 'Biology'],
      },
      oracle: {
        title: 'Oracle AI & Full-Stack',
        organization: 'Software Projects',
        description:
          'AI model to predict musical hits (<strong>Oracle Summer Hit Song 2025</strong>) utilizing Python and Machine Learning. Full-Stack development of a shared housing management system with Firebase and real-time authentication.',
        milestones: [
          'ML hit prediction model (Python, scikit-learn)',
          'Shared housing management system with Firebase',
          'Real-time authentication and database integration',
        ],
        tags: ['Python', 'AI / ML', 'Firebase', 'Full-Stack'],
      },
      porunasonrisa: {
        title: 'Por Una Sonrisa',
        organization: 'Solidarity Initiative',
        description:
          'Solidarity initiative dedicated to <strong>decorating satellites</strong> with the motto <em>“We bring hope to the stars”</em>, to motivate children with cancer.',
        milestones: [
          'Decorating experimental satellites with messages of hope',
          'Organizing traveling exhibitions for social awareness',
          'Collecting symbolic awards using clown noses as a symbol',
        ],
        tags: ['Decorating', 'Volunteering'],
      },
      sensordeco2: {
        title: 'CO₂ Sensor',
        organization: 'Air Quality · IES Kursaal',
        description:
          'IoT real-time air quality monitoring system for classrooms, developed as a preventive ventilation check during the COVID-19 pandemic.',
        milestones: [
          'MH-Z19B (NDIR) sensor and SSD1306 OLED screen integration',
          'ESP8266 microcontroller (NodeMCU) and ThingSpeak transmission',
          'Analysis of real-world classroom ventilation data',
        ],
        tags: ['ESP8266', 'ThingSpeak', 'OLED'],
      },
      smartdoor: {
        title: 'SmartDoor',
        organization: 'Antarctic Efficiency · IES Kursaal',
        description:
          'Structural design and automation of an energy-efficient home adapted to the extreme conditions of Antarctica.',
        milestones: [
          'Smart entry system designed to minimize base heat loss',
          'Analysis of thermal behavior and spherical structural physics',
          'Reduction of generator fuel consumption and carbon footprint',
        ],
        tags: ['Antarctica', 'Efficiency'],
      },
      dustnet: {
        title: 'DustNet',
        organization: 'Air Quality · IES Kursaal',
        description:
          'Pioneering project for monitoring suspended particulate matter using low-cost wireless sensor networks.',
        milestones: [
          'Utilization of long-range low-power technology (LoRaWAN)',
          'Real-time monitoring of PM10 and PM2.5 concentrations',
          'Environmental data transmission to a cloud analysis platform',
        ],
        tags: ['LoRaWAN', 'PM2.5'],
      },
      futuro: {
        title: 'Future Projects',
        organization: 'Engineering Aspirations',
        description:
          'Aspirational vision for research and development in quantitative finance, quantum computing, and sustainability.',
        milestones: [
          'Quantitative trading algorithms and Artificial Intelligence',
          'Quantum Computing and advanced cryptography',
          'Contributions to open-source IoT and sustainability systems',
        ],
        tags: ['AI / ML', 'Trading', 'Quantum'],
      },
    },
  },
  skills: {
    tag: 'Technical Competencies',
    title: 'Technical',
    titleHighlight: ' Stack',
    subtitle:
      'A combination of software development, aerospace hardware engineering, and RF communications applied to real-world projects.',
    categories: {
      programming: {
        title: 'Programming',
        description: 'High and low-level languages for embedded systems and scientific computing.',
        skills: [
          {
            name: 'Python',
            note: 'AI, Data Analysis, Scripts',
          },
          {
            name: 'C++',
            note: 'Microcontrollers, OOP',
          },
          {
            name: 'C',
            note: 'Low-level systems',
          },
          {
            name: 'Java',
            note: 'OOP, Backend',
          },
          {
            name: 'RISC-V',
            note: 'Open architecture',
          },
          {
            name: 'Assembly',
            note: 'Low-level programming',
          },
          {
            name: 'Bash',
            note: 'Scripting and automation',
          },
        ],
      },
      'rf-embedded': {
        title: 'Communications, RF & Embedded',
        description: 'Specialization in long-range communications and aerospace protocols.',
        skills: [
          {
            name: 'LoRa / LoRaWAN',
            note: 'Near-Space Telemetry',
          },
          {
            name: 'RF Link Design',
            note: 'RF link design',
          },
          {
            name: 'Link Budget Analysis',
            note: 'Power and SNR analysis',
          },
          {
            name: 'I²C / SPI / UART',
            note: 'Embedded protocols',
          },
          {
            name: 'PCB Prototyping',
            note: 'KiCad, board design',
          },
          {
            name: 'Microcontroller Arch.',
            note: 'AVR, ARM Cortex',
          },
        ],
      },
      tools: {
        title: 'Tools & Environments',
        description: 'Suite of tools for documentation, electronic design, and signal processing.',
        skills: [
          {
            name: 'LaTeX',
            note: 'Technical documentation and reports',
          },
          {
            name: 'KiCad',
            note: 'PCB design and schematics',
          },
          {
            name: 'GNU Radio',
            note: 'SDR signal processing',
          },
          {
            name: 'Arduino IDE',
            note: 'Embedded prototyping',
          },
          {
            name: 'VS Code',
            note: 'Main development environment',
          },
          {
            name: 'Git / GitHub',
            note: 'Version control',
          },
          {
            name: 'Firebase',
            note: 'Backend as a Service',
          },
        ],
      },
      languages: {
        title: 'Languages',
        description: 'Linguistic competence for international scientific and technical environments.',
        skills: [
          {
            name: 'Spanish',
            note: 'Native speaker',
          },
          {
            name: 'English',
            note: 'C1 — Advanced comprehension and writing',
          },
          {
            name: 'French',
            note: 'A2 — Basic user',
          },
        ],
      },
    },
  },
  achievements: {
    tag: 'Recognitions',
    title: 'Awards & Recognitions',
    subtitle:
      'achievements over 6 years: international competitions, hackathons, aerospace research, and artificial intelligence.',
    footer: 'recognitions · Local, National & International',
    scopes: {
      international: 'International',
      national: 'National',
      regional: 'Regional',
      local: 'Local',
      academic: 'Academic',
      university: 'University',
      institutional: 'Institutional',
    },
    items: {
      'eoi-entrepreneur-program': {
        organization: 'EOI & Promálaga',
        prize: 'Graduate',
        title: 'Innovative Entrepreneur Challenge Program - Málaga (II Edition)',
        description:
          "Graduation from the intensive program focused on transforming ideas into real and scalable business models within Málaga's innovation ecosystem, promoted by EOI and Promálaga.",
      },
      'talent-4-cyber': {
        organization: 'Ministry of Defense',
        prize: 'Finalist · 12th Place Nationally',
        title: 'Talent 4 Cyber 2025',
        description:
          'Finalist in the national cybersecurity championship organized by the Ministry of Defense. Placed 12th in Spain alongside my team.',
      },
      'malackaton-2025': {
        organization: 'University of Málaga',
        prize: 'Finalist',
        title: 'Malackaton 2025',
        description: 'Finalist in the annual hackathon of the University of Málaga.',
      },
      'crypto-trading-hackathon': {
        organization: 'La Térmica · Málaga',
        prize: 'Participant',
        title: 'Crypto Trading Hackathon',
        description:
          'Development of algorithmic crypto trading strategies in the hackathon held at La Térmica, Málaga.',
      },
      'malaga-space-team': {
        organization: 'University of Málaga',
        prize: 'Active Member',
        title: 'Málaga Space Team – Communications Division',
        description:
          'Joined the University of Málaga satellite design and construction team, serving in communications and outreach roles.',
      },
      'init-g': {
        organization: 'Init.g',
        prize: 'Participant',
        title: 'Init.g 2025 Participation',
        description: 'Participated in the Init.g 2025 technology event.',
      },
      'oracle-summer-hit-song': {
        organization: 'Oracle',
        prize: '3rd Prize',
        title: 'Oracle Challenge "Summer Hit Song 2025"',
        description:
          'Third prize in Oracle\'s "Reto Enseña". Development of an AI model to predict the next summer hit song based on musical patterns and trends utilizing Python and Machine Learning.',
      },
      'honors-degree': {
        organization: 'IES Kursaal · Algeciras',
        prize: 'Honors Degree',
        title: 'High School Honors Degree',
        description:
          'Recognition for academic excellence throughout high school, achieving the highest grades at IES Kursaal in Algeciras.',
      },
      'catch-a-star': {
        organization: 'European Union · EAAE',
        prize: '2nd International Prize',
        title: 'Catch a Star (EAAE)',
        description:
          'International recognition in astronomy awarded by the European Association for Astronomy Education (EAAE).',
      },
      'malackaton-2024': {
        organization: 'University of Málaga',
        prize: 'Best First-Year Team',
        title: 'Malackaton 2024 – Best First-Year Team',
        description: 'Recognition as the best first-year team in the University of Málaga hackathon.',
      },
      'cambridge-c1': {
        organization: 'Cambridge Assessment English',
        prize: 'Certificate with Merit',
        title: 'Cambridge C1 Advanced Certificate',
        description:
          'Obtained with merit, demonstrating advanced English proficiency in reading, listening, writing, and speaking.',
      },
      diverciencia: {
        organization: 'Diverciencia Fair',
        prize: '1st Prize',
        title: 'First Prize at Diverciencia',
        description: 'Highest recognition at the science fair for developing innovative projects with a social impact.',
      },
      'ciencia-en-accion-astronomy': {
        organization: 'Ministry of Science, Innovation and Universities',
        prize: '1st National Prize',
        title: 'Astronomy "Science in Action"',
        description:
          'First place nationally for innovative research in astronomy. Highest recognition in the category across Spain.',
      },
      'open-science-cambre': {
        organization: 'IES David Buján',
        prize: 'Triple Winner',
        title: 'Open Science Cambre – Triple Crown',
        description: 'Winner of three first prizes in different categories at the open science fair.',
      },
      'cadiz-programming-champion': {
        organization: 'Province of Cádiz',
        prize: '1st Provincial Prize',
        title: 'Cádiz Under-18 Programming Champion',
        description: 'First place in the provincial programming competition for minors under 18 years old.',
      },
      'cadiz-research-award': {
        organization: 'Cádiz Provincial Council',
        prize: '1st Prize',
        title: 'Cádiz Scientific Research Award',
        description: 'Provincial recognition for outstanding scientific research excellence.',
      },
      'infomatrix-2023': {
        organization: 'SOLACYT',
        prize: 'Platinum Medal',
        title: 'Infomatrix Iberoamerica – International Platinum (Tech)',
        description: 'Highest award in the Ibero-American final for innovation and technical excellence.',
      },
      'cansat-esero': {
        organization: 'ESA / ESERO',
        prize: 'Double Participation',
        title: 'CanSat Esero – Kursaatélite Project',
        description:
          'Double participation in the European experimental satellite project CanSat (European Space Education Resource Office). Sole engineering leader.',
      },
      'servet-balloons': {
        organization: 'Servet Project',
        prize: 'Double Launch',
        title: 'Servet Project – Stratospheric Probe Balloons',
        description:
          'Participation in two probe balloon launches reaching 35 km altitude. Engineered real-time LoRa telemetry and post-flight data analysis.',
      },
      'ciencia-en-accion-steam': {
        organization: 'Ministry of Science, Innovation and Universities',
        prize: '2nd National Prize',
        title: 'STEAM "Science in Action"',
        description:
          'Second prize nationally in the STEAM category for an interdisciplinary project integrating Science, Technology, Engineering, Art, and Mathematics.',
      },
      'infomatrix-2022': {
        organization: 'SOLACYT',
        prize: 'Platinum Medal',
        title: 'Infomatrix Iberoamerica – International Platinum (Science)',
        description: 'Highest recognition in the Ibero-American final of scientific research projects.',
      },
      'infomatrix-2021': {
        organization: 'SOLACYT',
        prize: 'International Platinum Medal',
        title: 'Infomatrix Iberoamerica – Highest Technical Award',
        description:
          'Highest technical award in the Ibero-American competition, recognizing absolute excellence in technological development.',
      },
      'cepsa-foundation': {
        organization: 'Cepsa Foundation',
        prize: '1st Prize',
        title: 'First Prize Cepsa Foundation',
        description: 'Recognition for the best project in the Campo de Gibraltar region.',
      },
      'uca-scholarship': {
        organization: 'University of Cádiz (UCA)',
        prize: 'Excellence Scholarship',
        title: 'UCA Excellence Scholarship',
        description:
          'Selected for the summer program for outstanding students, awarded for demonstrated academic and technical potential.',
      },
      'uex-science-fair': {
        organization: 'University of Extremadura (UEX)',
        prize: '1st Prize',
        title: 'Winner UEX Science Fair',
        description: 'First prize at the II Science Fair of the University of Extremadura.',
      },
      'algeciras-young-researchers': {
        organization: 'Algeciras City Council',
        prize: '6 First Prizes',
        title: 'Algeciras Young Researchers Awards',
        description:
          'Winner of six first prizes across different editions of the municipal young researchers competition.',
      },
    },
  },
  contact: {
    tag: 'Available for new opportunities',
    title: 'Contact',
    info: {
      title: "Let's talk?",
      description: contactDescription,
      channels: 'Contact channels',
      personalEmail: 'Personal Email',
      umaEmail: 'UMA Email',
      phone: 'Phone',
      downloadCv: 'Download complete CV (PDF)',
      meetings: 'Meetings: Monday–Friday · 17:00–20:00 GMT+2',
      languages: 'Spanish (Native) · English C1 · French A2',
    },
    form: {
      title: 'Send me a message',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      required: 'All fields are required.',
      placeholderName: 'Your full name',
      placeholderEmail: 'you@email.com',
      placeholderSubject: 'What do you want to talk about?',
      placeholderMessage: 'Tell me about your proposal, project, or just say hi...',
      submit: 'Send message',
      sending: 'Sending…',
      verify: 'Tick the Cloudflare box to confirm you are a person and send your message.',
      notice:
        'Protected by Cloudflare Turnstile. The <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Turnstile Privacy Policy</a> applies.',
      success: 'Message sent successfully! I will reply as soon as possible.',
      errors: {
        required: 'Please complete all required fields.',
        invalidEmail: 'Please enter a valid email address.',
        tooLong: 'One of the fields is too long.',
        rateLimit: 'Please wait one minute between messages.',
        hourlyLimit: 'You have exceeded the hourly message limit.',
        dailyLimit: 'The daily message limit has been reached. Please write to me by email instead.',
        verification: 'We could not verify that you are a person. Please try again or write to me by email.',
        blocked:
          'The Cloudflare check could not load; a browser extension may be blocking it. Allow it on this site or write to me by email.',
        sending: 'Error sending message. Please try again.',
      },
    },
  },
  preferences: {
    open: 'Open accessibility menu',
    title: 'Accessibility',
    close: 'Close',
    theme: 'Theme',
    themes: {
      system: 'Automatic',
      light: 'Light',
      dark: 'Dark',
    },
    textSize: 'Text size',
    textSizes: {
      small: 'Decrease text size',
      normal: 'Normal text size',
      large: 'Increase text size',
    },
    contrast: 'High contrast',
    colorFilter: 'Color-blind mode',
    colorFilters: {
      none: 'None',
      protanopia: 'Protanopia',
      deuteranopia: 'Deuteranopia',
      tritanopia: 'Tritanopia',
    },
    reset: 'Reset all',
  },
  footer: {
    contact: 'Contact',
    sections: 'Sections',
    agents: 'For AI agents',
    agentsDescription: 'The content is also available as Markdown, JSON and MCP.',
    source: 'Source code',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has moved.',
    backHome: 'Back to home',
  },
  markdown: {
    organization: 'Organization',
    status: 'Status',
    period: 'Period',
    milestones: 'Milestones',
    tags: 'Tags',
    video: 'Video',
    date: 'Date',
    scope: 'Scope',
    issuer: 'Awarded by',
    award: 'Award',
    navigation: 'Navigation',
    otherLanguages: 'Other languages',
    htmlVersion: 'HTML version of this page',
    formFields: 'Form fields (all required)',
    agentsTitle: 'For AI agents',
    agentsContact:
      "An agent can submit this form with this page's WebMCP tool `send_contact_message`, or use the tool of the same name on the portfolio's MCP server (requires OAuth authorization; see /auth.md). Always confirm the content with the person before sending.",
    agentResources: 'Agent resources',
  },
  consent: {
    title: 'Authorize access',
    heading: "{client} wants to connect to Daniel Carrasco García's portfolio",
    verified: 'Published by <strong>{domain}</strong>.',
    unverified: 'This app registered itself; its name is not verified.',
    redirect: 'Access will be sent to <strong>{host}</strong>.',
    loopback: 'Access goes to an app on your computer. Continue only if you just started connecting from it.',
    permissions: 'Permissions',
    scopes: {
      read: 'Read the public portfolio information: profile, projects, skills, achievements and contact.',
      contact: 'Send messages to Daniel on your behalf (at most 3 per hour).',
      offlineAccess: 'Keep access for 30 days without asking you again.',
    },
    anonymous: 'No account needed: access is anonymous and you can revoke it from your client.',
    allow: 'Allow',
    deny: 'Deny',
    captchaFailed: 'We could not verify that you are a person. Please try again.',
    notConfigured: 'Authorization is not available right now.',
    expired: 'This request has expired or was already used. Connect again from your app.',
    invalidClient: 'The app requesting access could not be verified.',
  },
};
