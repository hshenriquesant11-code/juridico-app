# Como rodar o site e o app

> **Leia isto primeiro:** hoje o projeto é uma **demonstração navegável com dados fictícios**. Não existem login, banco de dados nem cadastro real de clientes (isso começa na Sprint 2). Por isso, **não publique nem digite dados reais de clientes**. Um site publicado nesta fase pode ser aberto por qualquer pessoa que tenha o link.

Os passos abaixo foram escritos para o Windows (PowerShell). Os comandos de qualidade (`lint`, `test`, `build`) foram executados e aprovados; as etapas de **publicação do site, Android e iOS não puderam ser testadas** no ambiente em que o código foi preparado, então siga-as com atenção e me avise se algo divergir.

---

## 1. Rodar o site no seu computador

1. Confirme a versão do Node.js (precisa ser **20.19 ou superior**, ou 22.12+):

   ```powershell
   node -v
   ```

   Se for mais antiga, instale a versão LTS em https://nodejs.org.

2. Substitua os arquivos do projeto pelos do zip novo (extraia por cima de `C:\Users\hshen\juridico-app`). Se você tiver um arquivo `.env.local`, ele deve ser mantido.

3. Instale as dependências e inicie:

   ```powershell
   cd C:\Users\hshen\juridico-app
   npm ci
   npm run dev
   ```

4. Abra o endereço **Local** que aparece no terminal (normalmente http://localhost:5173).

**Ver no celular (mesmo Wi‑Fi do computador):**

```powershell
npm run dev -- --host
```

Abra no celular o endereço **Network** mostrado no terminal. Se o Windows perguntar sobre o firewall, permita redes privadas.

**Verificar a qualidade do código:**

```powershell
npm run lint
npm run test
npm run build
```

---

## 2. Publicar o site na internet (HTTPS)

O projeto já inclui `public/_headers` (cabeçalhos de segurança, CSP) e `public/_redirects` (rotas do aplicativo), que **Netlify** e **Cloudflare Pages** entendem.

**Forma mais simples (Netlify, sem Git):**

1. Rode `npm run build`. Será criada a pasta `dist`.
2. Acesse https://app.netlify.com/drop e arraste a pasta `dist`.
3. A Netlify devolve um endereço `https://...netlify.app`.

**Forma recomendada para o futuro (com GitHub):** conecte o repositório e use _Build command_ `npm run build` e _Publish directory_ `dist`.

Depois de publicado, confira: as páginas abrem ao recarregar em `/clientes` (sem erro 404) e o aviso "Ambiente de demonstração" aparece.

**Instalar como aplicativo (PWA):** no Chrome/Edge (Android ou computador) use "Instalar app". No iPhone, abra no Safari → Compartilhar → "Adicionar à Tela de Início". O PWA desta fase **não guarda dados nem funciona offline**, de propósito (a especificação proíbe cache de dados jurídicos no aparelho).

---

## 3. App Android (Capacitor)

O Capacitor "embrulha" o site em um aplicativo nativo. Já está instalado e configurado (`capacitor.config.ts`); a pasta `android/` ainda **não foi gerada**.

**Pré‑requisito:** instalar o [Android Studio](https://developer.android.com/studio) (ele inclui o Android SDK e o JDK).

```powershell
npm run build
npx cap add android      # só na primeira vez; cria a pasta android/
npm run cap:android      # compila, sincroniza e abre o Android Studio
```

No Android Studio: aguarde o "Gradle sync" terminar, conecte um celular com **depuração USB** ativada (ou crie um emulador em _Device Manager_) e clique em **Run ▶**. Se o emulador não funcionar no seu computador (Windows ARM), use um celular físico.

**Antes de publicar na Play Store**, troque `appId` em `capacitor.config.ts` (hoje `com.example.clara`, provisório) pelo identificador definitivo, por exemplo `br.com.seudominio.clara`. Depois de publicado, ele não pode mudar. A Play Store exige conta de desenvolvedor Google (pagamento único; confirme o valor vigente no site do Google).

Quando alterar o código do site, repita `npm run cap:sync` para levar a mudança ao app.

---

## 4. App iPhone (iOS)

O iOS **só pode ser compilado em um Mac** com Xcode. No Windows isso não é possível. Opções:

- Usar um Mac (seu, emprestado ou alugado na nuvem) e, nele, rodar `npx cap add ios`, `npm run cap:sync` e `npx cap open ios`.
- Usar um serviço de build em nuvem com Mac (ex.: Codemagic ou Xcode Cloud).
- Enquanto isso, usar a instalação PWA pelo Safari (seção 2).

Publicar na App Store exige o Apple Developer Program (assinatura anual; confirme o valor no site da Apple).

---

## 5. O que você, como proprietário, precisa providenciar

| Item                                                                   | Para quê                                      | Quando               |
| ---------------------------------------------------------------------- | --------------------------------------------- | -------------------- |
| Projeto Supabase **de desenvolvimento** (supabase.com)                 | Banco, login, arquivos                        | Sprint 2             |
| Anotar apenas a **URL** e a **publishable key** do projeto             | Preencher `.env.local` (nunca `service_role`) | Sprint 2             |
| Decidir a região do Supabase                                           | Latência e requisitos de LGPD                 | Sprint 2             |
| Serviço de chaves (KMS) escolhido                                      | Criptografar CPF antes de gravar CPF real     | Antes de dados reais |
| Orientação jurídica sobre LGPD (base legal, contrato com fornecedores) | Exigido pela especificação                    | Antes de produção    |
| Domínio próprio                                                        | Endereço definitivo + HTTPS                   | Sprint 10            |
| Identificador definitivo do app (`appId`)                              | Lojas de aplicativos                          | Sprint 8             |
| Contas Google Play e Apple Developer                                   | Publicar os apps                              | Sprint 8/10          |
| Contrato/avaliação do provedor de IA                                   | Enviar qualquer dado a um provedor externo    | Sprint 7             |
| Solução de antivírus para uploads e destino dos backups                | Documentos e continuidade                     | Sprint 5/9           |

## 6. Problemas comuns

- **`npm ci` falha ou reclama da versão:** confira `node -v` (seção 1).
- **Porta ocupada:** o Vite escolhe outra porta e mostra no terminal; use a exibida.
- **Página em branco no site publicado:** confirme que publicou a pasta `dist` (e não a pasta do projeto).
- **Ícone/nome do app:** os ícones atuais (`public/icon-*.png`) são provisórios e precisam ser substituídos pela identidade visual definitiva.
