# Onboarding seguro (v2 — link com dupla validade)

Um link/QR por colaborador, com duas partes que se comportam de formas diferentes:

- **Credenciais** (login/senha da máquina e e-mail, Adobe, outras informações) — visíveis
  por 24h ou 48h (você escolhe na hora de gerar). Depois disso, somem da página sozinhas.
- **Conteúdo fixo** (passo a passo de impressora, como abrir chamado no SoloApp, ferramentas
  de trabalho, contato da Recepção) — sempre disponível, no mesmo link, para sempre. Não
  depende do banco de dados nem de criptografia: fica direto no código da página.

Isso permite, por exemplo, colocar o QR code gerado no wallpaper de cada máquina: passado o
prazo, o QR continua útil (mostra o conteúdo de apoio), só a senha some.

## Como funciona

1. TI entra em `/admin`, faz login e preenche o formulário de onboarding.
2. As credenciais são criptografadas no navegador (AES-256-GCM) antes de qualquer coisa sair
   da máquina do TI — o servidor nunca vê texto puro.
3. O TI recebe um link `https://seudominio.com/view/AbC123#chaveDeDescriptografia`.
4. Quando alguém abre o link:
   - O servidor sempre devolve o conteúdo cifrado das credenciais **se ainda estiver dentro
     do prazo escolhido** (24h/48h). Passado o prazo, ele simplesmente não devolve mais essa
     parte — a página mostra só o conteúdo fixo.
   - O conteúdo fixo (impressora, SoloApp, ferramentas, Recepção) é renderizado sempre,
     independente do prazo — está embutido na própria página, não no banco de dados.
5. **O link não é de uso único**: pode ser escaneado várias vezes durante a janela de 24h/48h
   (bom para um QR fixo no wallpaper, que a pessoa pode escanear mais de uma vez ao configurar
   a máquina).

## Stack

- Next.js 14 (App Router) + TypeScript
- Upstash Redis — guarda só a parte de credenciais (cifrada), com uma limpeza automática de
  90 dias (isso é só faxina; a validade "de verdade" das credenciais é a de 24h/48h)
- Hospedagem recomendada: Vercel

## Variáveis de ambiente

| Variável | O que é |
|---|---|
| `ADMIN_PASSWORD` | Senha da equipe de TI para entrar em `/admin` |
| `ADMIN_SECRET` | String aleatória longa, usada para assinar o cookie de sessão |
| `UPSTASH_REDIS_REST_URL` | URL do banco Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token do banco Upstash Redis |
| `NEXT_PUBLIC_RECEPCAO_WHATSAPP` | Número de WhatsApp da Recepção (formato `55DDDNUMERO`), usado no botão de ajuda |

## Rodando localmente

```bash
npm install
cp .env.example .env.local
# edite o .env.local
npm run dev
```

## Editando o conteúdo fixo

Tudo fica em `lib/fixedContent.ts` (os textos) e `lib/FixedContent.tsx` (a exibição). Como
não depende do banco, basta editar esses arquivos e fazer um novo deploy — não afeta
credenciais que já estejam ativas.

## Sobre o wallpaper com QR code

Como o link não expira por completo (só a parte de credenciais), o mesmo QR pode ser
composto no wallpaper de cada máquina no momento do onboarding. Depois de 24h/48h, quem
escanear esse QR ainda vê o conteúdo de apoio — só não vê mais a senha antiga.
