// ============================================================
// ui.js -- Animacoes, toasts, scroll reveal e efeitos visuais
// ============================================================

/** Exibe um toast de notificacao temporario */
function showToast(icon, text, color = 'var(--text)') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size:1.1rem">${icon}</span><span style="color:${color}">${text}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/** Inicializa o IntersectionObserver para animacoes de scroll reveal */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

/** Anima os contadores numericos na home (0 -> valor final) */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.textContent.replace(/[0-9]/g, '');  // preserva sufixo (+, %, etc.)
    let current  = 0;
    const step   = Math.ceil(target / 50);

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

/** Adiciona sombra na navbar ao rolar a pagina */
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.style.boxShadow = window.scrollY > 20
      ? '0 4px 24px rgba(0,0,0,0.3)'
      : 'none';
  });
}
