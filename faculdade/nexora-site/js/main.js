// ============================================================
// main.js -- Ponto de entrada: inicializa tudo ao carregar a pagina
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Renderiza a home com os dados do banco
  renderFeaturedServices();

  // Ativa animacoes de scroll reveal nos elementos estaticos
  initReveal();

  // Inicia os contadores animados (com pequeno delay para o DOM estabilizar)
  setTimeout(animateCounters, 400);

  // Listener de scroll para efeito da navbar
  initNavbarScroll();
});
