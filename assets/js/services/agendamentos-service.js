
const AgendamentosService = (() => {
  async function salvar({ tipoAula, nome, nomeCrianca = '', idadeCrianca = '', nivelExperiencia }) {
    if (!['adulto', 'infantil', 'feminino'].includes(tipoAula)) {
      throw new Error('Tipo de aula inválido.');
    }
    const nomeLimpo = String(nome || '').trim();
    const nivel = String(nivelExperiencia || '').trim();
    if (nomeLimpo.length < 2 || !nivel) {
      throw new Error('Nome e nível de experiência são obrigatórios.');
    }
    const dados = {
      tipo_aula: tipoAula,
      nivel_experiencia: nivel,
      origem: 'site',
      status: 'novo'
    };
    if (tipoAula === 'infantil') {
      const crianca = String(nomeCrianca).trim();
      if (crianca.length < 2) throw new Error('Nome da criança é obrigatório.');
      dados.nome_responsavel = nomeLimpo;
      dados.nome_crianca = crianca;
      dados.idade_crianca = String(idadeCrianca).trim() || null;
    } else {
      dados.nome_aluno = nomeLimpo;
    }
    const tabela = tipoAula === 'feminino' ? 'agendamentos_femininos' : 'agendamentos';
    const { error } = await supabaseClient.from(tabela).insert(dados);
    if (error) throw error;
  }
  return { salvar };
})();
