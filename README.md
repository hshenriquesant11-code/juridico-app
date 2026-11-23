# Clara — Plataforma Jurídica Previdenciária

Interface inicial de um SaaS para apoiar a rotina de escritórios de Direito Previdenciário. O estágio atual é a Sprint 1 concluída: aplicação responsiva com rotas reais, camada de dados de demonstração, PWA e Capacitor configurados. Não há autenticação, CRUD, consultas ao Supabase, notificações ou cálculos jurídicos conectados.

> **Demonstração:** todos os nomes, contagens, tarefas e eventos da interface são dados fictícios. Não inserir dados de clientes neste protótipo.

## Requisitos locais

- Node.js `>=20.19.0` (Vite 8 requer Node 20.19+ ou 22.12+).
- npm `>=10`.

Versões usadas nesta auditoria: Node `v26.13.1`, npm `11.20.0`. O projeto existente usa React 19, TypeScript 6, Vite 8 e ESLint 10; dependências estão fixadas pelo `package-lock.json`.

## Instalar e rodar

```powershell
cd C:\Users\hshen\juridico-app
npm ci
npm run dev
```

Abra a URL `Local` mostrada pelo Vite no terminal. Comandos de qualidade:

```powershell
npm run build
npm run lint
npm run test
npm run format:check
```

> **Para rodar o site e o app (Windows, publicação, Android/iOS), veja [`docs/COMO-RODAR.md`](docs/COMO-RODAR.md).**

## Ambiente Supabase (preparação)

`src/lib/supabase/client.ts` cria o cliente somente quando as variáveis públicas estão configuradas. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` usando os valores públicos do projeto de desenvolvimento.

Não use nem exponha `service_role` no navegador. O cliente ainda não é usado pelo dashboard e a configuração de variáveis não implementa autenticação, autorização ou banco.

## Estrutura nesta etapa

- `src/app/`: `App.tsx`, `router.tsx` (rotas), `navigation.ts` e `providers/` (TanStack Query, cache só em memória).
- `src/components/`: `layout/` (AppShell, páginas "não implementado"/404), `ui/` (Icon, DemoBanner), `data-display/`.
- `src/features/`: `dashboard/` (painel) e `leads/` (formulário validado com React Hook Form + Zod; não grava nada).
- `src/repositories/demoRepository.ts`: dados fictícios; será substituído por consultas Supabase na Sprint 2.
- `src/styles/`: `app.css` (painel), `demo-banner.css`, `index.css` e `tailwind.css` (Tailwind sem reset global, para preservar o visual existente).
- `src/lib/supabase/client.ts`: inicialização opcional do SDK com chave pública.
- `src/test/`: testes de interface, rotas, formulário, schema e cliente Supabase.
- `public/`: `manifest.webmanifest` e ícones (PWA), `_headers` (CSP e cabeçalhos de segurança) e `_redirects` (rotas do SPA).
- `capacitor.config.ts`: configuração do app nativo (`appId` provisório).
- `docs/ARCHITECTURE.md`, `docs/COMO-RODAR.md`: arquitetura alvo e guia de execução.

## Estado e limites

Concluído nesta sprint: shell desktop/celular, rotas reais com páginas marcadas como "ainda não implementado", menu responsivo e acessível, indicadores e listas fictícias via camada de repositório, formulário de lead validado, PWA instalável (sem cache de dados), Capacitor configurado, cabeçalhos de segurança e CSP para hospedagem, e testes automatizados.

Ainda pendente: Supabase Auth, organizações, migrations, RLS, CRUD, Storage privado, auditoria real, MFA, criptografia com KMS, plataformas nativas (`android/` e `ios/` ainda não geradas; veja `docs/COMO-RODAR.md`), backups, validação jurídica/privacidade, testes RLS e E2E (Playwright). O build verde da interface não indica prontidão para produção.

## Próximo sprint

Sprint 2 deve começar com um projeto Supabase de desenvolvimento, migrations revisadas, membership de organizações, RLS testada sob dois tenants e fluxo de autenticação. Só então conectar as telas ao backend; nenhum dado real deve ser usado no desenvolvimento inicial.
