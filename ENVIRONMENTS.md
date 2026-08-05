# Fluxo de ambientes

## Desenvolvimento / homologação

- Branch: `develop`
- Cada push gera um Preview Deployment separado na Vercel.
- Use este ambiente para testar layout, textos e funcionalidades.
- Não use dados ou credenciais reais durante os testes.

## Produção

- Branch: `main`
- Domínio: https://onboarding2-bice.vercel.app/
- Recebe apenas alterações revisadas e aprovadas.

## Publicação recomendada

1. Trabalhe na branch `develop`.
2. Envie as alterações e valide o Preview Deployment da Vercel.
3. Abra um pull request de `develop` para `main`.
4. Revise e teste o preview.
5. Faça o merge somente quando estiver aprovado.
