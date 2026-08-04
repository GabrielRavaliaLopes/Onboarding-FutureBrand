// Conteúdo fixo: igual para todo mundo, nunca expira, não passa pela
// criptografia nem pelo banco — fica direto no código, então sempre existe,
// mesmo que o Redis esteja fora do ar ou o registro do onboarding já tenha
// sido limpo por faxina.

export const TEXTO_IMPRESSORA = [
  "A impressora já está configurada em sua máquina.",
  "Para utilizar, digite o comando Command + P no arquivo desejado.",
  'Selecione a impressora chamada "Office".',
  "Clique em Imprimir.",
];

export const TEXTO_SOLOAPP_PASSOS = [
  'Em seu computador, procure por "SoloApp" na barra de pesquisa do Windows ou no Launchpad do Mac.',
  "Ao abrir, há um campo onde você pode digitar o problema ou a dúvida que está tendo.",
  'Caso esteja em casa e precise de acesso remoto à sua máquina, procure pelo aplicativo "TeamViewer".',
  'Abra o TeamViewer e copie o "ID" e a "Senha". Importante: para conseguirmos acessar sua máquina, você precisa deixar o aplicativo aberto.',
  'Adicione essas informações no campo do chamado e clique em "Enviar Ticket".',
];

export const TEXTO_SOLOAPP_IMPORTANTE =
  "Ao final de cada atendimento, enviamos uma avaliação para o seu e-mail. É importante " +
  "que você avalie, para conseguirmos evoluir nosso atendimento cada vez mais. Para " +
  "avaliar, basta clicar no link que será enviado por e-mail.";

export const FERRAMENTAS = [
  { titulo: "Comunicação e compartilhamento de arquivos entre a equipe", valor: "Teams, OneDrive e SharePoint" },
  { titulo: "Ferramentas de trabalho na FutureBrand", valor: "Outlook, Word, PowerPoint e Excel" },
];

export const TEXTO_AJUDA =
  "Se precisar de ajuda e o TI ou Administrativo não estiver disponível, fale com a Recepção.";
