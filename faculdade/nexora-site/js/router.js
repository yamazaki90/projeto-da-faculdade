// ============================================================
// router.js -- Navegacao entre paginas (SPA sem reload)
// ============================================================

/**
 * Exibe a pagina especificada e oculta as demais.
 * @param {string} name - 'home' | 'sobre' | 'servicos' | 'clientes' | 'contato'
 */
function showPage(name) {
  // Oculta todas as paginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Ativa a pagina alvo
  document.getElementById('page-' + name).classList.add('active');

  // Atualiza o link ativo na navbar
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });

  // Volta ao topo suavemente
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Renderiza o conteudo da pagina
  if (name === 'home')     renderFeaturedServices();
  if (name === 'servicos') renderServices();
  if (name === 'clientes') renderTestimonials();
  if (name === 'contato')  renderMessages();

  // Inicializa animacoes de scroll reveal
  setTimeout(initReveal, 100);
}

/** Abre/fecha o menu mobile */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
