function toggleDaltonicMode() {
  const isDaltonic = localStorage.getItem('daltonic') === 'true';
  const currentLang = document.documentElement.lang;
  document.body.classList.toggle('daltonic', !isDaltonic);
  localStorage.setItem('daltonic', !isDaltonic);
  const button = document.getElementById('daltonicMode');
  button.textContent = !isDaltonic ? 
    translations[currentLang].normalMode : 
    translations[currentLang].daltonicMode;

  // Update meta theme color for mobile
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.content = !isDaltonic ? '#000000' : '#003366';
  }
}

// Language-specific text
const translations = {
  es: {
    daltonicMode: 'Modo Daltónico',
    normalMode: 'Modo Normal',
    protanopia: 'Protanopia',
    deuteranopia: 'Deuteranopia',
    tritanopia: 'Tritanopia',
    intensidad: 'Intensidad',
    showDescription: 'Ver descripción completa',
    hideDescription: 'Ocultar descripción'
  },
  en: {
    daltonicMode: 'Colorblind Mode',
    normalMode: 'Normal Mode',
    protanopia: 'Protanopia',
    deuteranopia: 'Deuteranopia',
    tritanopia: 'Tritanopia',
    intensity: 'Intensity',
    showDescription: 'Show full description',
    hideDescription: 'Hide description'
  },
  fr: {
    daltonicMode: 'Mode Daltonien',
    normalMode: 'Mode Normal',
    protanopia: 'Protanopie',
    deuteranopia: 'Deutéranopie',
    tritanopia: 'Tritanopie',
    intensity: 'Intensité',
    showDescription: 'Voir la description complète',
    hideDescription: 'Masquer la description'
  }
};

function createDaltonicControls() {
  const controls = document.querySelector('.accessibility-controls');
  const currentLang = document.documentElement.lang;
  
  const container = document.createElement('div');
  container.className = 'daltonic-controls';
  container.style.display = 'none';
  
  container.innerHTML = `
    <select id="daltonicType">
      <option value="none">${translations[currentLang].normalMode}</option>
      <option value="protanopia">${translations[currentLang].protanopia}</option>
      <option value="deuteranopia">${translations[currentLang].deuteranopia}</option>
      <option value="tritanopia">${translations[currentLang].tritanopia}</option>
    </select>
  `;
  
  controls.appendChild(container);
  
  const button = document.getElementById('daltonicMode');
  const select = document.getElementById('daltonicType');

  button.addEventListener('click', function(e) {
    e.stopPropagation();
    const isVisible = container.style.display === 'block';
    container.style.display = isVisible ? 'none' : 'block';
  });

  // Cerrar el panel al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!container.contains(e.target) && !button.contains(e.target)) {
      container.style.display = 'none';
    }
  });

  select.addEventListener('change', function() {
    const type = this.value;
    document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (type !== 'none') {
      document.body.classList.add(type);
    }
    localStorage.setItem('daltonicType', type);
  });

  // Restaurar configuración guardada
  const savedType = localStorage.getItem('daltonicType');
  if (savedType) {
    select.value = savedType;
    document.body.classList.add(savedType);
  }
}

// Update initial button text based on language
document.addEventListener('DOMContentLoaded', () => {
  const currentLang = document.documentElement.lang;
  const isDaltonic = localStorage.getItem('daltonic') === 'true';
  const button = document.getElementById('daltonicMode');
  
  if (isDaltonic) {
    document.body.classList.add('daltonic');
    button.textContent = translations[currentLang].normalMode;
  } else {
    button.textContent = translations[currentLang].daltonicMode;
  }
  
  setActiveLanguage();
});

// Apply daltonic mode on page load if it was enabled
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('daltonic') === 'true') {
    document.body.classList.add('daltonic');
    document.getElementById('daltonicMode').textContent = 'Modo Normal';
  }
});

// Initialize section highlighting
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.main-nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 60) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
});

// Language switcher functionality
function setActiveLanguage() {
  const currentPath = window.location.pathname;
  const baseFileName = currentPath.split('/').pop().split('_')[0].split('.')[0];
  const langLinks = document.querySelectorAll('.language-switcher a');
  
  // Eliminar clase active de todos los enlaces
  langLinks.forEach(link => {
    link.classList.remove('active');
    
    // Actualizar los href de los enlaces para mantener la página actual
    const linkPath = link.getAttribute('href');
    const isEnglish = linkPath.includes('_en');
    const isFrench = linkPath.includes('_fr');
    
    if (isEnglish) {
      link.href = `${baseFileName}_en.html`;
    } else if (isFrench) {
      link.href = `${baseFileName}_fr.html`;
    } else {
      link.href = `${baseFileName}.html`;
    }
    
    // Activar el enlace correspondiente al idioma actual
    if (currentPath.includes('_en.html') && isEnglish) {
      link.classList.add('active');
    } else if (currentPath.includes('_fr.html') && isFrench) {
      link.classList.add('active');
    } else if (!currentPath.includes('_') && !isEnglish && !isFrench) {
      link.classList.add('active');
    }
  });
}

// Asegurarse de que se ejecute cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  setActiveLanguage();
});

// Handle profile image loading errors
document.addEventListener('DOMContentLoaded', () => {
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
    profileImage.onerror = function() {
      this.classList.add('error');
      this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"%3E%3Cpath fill="%23ccc" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
      this.alt = 'Profile image placeholder';
    };
  }
});

// Collapsible functionality
document.addEventListener('DOMContentLoaded', () => {
  const coll = document.getElementsByClassName("collapsible");
  
  for (let i = 0; i < coll.length; i++) {
    const button = coll[i];
    const content = button.nextElementSibling;
    
    // Hide content by default
    content.style.maxHeight = "0px";
    
    // Set initial text
    button.textContent = translations[document.documentElement.lang].showDescription;
    
    button.addEventListener("click", function() {
      this.classList.toggle("active");
      const isExpanded = content.style.maxHeight !== "0px";
      
      content.classList.toggle('active');
      content.style.maxHeight = isExpanded ? "0px" : "2000px";
      
      this.textContent = isExpanded ? 
        translations[document.documentElement.lang].showDescription : 
        translations[document.documentElement.lang].hideDescription;
    });
  }
});

// Improve mobile touch feedback
document.addEventListener('DOMContentLoaded', () => {
  const interactiveElements = document.querySelectorAll('a, button, .collapsible');
  
  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    });
    
    element.addEventListener('touchend', function() {
      this.style.opacity = '1';
    });
  });

  // Add loading states
  const loadingElements = document.querySelectorAll('.profile-image, .project-card, .achievements-list li');
  loadingElements.forEach(element => {
    element.classList.add('loading');
    element.addEventListener('load', function() {
      this.classList.remove('loading');
    });
  });

  // Improve scroll performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Update active sections
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  });
});

// Initialize daltonic settings on page load
document.addEventListener('DOMContentLoaded', () => {
  createDaltonicControls();
  
  // Restaurar configuración guardada
  const savedType = localStorage.getItem('daltonicType');
  const savedIntensity = localStorage.getItem('daltonicIntensity');
  
  if (savedType && document.getElementById('daltonicType')) {
    document.getElementById('daltonicType').value = savedType;
    document.getElementById('daltonicIntensity').value = savedIntensity * 100;
    updateDaltonicMode();
  }
});

// Contact Form Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS with your public key
  emailjs.init("bxER5s23w9AXoN6vK");
  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

// Añadir estas funciones de control de rate limit
function checkRateLimit() {
  const now = Date.now();
  const lastSubmit = localStorage.getItem('lastSubmit');
  const submitCount = parseInt(localStorage.getItem('submitCount') || '0');
  
  if (lastSubmit && (now - parseInt(lastSubmit)) < 60000) { // 1 minuto entre envíos
    throw new Error(document.documentElement.lang === 'es' ? 
      'Por favor, espere un minuto entre mensajes.' : 
      'Please wait one minute between messages.');
  }
  
  if (submitCount >= 5 && (now - parseInt(lastSubmit)) < 3600000) { // 5 mensajes por hora
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

// Reemplazar la función handleFormSubmit existente
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('.submit-button');
  const originalText = submitButton.textContent;
  
  try {
    submitButton.disabled = true;
    submitButton.textContent = document.documentElement.lang === 'es' ? 
      'Enviando...' : 'Sending...';

    // Verificar rate limit
    const limitData = checkRateLimit();

    // Validar campos requeridos
    const requiredFields = form.querySelectorAll('[required]');
    for (const field of requiredFields) {
      if (!field.value.trim()) {
        throw new Error(document.documentElement.lang === 'es' ? 
          'Por favor, complete todos los campos requeridos.' : 
          'Please fill in all required fields.');
      }
    }

    // Obtener token reCAPTCHA
    const token = await grecaptcha.execute('6LcFQUwrAAAAANLsFY1iLotmBpIHaUr42LUKdoUV', {action: 'submit'});
    
    // Preparar datos del email
    const templateParams = {
      to_name: "Daniel",
      from_name: form.name.value.trim(),
      from_email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
      'g-recaptcha-response': token
    };

    // Enviar email
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