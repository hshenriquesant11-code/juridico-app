# Arquitetura — Plataforma Jurídica SaaS

## Estado deste repositório

Este documento descreve o destino arquitetural e diferencia itens implementados dos planejados. Atualmente o projeto contém a interface da Sprint 1 (com rotas, camada de repositório de demonstração e configuração de PWA/Capacitor). Login, banco, isolamento entre organizações, Storage, auditoria e integrações ainda não foram implementados; dados exibidos no painel são fictícios.

## Estrutura de código atual

`src/app` (rotas e provedores) → `src/features/*` (telas por módulo) → `src/repositories` (dados; hoje fictícios) → `src/lib/supabase` (SDK, quando configurado). Componentes compartilhados ficam em `src/components`. Regras de validação (Zod) ficam junto da feature; as regras críticas definitivas devem ser repetidas no banco/servidor na Sprint 2.

## Camadas propostas

- **Apresentação:** React, componentes reutilizáveis, rotas e formulários acessíveis.
- **Aplicação:** casos de uso e regras de negócio, com validações explícitas.
- **Dados:** repositórios tipados para PostgreSQL e Storage via Supabase.
- **Infraestrutura:** Auth, Edge Functions, criptografia, auditoria e serviços externos.

Regras críticas e permissões deverão ser validadas no banco/servidor e nunca depender somente da interface.

## Multi-tenancy e dados

Cada entidade de negócio deverá incluir `organization_id`. Chaves estrangeiras compostas deverão garantir que cliente, processo, tarefa e documento pertençam à mesma organização. RLS deve negar por padrão e verificar a associação do usuário autenticado. A cobertura de RLS será testada com pelo menos duas organizações e usuários, incluindo tentativas de alterar identificadores na requisição.

Não confiar em `organization_id` fornecido pelo navegador como autorização. Não expor `service_role`. Não persistir CPF real antes de backend, chaves gerenciadas e criptografia autenticada estarem configurados.

## Documentos

Storage privado, autorização por organização, nomes de objetos aleatórios, validação no servidor, trilha de auditoria e links assinados curtos. Antivírus e backup de objetos precisam ser definidos antes de uso com dados reais.

## Mobile e PWA

PWA (manifesto e ícones) e Capacitor (`capacitor.config.ts`) estão configurados, mas **não há service worker nem cache offline**, por decisão de segurança: respostas da API e documentos não podem ficar em cache do aparelho. As plataformas nativas (`android/`, `ios/`) ainda não foram geradas e o `appId` é provisório. Armazenamento seguro de credenciais (Keystore/Keychain), bloqueio de sessão e reautenticação pertencem à Sprint 8. O app deve consumir a mesma API e as mesmas políticas de autorização; não manter cópias locais de documentos confidenciais.

## Hospedagem web

`public/_headers` define CSP restritivo (scripts e estilos apenas do próprio domínio e Google Fonts; `connect-src` já liberado para `*.supabase.co`, a ser restrito ao projeto real), HSTS, `X-Content-Type-Options`, `frame-ancestors 'none'` e demais cabeçalhos. `public/_redirects` devolve `index.html` para rotas do SPA. Esses arquivos funcionam em Netlify e Cloudflare Pages; **não foram testados em um deploy real**.

## Ambientes

Development e staging usam dados fictícios/sintéticos e credenciais próprias. Production precisa de chaves e políticas independentes, MFA, backups testados, monitoramento e revisão de segurança. Nunca reutilizar credenciais entre ambientes.

## Próximas decisões e bloqueios externos

1. Criar projeto Supabase isolado para desenvolvimento.
2. Revisar/aplicar migrations e validar RLS sob papéis reais.
3. Definir organização/membership e fluxo de onboarding.
4. Só depois conectar CRUD. CPF e documentos reais exigem desenho e validação criptográfica, operacional e jurídica específicos.
5. Confirmar provedores, retenção, backups e resposta a incidentes antes de produção.
