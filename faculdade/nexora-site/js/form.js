// ============================================================
// form.js -- Logica de validacao e envio do formulario de contato
// ============================================================

/** Valida e processa o envio do formulario */
function submitContact() {
  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value.trim();

  // Validacao basica
  if (!name || !email || !message) {
    showToast('⚠️', 'Preencha nome, e-mail e mensagem.', '#f5c842');
    return;
  }
  if (!email.includes('@')) {
    showToast('⚠️', 'Insira um e-mail valido.', '#f5c842');
    return;
  }

  // Estado de carregamento
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Enviando...';

  // Simula chamada assincrona ao banco de dados
  setTimeout(() => {
    DB.saveMessage({ name, email, subject, message });

    // Reseta UI
    btn.innerHTML = 'Enviar Mensagem';
    btn.disabled  = false;

    // Feedback visual
    const successEl = document.getElementById('successMsg');
    successEl.classList.add('show');
    showToast('✅', 'Mensagem salva no banco de dados!', '#86efac');

    // Limpa o formulario
    document.getElementById('contactName').value    = '';
    document.getElementById('contactEmail').value   = '';
    document.getElementById('contactSubject').value = '';
    document.getElementById('contactMessage').value = '';

    // Atualiza a tabela de mensagens
    renderMessages();

    // Oculta mensagem de sucesso apos 5s
    setTimeout(() => successEl.classList.remove('show'), 5000);
  }, 1200);
}
