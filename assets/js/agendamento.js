(() => {
  'use strict';
  const form = document.getElementById('aulaForm');
  if (!form) return;
  const byId = id => document.getElementById(id);
  const nome = byId('nome');
  const nomeCrianca = byId('nomeCrianca');
  const idadeCrianca = byId('idadeCrianca');
  const nivel = byId('nivel');
  const button = byId('submitButton');
  const status = byId('formStatus');
  const continueLink = byId('whatsappContinue');
  const radios = [...form.querySelectorAll('input[name="tipoAula"]')];
  const fields = [...form.querySelectorAll('input, select')];
  const savedRequests = new Set();
  const adultLevels = ['Nunca treinei (Iniciante)', 'Faixa Branca', 'Faixa Azul', 'Faixa Roxa', 'Faixa Marrom', 'Faixa Preta'];
  const childLevels = ['Nunca treinou (Iniciante)', 'Faixa Branca', 'Faixa Cinza', 'Faixa Amarela', 'Faixa Laranja', 'Faixa Verde'];
  let sending = false;

  const tipo = () => radios.find(input => input.checked)?.value || 'adulto';
  const buttonLabel = () => tipo() === 'infantil' ? 'Agendar aula infantil' : tipo() === 'feminino' ? 'Agendar aula feminina' : 'Quero fazer uma aula grátis';
  function restoreButton() {
    button.textContent = buttonLabel();
  }
  function fieldError(field, message) {
    field.classList.toggle('invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    byId(field.id + 'Error').textContent = message;
    return !message;
  }
  function clearResult() {
    if (sending) return;
    status.textContent = '';
    status.classList.remove('error');
    continueLink.hidden = true;
    button.disabled = false;
    restoreButton();
  }
  function updateType() {
    const kids = tipo() === 'infantil';
    byId('kidsFormFields').hidden = !kids;
    nomeCrianca.required = kids;
    nomeCrianca.disabled = !kids;
    idadeCrianca.disabled = !kids;
    byId('nomeLabel').textContent = kids ? 'Nome do responsável' : tipo() === 'feminino' ? 'Nome completo da aluna' : 'Nome completo';
    nome.placeholder = kids ? 'Nome de quem é responsável' : 'Como podemos te chamar?';
    byId('nivelLabel').textContent = kids ? 'Nível de experiência da criança' : 'Nível de experiência';
    const current = nivel.value;
    const options = kids ? childLevels : adultLevels;
    nivel.replaceChildren(new Option(kids ? 'Selecione o nível da criança' : 'Selecione seu nível', ''));
    options.forEach(value => nivel.add(new Option(value, value)));
    if (options.includes(current)) nivel.value = current;
    [nome, nomeCrianca, idadeCrianca, nivel].forEach(field => fieldError(field, ''));
    byId('formDisclaimer').textContent = 'Depois de enviar, continue no WhatsApp para combinar o dia e o horário com a equipe.';
    clearResult();
  }
  function validate(field) {
    if (field.disabled) return fieldError(field, '');
    let message = '';
    if (field === nome || field === nomeCrianca) {
      const length = field.value.trim().length;
      if (length < 2) message = field === nomeCrianca ? 'Informe o nome da criança.' : tipo() === 'infantil' ? 'Informe o nome do responsável.' : 'Informe seu nome para continuar.';
      else if (length > 150) message = 'Use no máximo 150 caracteres.';
    } else if (field === nivel && !field.value) {
      message = tipo() === 'infantil' ? 'Selecione o nível da criança.' : 'Selecione seu nível de experiência.';
    } else if (field === idadeCrianca && !field.validity.valid) {
      message = 'Informe uma idade de 1 a 17 anos, ou deixe em branco.';
    }
    return fieldError(field, message);
  }

  radios.forEach(radio => radio.addEventListener('change', updateType));
  document.querySelectorAll('[data-aula]').forEach(link => link.addEventListener('click', () => {
    if (sending) return;
    const choice = radios.find(radio => radio.value === link.dataset.aula);
    if (choice) { choice.checked = true; updateType(); }
  }));
  [nome, nomeCrianca, idadeCrianca, nivel].forEach(field => {
    field.addEventListener(field === nivel ? 'change' : 'input', () => {
      clearResult();
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
  });

  function whatsAppUrl(data) {
    const label = data.tipoAula === 'feminino' ? 'Feminina' : data.tipoAula === 'infantil' ? 'Infantil' : 'Adulto';
    const lines = ['Oi, vim pelo site e quero agendar uma aula grátis de Jiu-Jitsu.', '', 'Tipo de aula: ' + label];
    if (data.tipoAula === 'infantil') {
      lines.push('Nome do responsável: ' + data.nome, 'Nome da criança: ' + data.nomeCrianca);
      if (data.idadeCrianca) lines.push('Idade da criança: ' + data.idadeCrianca + ' anos');
      lines.push('Nível de experiência da criança: ' + data.nivelExperiencia);
    } else {
      lines.push('Nome: ' + data.nome, 'Nível de experiência: ' + data.nivelExperiencia);
    }
    return 'https://wa.me/5521988519433?text=' + encodeURIComponent(lines.join('\n'));
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    const validationFields = [nome, nomeCrianca, idadeCrianca, nivel];
    const invalid = validationFields.filter(field => !validate(field));
    if (invalid.length) {
      status.classList.add('error');
      status.textContent = 'Confira os campos destacados para continuar.';
      continueLink.hidden = true;
      invalid[0].focus();
      return;
    }
    const kids = tipo() === 'infantil';
    const data = {
      tipoAula: tipo(),
      nome: nome.value.trim(),
      nomeCrianca: kids ? nomeCrianca.value.trim() : '',
      idadeCrianca: kids ? idadeCrianca.value.trim() : '',
      nivelExperiencia: nivel.value
    };
    const key = JSON.stringify(data);
    const url = whatsAppUrl(data);
    sending = true;
    fields.forEach(field => { field.disabled = true; });
    button.disabled = true;
    button.textContent = 'Enviando sua solicitação…';
    button.setAttribute('aria-busy', 'true');
    form.setAttribute('aria-busy', 'true');
    status.classList.remove('error');
    status.textContent = '';
    continueLink.hidden = true;
    let success = false;
    try {
      if (!savedRequests.has(key)) {
        await AgendamentosService.salvar(data);
        savedRequests.add(key);
      }
      success = true;
      status.textContent = 'Solicitação registrada! Envie a mensagem no WhatsApp para combinar o dia e o horário.';
      continueLink.href = url;
      continueLink.hidden = false;
      try { window.open(url, '_blank', 'noopener,noreferrer'); } catch { /* O link abaixo também permite continuar. */ }
    } catch {
      status.classList.add('error');
      status.textContent = 'Não foi possível registrar a solicitação. Tente novamente ou fale diretamente com a equipe pelo WhatsApp.';
      continueLink.href = url;
      continueLink.hidden = false;
    } finally {
      sending = false;
      fields.forEach(field => { field.disabled = false; });
      nomeCrianca.disabled = !kids;
      idadeCrianca.disabled = !kids;
      button.disabled = success;
      button.removeAttribute('aria-busy');
      form.removeAttribute('aria-busy');
      if (success) {
        button.textContent = 'Solicitação registrada ✓';
        continueLink.focus({ preventScroll: true });
      } else restoreButton();
    }
  });
  updateType();
})();
