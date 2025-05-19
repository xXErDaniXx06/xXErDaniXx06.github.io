function toggleDaltonicMode() {
  document.body.classList.toggle('daltonic');
  const button = document.getElementById('daltonicMode');
  const isDaltonic = document.body.classList.contains('daltonic');
  button.textContent = isDaltonic ? 'Modo Normal' : 'Modo Daltónico';
}

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
