# Pagels Brazilian Jiu-Jitsu

Site institucional para uma academia de jiu-jítsu em Volta Redonda, desenvolvido por Victor Tech. Apresenta a equipe, as modalidades e um caminho simples para solicitar uma aula experimental.

## Funcionalidades

- Layout responsivo para celular e computador.
- Seções para turmas adulta, infantil e feminina.
- Formulário com nível de experiência e campos específicos para aulas infantis.
- Continuação do atendimento pelo WhatsApp para combinar dia e horário.
- Perguntas frequentes, localização e links de contato.
- Metadados de compartilhamento e sitemap.

## Tecnologias

HTML, CSS e JavaScript. Estrutura de integração com Supabase e publicação estática com domínio próprio.

## Executar localmente

Com Python instalado, execute na raiz:

```bash
python -m http.server 8080
```

Abra http://localhost:8080. Para revisar o fluxo de agendamento, consulte `assets/js/agendamento.js`, `assets/js/config` e `assets/js/services`. O comportamento da integração depende da configuração e disponibilidade do serviço; o horário é combinado com a equipe pelo WhatsApp.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html` | Conteúdo e formulário |
| `style.css` | Estilos e responsividade |
| `assets/js` | Interface e agendamento |
| `assets/images` | Fotos e identidade visual |
| `CNAME` | Domínio configurado para publicação |

## Sobre o trabalho

Projeto de presença digital para um negócio local, reunindo apresentação das modalidades, experiência mobile e captação de interessados em aulas experimentais.

**Desenvolvimento:** [Victor Hugo Miranda · Victor Tech](https://github.com/victor-7-7-7).
