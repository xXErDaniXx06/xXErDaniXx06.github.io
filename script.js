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
  }
};

function createDaltonicControls() {
  const controls = document.querySelector('.accessibility-controls');
  const currentLang = document.documentElement.lang;
  
  // Crear el contenedor principal
  const container = document.createElement('div');
  container.className = 'daltonic-controls';
  container.style.display = 'none'; // Oculto por defecto
  
  // Selector de tipo
  const select = document.createElement('select');
  select.id = 'daltonicType';
  select.innerHTML = `
    <option value="none">${translations[currentLang].normalMode}</option>
    <option value="protanopia">${translations[currentLang].protanopia}</option>
    <option value="deuteranopia">${translations[currentLang].deuteranopia}</option>
    <option value="tritanopia">${translations[currentLang].tritanopia}</option>
  `;

  // Control de intensidad (oculto por defecto)
  const intensityContainer = document.createElement('div');
  intensityContainer.className = 'intensity-control';
  intensityContainer.style.display = 'none';
  intensityContainer.innerHTML = `
    <label for="daltonicIntensity">${currentLang === 'es' ? 'Intensidad' : 'Intensity'}: <span>50%</span></label>
    <input type="range" id="daltonicIntensity" min="0" max="100" value="50">
  `;

  // Añadir elementos al contenedor
  container.appendChild(select);
  container.appendChild(intensityContainer);
  controls.appendChild(container);

  // Event listeners
  select.addEventListener('change', updateDaltonicMode);
  const intensityInput = document.getElementById('daltonicIntensity');
  intensityInput.addEventListener('input', function(e) {
    this.previousElementSibling.querySelector('span').textContent = `${e.target.value}%`;
    updateDaltonicMode();
  });

  // Toggle del panel de control
  const button = document.getElementById('daltonicMode');
  button.addEventListener('click', function() {
    const isVisible = container.style.display !== 'none';
    container.style.display = isVisible ? 'none' : 'block';
    button.textContent = isVisible ? 
      translations[currentLang].daltonicMode : 
      translations[currentLang].normalMode;
  });

  // Restaurar configuración guardada
  const savedType = localStorage.getItem('daltonicType') || 'none';
  const savedIntensity = localStorage.getItem('daltonicIntensity') || 0.5;
  
  select.value = savedType;
  intensityInput.value = savedIntensity * 100;
  updateDaltonicMode();
}

function updateDaltonicMode() {
  const type = document.getElementById('daltonicType').value;
  const intensityInput = document.getElementById('daltonicIntensity');
  const intensityContainer = document.querySelector('.intensity-control');
  
  // Eliminar todas las clases de daltonismo
  document.body.classList.remove('daltonic', 'protanopia', 'deuteranopia', 'tritanopia');
  
  if (type !== 'none') {
    document.body.classList.add(type);
    const intensity = intensityInput.value / 100;
    document.documentElement.style.setProperty('--daltonic-intensity', intensity);
    
    // Mostrar el control de intensidad
    intensityContainer.style.display = 'block';
    
    // Guardar configuración
    localStorage.setItem('daltonicType', type);
    localStorage.setItem('daltonicIntensity', intensity);
  } else {
    // Restaurar vista normal y ocultar control de intensidad
    document.documentElement.style.removeProperty('--daltonic-intensity');
    intensityContainer.style.display = 'none';
    localStorage.removeItem('daltonicType');
    localStorage.removeItem('daltonicIntensity');
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
  const currentLang = document.documentElement.lang;
  const langLinks = document.querySelectorAll('.language-switcher a');
  
  langLinks.forEach(link => {
    link.classList.remove('active');
    if ((currentLang === 'es' && link.getAttribute('href').indexOf('_en') === -1) ||
        (currentLang === 'en' && link.getAttribute('href').indexOf('_en') !== -1)) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', setActiveLanguage);

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
    content.style.display = "none";
    
    // Set initial text
    button.textContent = translations[document.documentElement.lang].showDescription;
    
    button.addEventListener("click", function() {
      this.classList.toggle("active");
      content.style.display = content.style.display === "none" ? "block" : "none";
      this.textContent = content.style.display === "none" ? 
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

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('.submit-button');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = document.documentElement.lang === 'es' ? 
    'Enviando...' : 'Sending...';

  try {
    // Check rate limit first
    const limitData = checkRateLimit();

    // Get reCAPTCHA token
    let token;
    try {
      token = await new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
          grecaptcha.execute('6LcFQUwrAAAAANLsFY1iLotmBpIHaUr42LUKdoUV', {
            action: 'contact'
          }).then(resolve).catch(reject);
        });
      });
    } catch (recaptchaError) {
      console.error('reCAPTCHA Error:', recaptchaError);
      throw new Error(document.documentElement.lang === 'es' ? 
        'Error de verificación de seguridad' : 
        'Security verification error');
    }

    // Prepare email data
    const templateParams = {
      to_name: "Daniel",
      from_name: e.target.name.value,
      from_email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
      'g-recaptcha-response': token
    };

    // Send email
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
      e.target.reset();
    } else {
      throw new Error(document.documentElement.lang === 'es' ? 
        'Error al enviar el mensaje' : 
        'Error sending message');
    }
  } catch (error) {
    console.error('Form Error:', error);
    alert(document.documentElement.lang === 'es' ? 
      'Error al enviar el mensaje. Por favor, inténtelo de nuevo.' : 
      'Error sending message. Please try again.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}
