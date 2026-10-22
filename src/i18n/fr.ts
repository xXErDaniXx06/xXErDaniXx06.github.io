import type { Dictionary } from './types';

// La descripción de la página de contacto es la misma que su texto de presentación.
const contactDescription =
  'Ouvert aux opportunités en génie logiciel, recherche aérospatiale et collaboration technologique.';

export const fr: Dictionary = {
  languageName: 'Français',
  pages: {
    index: {
      title: 'Daniel Carrasco García | Portfolio',
      description:
        'Étudiant en Génie Informatique et passionné par la technologie aérospatiale et le développement de logiciels.',
    },
    proyectos: {
      title: 'Projets | Daniel Carrasco García',
      description: 'Parcours technique et projets vedettes.',
    },
    habilidades: {
      title: 'Compétences | Daniel Carrasco García',
      description: 'Stack technique et compétences techniques.',
    },
    logros: {
      title: 'Réalisations | Daniel Carrasco García',
      description: 'Réalisations et distinctions obtenues.',
    },
    contacto: {
      title: 'Contact | Daniel Carrasco García',
      description: contactDescription,
    },
  },
  common: {
    skipToContent: 'Aller au contenu',
    opensInNewTab: '(s’ouvre dans un nouvel onglet)',
  },
  nav: {
    pages: {
      index: 'Accueil',
      proyectos: 'Projets',
      habilidades: 'Compétences',
      logros: 'Réalisations',
      contacto: 'Contact',
    },
    mainLabel: 'Navigation principale',
    mobileLabel: 'Menu de navigation',
    openMenu: 'Ouvrir le menu de navigation',
    closeMenu: 'Fermer le menu de navigation',
    cv: 'CV',
    downloadCv: 'Télécharger le CV de Daniel Carrasco García',
    languageLabel: 'Langue',
  },
  home: {
    availability: 'Disponible pour opportunités',
    greeting: 'Bonjour, je suis',
    role: 'Étudiant en Génie Informatique',
    roleTagline: 'Software, Hardware & Aerospace Tech',
    about:
      "Je suis Daniel Carrasco García, étudiant en Génie Informatique à l'Université de Malaga, passionné par la technologie, le développement logiciel et le secteur aérospatial. J'aime créer des solutions pratiques et innovantes combinant matériel et logiciel, de la conception de PCB et liaisons RF au développement d'applications et de modèles d'IA.",
    photoAlt: 'Daniel Carrasco García',
    ctaProjects: 'Voir mes projets',
    ctaCv: 'Télécharger le CV',
    unpublished: {
      subtitle: 'Étudiant en Génie Informatique',
      subtitleHighlight: ' · Passionné par la technologie aérospatiale et le développement de logiciels',
      description:
        "Étudiant en Génie Informatique à l'<strong>Université de Malaga (UMA)</strong>, avec une expérience reconnue dans la direction de missions suborbitales complexes et l'ingénierie de liaisons de communication LoRa. Mon objectif est de maîtriser les protocoles de tests environnementaux et d'AIT pour répondre aux normes les plus élevées du secteur spatial européen.",
      location: {
        title: 'Localisation',
        city: 'Malaga / Algésiras',
        country: 'Espagne · GMT+2',
      },
      volunteering: {
        title: 'Ingénierie avec un But',
        description:
          'Bénévole au sein de la Fondation <strong>"Por Una Sonrisa"</strong>, qui soutient les enfants et adolescents atteints de cancer, alliant technologie et soutien émotionnel.',
        badge: 'Bénévolat Actif',
      },
      focus: {
        title: 'Actuellement concentré sur :',
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
        title: 'Explorer\nMissions &\nProjets',
        description: 'Missions suborbitales, CanSat, conception RF, bénévolat et plus.',
        button: 'Voir les projets',
        ariaLabel: 'Voir tous les projets de Daniel Carrasco García',
      },
    },
  },
  projects: {
    tag: 'Parcours Technique',
    title: 'Missions & Projets',
    titleHighlight: ' Vedettes',
    subtitle:
      "Des missions suborbitales CanSat à 45 000 mètres aux modèles d'IA et aux applications Full-Stack. Chaque projet témoigne d'un engagement envers l'excellence technique et un impact réel.",
    statusActive: 'Actif',
    statusCompleted: 'Complété',
    present: 'Actuel',
    longTerm: 'Vision à Long Terme',
    milestones: 'Étapes clés',
    tags: 'Étiquettes',
    items: {
      ksat: {
        title: 'Málaga Space Team',
        organization:
          'Universidad de Málaga, Mobilenet - Mobile & Aerospace Networks Lab (University of Málaga) & Albor Space',
        description:
          'Initiative principale du Málaga Space Team pour développer une plateforme modulaire <strong>1U CubeSat</strong>. Démonstrateur technologique pour architectures de communication à longue portée et faible consommation.',
        milestones: [
          "Conception de l'architecture du sous-système RF avec modulation LoRa",
          'Tests fonctionnels et de vérification du système',
          'Analyse du Link Budget pour la couverture orbitale',
          'Rapports techniques rédigés sous LaTeX',
        ],
        tags: ['LoRa', 'RF', 'CubeSat', 'LaTeX'],
      },
      emprendimiento: {
        title: 'Programme Défi Entrepreneur Innovant - Málaga (II Edition)',
        organization: 'EOI & Promálaga',
        description:
          "Initiative promue par l'EOI et Promálaga (Mairie de Málaga). Programme intensif axé sur la transformation d'idées en modèles d'affaires réels et évolutifs au sein de l'écosystème d'innovation international de Málaga.",
        milestones: [
          "Transformation d'idées innovantes en modèles d'affaires réels",
          "Développement de plans d'affaires évolutifs",
          "Intégration dans l'écosystème international d'innovation de Málaga",
          "Formation intensive en gestion d'entreprise de haute performance",
        ],
        tags: ['Entrepreneuriat', 'Affaires', 'Innovation'],
      },
      kursaatelite: {
        title: 'Kursaatélite',
        organization: 'CanSat Esero · Projet Servet',
        description:
          "Programme de recherche aérospatiale dans des environnements suborbitaux. De la compétition CanSat Esero au <strong>Projet Servet</strong>, atteignant <strong>45 000 mètres</strong> d'altitude en ballon stratosphérique.",
        milestones: [
          "Unique leader d'ingénierie de l'équipe multidisciplinaire",
          'Liaison de communication Near-Space (télémétrie LoRa en temps réel)',
          'Survie environnementale : −50 °C et conditions de quasi-vide',
          'Analyse des données post-vol et documentation technique',
        ],
        tags: ['Hardware', 'Télémétrie', 'CanSat', 'Data Analysis'],
      },
      kursaalmars: {
        title: 'KursaalMars',
        organization: 'Recherche Spatiale',
        description:
          "Recherche sur l'habitabilité de Mars. Conception structurelle de modules de vie, automatisation de systèmes de support vital et analyse de la radiation et des conditions environnementales extrêmes.",
        milestones: [
          'Conception structurelle de modules habitables',
          'Automatisation de systèmes de support vital',
          'Analyse de la radiation martienne et environnementale',
        ],
        tags: ['Automation', 'Space Research', 'Biology'],
      },
      oracle: {
        title: 'Oracle AI & Full-Stack',
        organization: 'Projets Logiciels',
        description:
          "Modèle d'IA pour prédire les succès musicaux (<strong>Oracle Summer Hit Song 2025</strong>) avec Python et ML. Développement Full-Stack d'un système de gestion de colocations partagées avec Firebase et authentification en temps réel.",
        milestones: [
          'Modèle de prédiction de hits ML (Python, scikit-learn)',
          'Système de gestion de logements partagés avec Firebase',
          'Authentification et base de données en temps réel',
        ],
        tags: ['Python', 'AI / ML', 'Firebase', 'Full-Stack'],
      },
      porunasonrisa: {
        title: 'Por Una Sonrisa',
        organization: 'Initiative Solidaire',
        description:
          "Initiative solidaire dédiée à <strong>décorer des satellites</strong> avec la devise <em>“Nous apportons de l'espoir aux étoiles”</em>, pour motiver les enfants atteints de cancer.",
        milestones: [
          "Décoration de satellites expérimentaux avec des messages d'espoir",
          "Organisation d'expositions itinérantes pour la sensibilisation",
          "Remise de prix symboliques à l'aide de nez de clown",
        ],
        tags: ['Décoration', 'Bénévolat'],
      },
      sensordeco2: {
        title: 'Capteur de CO₂',
        organization: "Qualité de l'Air · IES Kursaal",
        description:
          "Système IoT de surveillance en temps réel de la qualité de l'air pour les salles de classe, développé comme mesure préventive d'aération pendant la pandémie.",
        milestones: [
          "Intégration du capteur MH-Z19B (NDIR) et de l'écran OLED SSD1306",
          'Microcontrôleur ESP8266 (NodeMCU) et transmission ThingSpeak',
          "Analyse des données réelles d'aération des classes",
        ],
        tags: ['ESP8266', 'ThingSpeak', 'OLED'],
      },
      smartdoor: {
        title: 'SmartDoor',
        organization: 'Efficacité Antarctique · IES Kursaal',
        description:
          "Conception structurelle et automatisation d'un logement économe en énergie adapté aux conditions extrêmes de l'Antarctique.",
        milestones: [
          "Système d'entrée intelligent minimisant les pertes de chaleur",
          'Analyse du comportement thermique et de la physique sphérique',
          "Réduction de la consommation de carburant et de l'empreinte carbone",
        ],
        tags: ['Antarctique', 'Efficacité'],
      },
      dustnet: {
        title: 'DustNet',
        organization: "Qualité de l'Air · IES Kursaal",
        description:
          "Projet pionnier pour la surveillance des particules fines en suspension à l'aide de réseaux de capteurs sans fil à faible coût.",
        milestones: [
          'Utilisation de la technologie sans fil à longue portée (LoRaWAN)',
          'Surveillance en temps réel des concentrations de PM10 et PM2.5',
          'Transmission de données environnementales vers ThingSpeak',
        ],
        tags: ['LoRaWAN', 'PM2.5'],
      },
      futuro: {
        title: 'Projets Futurs',
        organization: "Aspirations d'Ingénierie",
        description:
          "Vision de recherche et développement dans les domaines de la finance quantitative, de l'informatique quantique et de la durabilité.",
        milestones: [
          'Algorithmes de trading quantitatif et Intelligence Artificielle',
          'Informatique Quantique et cryptographie avancée',
          'Contributions à des projets IoT durables et open source',
        ],
        tags: ['AI / ML', 'Trading', 'Quantum'],
      },
    },
  },
  skills: {
    tag: 'Compétences Techniques',
    title: 'Stack',
    titleHighlight: ' Technique',
    subtitle:
      'Une combinaison de développement logiciel, d’ingénierie matérielle aérospatiale et de communications RF appliqués à des projets réels.',
    categories: {
      programming: {
        title: 'Programmation',
        description: 'Langages de haut et bas niveau pour les systèmes embarqués et le calcul scientifique.',
        skills: [
          {
            name: 'Python',
            note: 'IA, Analyse de Données, Scripts',
          },
          {
            name: 'C++',
            note: 'Microcontrôleurs, POO',
          },
          {
            name: 'C',
            note: 'Systèmes de bas niveau',
          },
          {
            name: 'Java',
            note: 'POO, Backend',
          },
          {
            name: 'RISC-V',
            note: 'Architecture ouverte',
          },
          {
            name: 'Assembly',
            note: 'Programmation bas niveau',
          },
          {
            name: 'Bash',
            note: 'Scripting et automatisation',
          },
        ],
      },
      'rf-embedded': {
        title: 'Communications, RF & Embarqué',
        description: 'Spécialisation dans les communications à longue portée et les protocoles aérospatiaux.',
        skills: [
          {
            name: 'LoRa / LoRaWAN',
            note: 'Télémétrie Near-Space',
          },
          {
            name: 'RF Link Design',
            note: 'Conception de liaisons RF',
          },
          {
            name: 'Link Budget Analysis',
            note: 'Analyse de puissance et SNR',
          },
          {
            name: 'I²C / SPI / UART',
            note: 'Protocoles embarqués',
          },
          {
            name: 'PCB Prototyping',
            note: 'KiCad, conception de cartes',
          },
          {
            name: 'Microcontroller Arch.',
            note: 'AVR, ARM Cortex',
          },
        ],
      },
      tools: {
        title: 'Outils & Environnements',
        description: 'Suite d’outils pour la documentation, la conception électronique et le traitement du signal.',
        skills: [
          {
            name: 'LaTeX',
            note: 'Documentation et rapports techniques',
          },
          {
            name: 'KiCad',
            note: 'Conception de PCBs et schémas',
          },
          {
            name: 'GNU Radio',
            note: 'Traitement du signal SDR',
          },
          {
            name: 'Arduino IDE',
            note: 'Prototypage embarqué',
          },
          {
            name: 'VS Code',
            note: 'Environnement de développement principal',
          },
          {
            name: 'Git / GitHub',
            note: 'Contrôle de version',
          },
          {
            name: 'Firebase',
            note: 'Backend as a Service',
          },
        ],
      },
      languages: {
        title: 'Langues',
        description: 'Compétence linguistique pour les environnements scientifiques et techniques internationaux.',
        skills: [
          {
            name: 'Espagnol',
            note: 'Langue maternelle',
          },
          {
            name: 'Anglais',
            note: 'C1 — Compréhension et production avancées',
          },
          {
            name: 'Français',
            note: 'A2 — Utilisateur élémentaire',
          },
        ],
      },
    },
  },
  achievements: {
    tag: 'Reconnaissances',
    title: 'Prix & Réalisations',
    subtitle:
      'distinctions sur plus de 6 ans : compétitions internationales, hackathons, recherche aérospatiale et intelligence artificielle.',
    footer: 'distinctions · Local, National & International',
    scopes: {
      international: 'International',
      national: 'National',
      regional: 'Régional',
      local: 'Local',
      academic: 'Académique',
      university: 'Universitaire',
      institutional: 'Institutionnel',
    },
    items: {
      'eoi-entrepreneur-program': {
        organization: 'EOI & Promálaga',
        prize: 'Diplômé',
        title: 'Programme Défi Entrepreneur Innovant - Málaga (II Édition)',
        description:
          "Diplômé du programme intensif axé sur la transformation d'idées en modèles d'affaires réels et évolutifs au sein de l'écosystème d'innovation de Málaga, promu par l'EOI et Promálaga.",
      },
      'talent-4-cyber': {
        organization: 'Ministère de la Défense',
        prize: 'Finaliste · 12ème Place Nationale',
        title: 'Talent 4 Cyber 2025',
        description:
          'Finaliste du championnat national de cybersécurité organisé par le Ministère de la Défense. 12ème place en Espagne avec son équipe.',
      },
      'malackaton-2025': {
        organization: 'Université de Málaga',
        prize: 'Finaliste',
        title: 'Malackaton 2025',
        description: "Finaliste du hackathon annuel de l'Université de Málaga.",
      },
      'crypto-trading-hackathon': {
        organization: 'La Térmica · Málaga',
        prize: 'Participant',
        title: 'Hackathon Crypto Trading',
        description: 'Développement de stratégies de trading algorithmique lors du hackathon de La Térmica, Málaga.',
      },
      'malaga-space-team': {
        organization: 'Université de Málaga',
        prize: 'Membre Actif',
        title: 'Málaga Space Team – Division Communications',
        description:
          "Intégration de l'équipe Málaga Space Team de l'UMA dédiée à la conception et à la construction de satellites. Membre de la division communications et diffusion.",
      },
      'init-g': {
        organization: 'Init.g',
        prize: 'Participant',
        title: 'Participation Init.g 2025',
        description: "Participation à l'événement technologique Init.g 2025.",
      },
      'oracle-summer-hit-song': {
        organization: 'Oracle',
        prize: '3ème Prix',
        title: 'Défi Oracle "Summer Hit Song 2025"',
        description:
          "Troisième prix au Défi Enseña d'Oracle. Développement d'un modèle d'IA (Python et ML) capable de prédire les succès musicaux de l'été.",
      },
      'honors-degree': {
        organization: 'IES Kursaal · Algésiras',
        prize: "Mention d'Honneur",
        title: "Mention d'Honneur au Baccalauréat",
        description:
          "Reconnaissance de l'excellence académique tout au long du lycée, obtenant les notes maximales à l'IES Kursaal d'Algésiras.",
      },
      'catch-a-star': {
        organization: 'Union Européenne · EAAE',
        prize: '2ème Prix International',
        title: 'Catch a Star (EAAE)',
        description:
          "Reconnaissance internationale en astronomie par l'Association Européenne pour l'Éducation en Astronomie (EAAE).",
      },
      'malackaton-2024': {
        organization: 'Université de Málaga',
        prize: 'Meilleure Équipe de 1ère Année',
        title: 'Malackaton 2024 – Meilleure Équipe de 1ère Année',
        description: "Reconnaissance de la meilleure équipe de première année au hackathon de l'Université de Málaga.",
      },
      'cambridge-c1': {
        organization: 'Cambridge Assessment English',
        prize: 'Certificat avec Mérite',
        title: 'Certificat Cambridge C1 Advanced',
        description:
          'Obtenu avec mérite, démontrant un niveau C1 avancé en anglais (compréhension, écoute, écrit et oral).',
      },
      diverciencia: {
        organization: 'Foire Diverciencia',
        prize: '1er Prix',
        title: 'Premier Prix à Diverciencia',
        description:
          'Reconnaissance maximale à la foire scientifique Diverciencia pour le développement de projets innovants ayant un impact social.',
      },
      'ciencia-en-accion-astronomy': {
        organization: "Ministère de la Science, de l'Innovation et des Universités",
        prize: '1er Prix National',
        title: 'Astronomie "Science en Action"',
        description:
          'Premier prix national pour la recherche innovante en astronomie. Plus haute distinction de la catégorie en Espagne.',
      },
      'open-science-cambre': {
        organization: 'IES David Buján',
        prize: 'Triple Vainqueur',
        title: 'Open Science Cambre – Triple Couronne',
        description:
          'Vainqueur de trois premiers prix dans différentes catégories à la foire de science ouverte Open Science Cambre.',
      },
      'cadiz-programming-champion': {
        organization: 'Province de Cadix',
        prize: '1er Prix Provincial',
        title: 'Champion de Programmation des moins de 18 ans de Cadix',
        description: 'Première place dans la compétition de programmation des moins de 18 ans de Cadix.',
      },
      'cadiz-research-award': {
        organization: 'Députation de Cadix',
        prize: '1er Prix',
        title: 'Prix en Recherche Scientifique de Cadix',
        description: "Reconnaissance provinciale pour l'excellence en recherche scientifique.",
      },
      'infomatrix-2023': {
        organization: 'SOLACYT',
        prize: 'Médaille de Platine',
        title: 'Infomatrix Iberoamérica – Platine International (Tech)',
        description: "Plus haute distinction à la finale ibéro-américaine pour l'innovation et l'excellence technique.",
      },
      'cansat-esero': {
        organization: 'ESA / ESERO',
        prize: 'Double Participation',
        title: 'CanSat Esero – Projet Kursaatélite',
        description:
          "Double participation au projet européen de satellites expérimentaux CanSat (ESERO). Seul leader d'ingénierie.",
      },
      'servet-balloons': {
        organization: 'Projet Servet',
        prize: 'Double Lancement',
        title: 'Projet Servet – Ballons Sondes Stratosphériques',
        description:
          "Participation à deux lancements de ballons sondes atteignant 35 km d'altitude. Télémétrie LoRa en temps réel et analyse de données.",
      },
      'ciencia-en-accion-steam': {
        organization: "Ministère de la Science, de l'Innovation et des Universités",
        prize: '2ème Prix National',
        title: 'STEAM "Science en Action"',
        description:
          "Deuxième place nationale en catégorie STEAM pour projet interdisciplinaire intégrant la science, la technologie, l'ingénierie, l'art et les mathématiques.",
      },
      'infomatrix-2022': {
        organization: 'SOLACYT',
        prize: 'Médaille de Platine',
        title: 'Infomatrix Iberoamérica – Platine International (Science)',
        description: 'Plus haute distinction à la finale ibéro-américaine des projets de recherche scientifique.',
      },
      'infomatrix-2021': {
        organization: 'SOLACYT',
        prize: 'Médaille de Platine Internationale',
        title: 'Infomatrix Iberoamérica – Plus Haute Distinction Technique',
        description:
          "Plus haute distinction technique de la compétition ibéro-américaine de technologie, récompensant l'excellence absolue.",
      },
      'cepsa-foundation': {
        organization: 'Fondation Cepsa',
        prize: '1er Prix',
        title: 'Premier Prix Fondation Cepsa',
        description: 'Reconnaissance du meilleur projet dans la région du Campo de Gibraltar.',
      },
      'uca-scholarship': {
        organization: 'Université de Cadix (UCA)',
        prize: "Bourse d'Excellence",
        title: "Bourse d'Excellence UCA",
        description:
          "Sélectionné pour le programme d'été des étudiants exceptionnels grâce au potentiel académique et technique démontré.",
      },
      'uex-science-fair': {
        organization: "Université d'Estrémadure (UEX)",
        prize: '1er Prix',
        title: 'Gagnant Foire des Sciences UEX',
        description: "Premier prix à la II Foire des Sciences de l'Université d'Estrémadure.",
      },
      'algeciras-young-researchers': {
        organization: "Mairie d'Algésiras",
        prize: '6 Premiers Prix',
        title: 'Premios Jóvenes Investigadores Algeciras',
        description:
          "Vainqueur de six premiers prix dans différentes éditions du concours municipal des jeunes chercheurs d'Algésiras.",
      },
    },
  },
  contact: {
    tag: 'Disponible pour de nouvelles opportunités',
    title: 'Contact',
    info: {
      title: 'On en parle ?',
      description: contactDescription,
      channels: 'Moyens de contact',
      personalEmail: 'Email personnel',
      umaEmail: 'Email UMA',
      phone: 'Téléphone',
      downloadCv: 'Télécharger le CV complet (PDF)',
      meetings: 'Rendez-vous : Lundi–Vendredi · 17:00–20:00 GMT+2',
      languages: 'Espagnol (Maternel) · Anglais C1 · Français A2',
    },
    form: {
      title: 'Envoyez-moi un message',
      name: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      message: 'Message',
      required: 'Tous les champs sont obligatoires.',
      placeholderName: 'Votre nom complet',
      placeholderEmail: 'vous@email.com',
      placeholderSubject: 'De quoi voulez-vous parler ?',
      placeholderMessage: 'Parlez-moi de votre proposition, projet, ou dites simplement bonjour...',
      submit: 'Envoyer le message',
      sending: 'Envoi en cours…',
      verify: 'Cochez la case Cloudflare pour confirmer que vous êtes une personne et envoyer votre message.',
      notice:
        'Protégé par Cloudflare Turnstile. La <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Politique de confidentialité de Turnstile</a> s\'applique.',
      success: 'Message envoyé avec succès ! Je vous répondrai dès que possible.',
      errors: {
        required: 'Veuillez remplir tous les champs obligatoires.',
        invalidEmail: 'Veuillez saisir une adresse e-mail valide.',
        tooLong: 'Un des champs est trop long.',
        rateLimit: 'Veuillez patienter une minute entre les messages.',
        hourlyLimit: 'Vous avez dépassé la limite de messages par heure.',
        dailyLimit: 'La limite quotidienne de messages est atteinte. Écrivez-moi directement par e-mail.',
        verification: 'Impossible de vérifier que vous êtes une personne. Réessayez ou écrivez-moi par e-mail.',
        blocked:
          "La vérification Cloudflare n'a pas pu se charger ; une extension du navigateur la bloque peut-être. Autorisez-la sur ce site ou écrivez-moi par e-mail.",
        sending: "Erreur lors de l'envoi du message. Veuillez réessayer.",
      },
    },
  },
  preferences: {
    open: 'Ouvrir le menu d’accessibilité',
    title: 'Accessibilité',
    close: 'Fermer',
    theme: 'Thème',
    themes: {
      system: 'Automatique',
      light: 'Clair',
      dark: 'Sombre',
    },
    textSize: 'Taille du texte',
    textSizes: {
      small: 'Réduire la taille du texte',
      normal: 'Taille du texte normale',
      large: 'Agrandir la taille du texte',
    },
    contrast: 'Contraste élevé',
    colorFilter: 'Mode daltonisme',
    colorFilters: {
      none: 'Aucun',
      protanopia: 'Protanopie',
      deuteranopia: 'Deutéranopie',
      tritanopia: 'Tritanopie',
    },
    reset: 'Tout réinitialiser',
  },
  footer: {
    contact: 'Contact',
    sections: 'Sections',
    agents: 'Pour les agents IA',
    agentsDescription: 'Le contenu est aussi disponible en Markdown, JSON et MCP.',
    source: 'Code source',
  },
  notFound: {
    title: 'Page introuvable',
    description: 'La page que vous cherchez n’existe pas ou a été déplacée.',
    backHome: 'Retour à l’accueil',
  },
  markdown: {
    organization: 'Organisation',
    status: 'Statut',
    period: 'Période',
    milestones: 'Étapes clés',
    tags: 'Étiquettes',
    video: 'Vidéo',
    date: 'Date',
    scope: 'Portée',
    issuer: 'Décerné par',
    award: 'Prix',
    navigation: 'Navigation',
    otherLanguages: 'Autres langues',
    htmlVersion: 'Version HTML de cette page',
    formFields: 'Champs du formulaire (tous obligatoires)',
    agentsTitle: 'Pour les agents IA',
    agentsContact:
      "Un agent peut envoyer ce formulaire avec l'outil WebMCP `send_contact_message` de cette page, ou utiliser l'outil du même nom du serveur MCP du portfolio (autorisation OAuth requise ; voir /auth.md). Confirmez toujours le contenu avec la personne avant l'envoi.",
    agentResources: 'Ressources pour agents',
  },
  consent: {
    title: "Autoriser l'accès",
    heading: '{client} souhaite se connecter au portfolio de Daniel Carrasco García',
    verified: 'Publié par <strong>{domain}</strong>.',
    unverified: "Cette application s'est enregistrée elle-même : son nom n'est pas vérifié.",
    redirect: "L'accès sera envoyé à <strong>{host}</strong>.",
    loopback:
      "L'accès ira à une application de votre ordinateur. Continuez seulement si vous venez de lancer la connexion depuis celle-ci.",
    permissions: 'Autorisations',
    scopes: {
      read: 'Lire les informations publiques du portfolio : profil, projets, compétences, réalisations et contact.',
      contact: 'Envoyer des messages à Daniel en votre nom (3 par heure au maximum).',
      offlineAccess: "Conserver l'accès pendant 30 jours sans vous redemander.",
    },
    anonymous: "Aucun compte requis : l'accès est anonyme et vous pouvez le révoquer depuis votre client.",
    allow: 'Autoriser',
    deny: 'Refuser',
    captchaFailed: 'Impossible de vérifier que vous êtes une personne. Réessayez.',
    notConfigured: "L'autorisation n'est pas disponible pour le moment.",
    expired: 'Cette demande a expiré ou a déjà été utilisée. Reconnectez-vous depuis votre application.',
    invalidClient: "L'application qui demande l'accès n'a pas pu être vérifiée.",
  },
};
