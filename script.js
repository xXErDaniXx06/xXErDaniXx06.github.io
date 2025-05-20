function toggleDaltonicMode() {
  const isDaltonic = localStorage.getItem('daltonic') === 'true';
  const currentLang = document.documentElement.lang;
  document.body.classList.toggle('daltonic', !isDaltonic);
  localStorage.setItem('daltonic', !isDaltonic);
  const button = document.getElementById('daltonicMode');
  button.textContent = !isDaltonic ? 
    translations[currentLang].normalMode : 
    translations[currentLang].daltonicMode;
}

// Language-specific text
const translations = {
  es: {
    daltonicMode: 'Modo Daltónico',
    normalMode: 'Modo Normal'
  },
  en: {
    daltonicMode: 'Colorblind Mode',
    normalMode: 'Normal Mode'
  }
};

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
