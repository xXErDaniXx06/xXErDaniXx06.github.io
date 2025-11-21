// Language-specific text
const translations = {
  es: {
    accessibility: 'Accesibilidad',
    normalMode: 'Modo Normal',
    protanopia: 'Protanopia',
    deuteranopia: 'Deuteranopia',
    tritanopia: 'Tritanopia',
    intensity: 'Intensidad',
    fontSize: 'Tamaño de letra',
    contrast: 'Contraste',
    showDescription: 'Ver detalles',
    hideDescription: 'Ocultar detalles',
    colorBlindness: 'Daltonismo'
  },
  en: {
    accessibility: 'Accessibility',
    normalMode: 'Normal Mode',
    protanopia: 'Protanopia',
    deuteranopia: 'Deuteranopia',
    tritanopia: 'Tritanopia',
    intensity: 'Intensity',
    fontSize: 'Font Size',
    contrast: 'Contrast',
    showDescription: 'Show details',
    hideDescription: 'Hide details',
    colorBlindness: 'Color Blindness'
  },
  fr: {
    accessibility: 'Accessibilité',
    normalMode: 'Mode Normal',
    protanopia: 'Protanopie',
    deuteranopia: 'Deutéranopie',
    tritanopia: 'Tritanopie',
    intensity: 'Intensité',
    fontSize: 'Taille de la police',
    contrast: 'Contraste',
    showDescription: 'Voir les détails',
    hideDescription: 'Masquer les détails',
    colorBlindness: 'Daltonisme'
  }
};

// Accessibility State
const a11yState = {
  mode: localStorage.getItem('a11y_mode') || 'none',
  intensity: localStorage.getItem('a11y_intensity') || '100',
  fontSize: localStorage.getItem('a11y_fontSize') || '16',
  contrast: localStorage.getItem('a11y_contrast') || '100',
  panelOpen: false
};

// Initialize Accessibility Features
function initAccessibility() {
  createAccessibilityOverlay();
  createAccessibilityPanel();
  updateAccessibilityState();

  // Set initial button text
  const btn = document.getElementById('daltonicMode');
  if (btn) {
    const lang = document.documentElement.lang;
    btn.textContent = translations[lang].accessibility;
    btn.onclick = toggleAccessibilityPanel; // Override inline onclick
  }
}

function createAccessibilityOverlay() {
  if (!document.getElementById('accessibility-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'accessibility-overlay';
    document.body.appendChild(overlay);
  }
}

function createAccessibilityPanel() {
  if (document.querySelector('.accessibility-panel')) return;

  const lang = document.documentElement.lang;
  const t = translations[lang];

  const panel = document.createElement('div');
  panel.className = 'accessibility-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', t.accessibility);

  panel.innerHTML = `
    <div class="panel-header">
      <h3>${t.accessibility}</h3>
      <button class="close-panel" onclick="toggleAccessibilityPanel()" aria-label="Close accessibility panel">✕</button>
    </div>
    
    <div class="control-group">
      <label>${t.colorBlindness}</label>
      <div class="mode-grid">
        <button class="mode-btn ${a11yState.mode === 'none' ? 'active' : ''}" onclick="updateA11yMode('none')">${t.normalMode}</button>
        <button class="mode-btn ${a11yState.mode === 'protanopia' ? 'active' : ''}" onclick="updateA11yMode('protanopia')">${t.protanopia}</button>
        <button class="mode-btn ${a11yState.mode === 'deuteranopia' ? 'active' : ''}" onclick="updateA11yMode('deuteranopia')">${t.deuteranopia}</button>
        <button class="mode-btn ${a11yState.mode === 'tritanopia' ? 'active' : ''}" onclick="updateA11yMode('tritanopia')">${t.tritanopia}</button>
      </div>
    </div>

    <div class="control-group" id="intensity-control-group">
      <label for="a11y-intensity">${t.intensity} <span id="intensity-val" class="value-display">${a11yState.intensity}%</span></label>
      <input type="range" id="a11y-intensity" min="0" max="100" value="${a11yState.intensity}" 
             oninput="updateA11yIntensity(this.value)">
    </div>

    <div class="control-group">
      <label for="a11y-contrast">${t.contrast} <span id="contrast-val" class="value-display">${a11yState.contrast}%</span></label>
      <input type="range" id="a11y-contrast" min="80" max="150" value="${a11yState.contrast}" 
             oninput="updateA11yContrast(this.value)">
    </div>

    <div class="control-group">
      <label for="a11y-fontsize">${t.fontSize} <span id="fontsize-val" class="value-display">${a11yState.fontSize}px</span></label>
      <input type="range" id="a11y-fontsize" min="12" max="24" value="${a11yState.fontSize}" 
             oninput="updateA11yFontSize(this.value)">
    </div>
  `;

  document.body.appendChild(panel);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && a11yState.panelOpen) {
      toggleAccessibilityPanel();
    }
  });
}

function toggleAccessibilityPanel() {
  const panel = document.querySelector('.accessibility-panel');
  const btn = document.getElementById('daltonicMode');

  if (panel) {
    a11yState.panelOpen = !a11yState.panelOpen;
    panel.classList.toggle('visible', a11yState.panelOpen);

    if (a11yState.panelOpen) {
      // Trap focus or move focus to close button
      const closeBtn = panel.querySelector('.close-panel');
      if (closeBtn) closeBtn.focus();
    } else {
      // Return focus to toggle button
      if (btn) btn.focus();
    }
  }
}

function updateA11yMode(mode) {
  a11yState.mode = mode;
  localStorage.setItem('a11y_mode', mode);

  // Update active button state
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
    // Check if the button's onclick attribute contains the mode string
    if (btn.getAttribute('onclick').includes(`'${mode}'`)) {
      btn.classList.add('active');
    }
  });

  updateAccessibilityState();
}

function updateA11yIntensity(value) {
  a11yState.intensity = value;
  localStorage.setItem('a11y_intensity', value);
  document.getElementById('intensity-val').textContent = value + '%';
  updateAccessibilityState();
}

function updateA11yContrast(value) {
  a11yState.contrast = value;
  localStorage.setItem('a11y_contrast', value);
  document.getElementById('contrast-val').textContent = value + '%';
  updateAccessibilityState();
}

function updateA11yFontSize(value) {
  a11yState.fontSize = value;
  localStorage.setItem('a11y_fontSize', value);
  document.getElementById('fontsize-val').textContent = value + 'px';
  updateAccessibilityState();
}

function updateAccessibilityState() {
  // Update Intensity Slider Visibility
  const intensityGroup = document.getElementById('intensity-control-group');
  if (intensityGroup) {
    intensityGroup.style.display = a11yState.mode === 'none' ? 'none' : 'block';
  }

  // Update Overlay
  const overlay = document.getElementById('accessibility-overlay');
  if (overlay) {
    overlay.className = ''; // Clear classes
    if (a11yState.mode !== 'none') {
      overlay.classList.add(a11yState.mode);
      overlay.style.opacity = a11yState.intensity / 100;
    } else {
      overlay.style.opacity = 0;
    }
  }

  // Update Font Size
  document.documentElement.style.fontSize = a11yState.fontSize + 'px';

  // Update Contrast
  // Apply to specific content elements to avoid breaking position:fixed on accessibility controls
  const contentElements = document.querySelectorAll('header, main, footer');
  contentElements.forEach(el => {
    el.style.filter = `contrast(${a11yState.contrast}%)`;
  });
}

// Language Switcher
function setActiveLanguage() {
  const currentPath = window.location.pathname;
  const baseFileName = currentPath.split('/').pop().split('_')[0].split('.')[0] || 'index';
  const langLinks = document.querySelectorAll('.language-switcher a');

  langLinks.forEach(link => {
    link.classList.remove('active');

    const linkPath = link.getAttribute('href');
    const isEnglish = linkPath.includes('_en');
    const isFrench = linkPath.includes('_fr');

    // Update href to match current page
    if (isEnglish) {
      link.href = `${baseFileName}_en.html`;
    } else if (isFrench) {
      link.href = `${baseFileName}_fr.html`;
    } else {
      link.href = `${baseFileName}.html`;
    }

    // Set active class
    if (currentPath.includes('_en.html') && isEnglish) {
      link.classList.add('active');
    } else if (currentPath.includes('_fr.html') && isFrench) {
      link.classList.add('active');
    } else if (!currentPath.includes('_') && !isEnglish && !isFrench) {
      link.classList.add('active');
    }
  });
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Collapsible Sections
function initCollapsibles() {
  const coll = document.getElementsByClassName("collapsible");

  for (let i = 0; i < coll.length; i++) {
    const button = coll[i];
    button.addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }
}

// Active Section Highlighting
function updateActiveSection() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.main-nav a');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current) && current !== '') {
      link.classList.add('active');
    }
  });
}

// Contact Form Handling
function initContactForm() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init("bxER5s23w9AXoN6vK");
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
}

function checkRateLimit() {
  const now = Date.now();
  const lastSubmit = localStorage.getItem('lastSubmit');
  const submitCount = parseInt(localStorage.getItem('submitCount') || '0');

  if (lastSubmit && (now - parseInt(lastSubmit)) < 60000) {
    throw new Error(document.documentElement.lang === 'es' ?
      'Por favor, espere un minuto entre mensajes.' :
      'Please wait one minute between messages.');
  }

  if (submitCount >= 5 && (now - parseInt(lastSubmit)) < 3600000) {
    throw new Error(document.documentElement.lang === 'es' ?
      'Ha excedido el límite de mensajes por hora.' :
      'You have exceeded the hourly message limit.');
  }

  return { now, submitCount };
}

function updateRateLimit(limitData) {
  localStorage.setItem('lastSubmit', limitData.now.toString());
  localStorage.setItem('submitCount', (limitData.submitCount + 1).toString());
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('.submit-button');
  const originalText = submitButton.textContent;

  try {
    submitButton.disabled = true;
    submitButton.textContent = document.documentElement.lang === 'es' ?
      'Enviando...' : 'Sending...';

    const limitData = checkRateLimit();

    const requiredFields = form.querySelectorAll('[required]');
    for (const field of requiredFields) {
      if (!field.value.trim()) {
        throw new Error(document.documentElement.lang === 'es' ?
          'Por favor, complete todos los campos requeridos.' :
          'Please fill in all required fields.');
      }
    }

    if (typeof grecaptcha === 'undefined') {
      throw new Error('reCAPTCHA not loaded');
    }
    const token = await grecaptcha.execute('6LcFQUwrAAAAANLsFY1iLotmBpIHaUr42LUKdoUV', { action: 'submit' });

    const templateParams = {
      to_name: "Daniel",
      from_name: form.name.value.trim(),
      from_email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
      'g-recaptcha-response': token
    };

    const response = await emailjs.send(
      "service_2hf264w",
      "template_mkc43b2",
      templateParams
    );

    if (response.status === 200) {
      updateRateLimit(limitData);
      alert(document.documentElement.lang === 'es' ?
        '¡Mensaje enviado correctamente!' :
        'Message sent successfully!');
      form.reset();
    } else {
      throw new Error(response.text || 'Error en el envío');
    }

  } catch (error) {
    console.error('Form Error:', error);
    alert(error.message || (document.documentElement.lang === 'es' ?
      'Error al enviar el mensaje. Por favor, inténtelo de nuevo.' :
      'Error sending message. Please try again.'));
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  setActiveLanguage();
  initScrollAnimations();
  initCollapsibles();
  initContactForm();

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  });
});