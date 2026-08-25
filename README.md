# Onboarding seguro FutureBrand

Um link e QR Code por colaborador, reunindo credenciais temporárias e orientações para o primeiro acesso.

## Como funciona

1. O TI entra em `/admin`, faz login e preenche o formulário de onboarding.
2. As credenciais são criptografadas no navegador com AES-256-GCM antes de saírem da máquina do TI.
3. O sistema gera um link no formato `https://seudominio.com/view/identificador#chave` e seu QR Code.
4. O colaborador consulta a senha temporária, altera a senha corporativa e segue o registro no Microsoft Entra.
5. O mesmo link também apresenta orientações sobre impressora, SoloApp, ferramentas e canais de atendimento.

O link não é de uso único e não possui vencimento automático. As credenciais continuam cifradas no Redis e só
podem ser abertas por quem possui o link completo, incluindo a chave que aparece depois de `#`.

## Stack

- Next.js 14 (App Router) e TypeScript
- Upstash Redis para armazenar as credenciais cifradas
- Vercel para hospedagem

## Variáveis de ambiente

| Variável | O que é |
|---|---|
| `ADMIN_PASSWORD` | Senha da equipe de TI para entrar em `/admin` |
| `ADMIN_SECRET` | String aleatória longa usada para assinar o cookie de sessão |
| `UPSTASH_REDIS_REST_URL` | URL do banco Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token do banco Upstash Redis |
| `NEXT_PUBLIC_RECEPCAO_WHATSAPP` | WhatsApp da Recepção no formato `55DDDNUMERO` |

## Rodando localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Conteúdo fixo

Os textos ficam em `lib/fixedContentData.ts` e a exibição em `lib/FixedContent.tsx`. O guia de alteração e
sincronização de senha fica em `lib/PasswordRegistrationGuide.tsx`.
