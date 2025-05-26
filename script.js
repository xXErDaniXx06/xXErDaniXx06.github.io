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
    normalMode: 'Modo no Daltónico',
    showDescription: 'Ver descripción completa',
    hideDescription: 'Ocultar descripción'
  },
  en: {
    daltonicMode: 'Colorblind Mode',
    normalMode: 'Non colorblind Mode',
    showDescription: 'Show full description',
    hideDescription: 'Hide description'
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
    
    // Set initial text
    button.textContent = translations[document.documentElement.lang].hideDescription;
    
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
