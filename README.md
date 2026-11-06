# BLUEPRINT · autenticação e telas de acesso

Base Next.js para revisar o layout de acesso da plataforma BLUEPRINT. A interface segue uma composição compacta e centralizada para autenticação, com inspiração geral em produtos de aprendizagem de idiomas. Não usa imagens, marca ou código do Twee.

## Executar

Node.js 24 LTS recomendado (mínimo declarado no projeto: 22). npm acompanha o Node.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. A raiz redireciona para `/sign-in`.

```sh
npm run typecheck
npm run build
npm start
```

Para login Google, configure as variáveis descritas em “Configurar Google OAuth”. Sem OAuth configurado, as telas de e-mail/senha continuam disponíveis no modo mock. O ZIP contém código e lockfile; `node_modules` e `.next` são gerados localmente e não acompanham a entrega.

## O que está pronto

- `/sign-in`: acesso separado para aluno ou professor, com campos de e-mail e senha, validação e feedback.
- `/sign-up`: coleta nome/e-mail e permite escolher aluno/professor; inclui alternativa Google. O fluxo por e-mail é uma prévia navegável: não consulta contas, envia/valida códigos nem cria usuários.
- `/complete-sign-up`: etapa de código e formulário final com nome/e-mail preenchidos, data de nascimento, país de origem, senha e confirmação. A prévia só carrega os dados da sessão iniciada em `/sign-up`; não existe link de e-mail ativo até integrar o backend.
- `/forgot-password`: solicitação do código de recuperação por e-mail.
- `/verify-code`: tela separada para informar o código de recuperação.
- `/reset-password`: tela para criar e confirmar uma nova senha, após a etapa de código.
- `/demo-access`: final ilustrativo do login mock.
- `/dashboard`: área de destino protegida pela sessão Google.
- English (US) interface, 404 page, reusable components, and design-system tokens.

O login/cadastro Google usa Auth.js e sessão JWT assinada em cookie. O acesso Google precisa de um projeto OAuth do Google configurado no ambiente da aplicação; consulte “Configurar Google OAuth” abaixo. Cadastro por e-mail, banco de dados e persistência de perfis ainda não estão conectados. O rascunho de nome/e-mail/perfil da prévia é mantido apenas em `sessionStorage` da aba para preencher a etapa final; não armazena senha ou código. O perfil escolhido na tela de cadastro ainda não representa autorização nem é salvo em banco. O mock de e-mail/senha é interno e não exibe credenciais de acesso na interface.

O OAuth envia o usuário ao Google e cria uma sessão de aplicação após o callback. Os formulários de e-mail/senha e cadastro não estão conectados a um backend. A recuperação e a verificação do código são apenas prévias: não há envio de e-mail nem validação real do código. A redefinição também não altera a senha.

### Configurar Google OAuth

1. Crie um OAuth Client ID do tipo **Web application** no Google Cloud Console.
2. Cadastre `http://localhost:3000/api/auth/callback/google` como **Authorized redirect URI**. Em produção, cadastre também `https://SEU-DOMINIO/api/auth/callback/google`.
3. Copie `.env.example` para `.env.local`, preencha `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` com as credenciais desse cliente e defina `AUTH_SECRET` com um valor aleatório seguro (`npx auth secret`).
4. Reinicie o servidor Next.js. Em produção, defina as mesmas variáveis no gerenciador de secrets do provedor de hospedagem; nunca as publique no repositório.

Sem essas credenciais, o botão Google informa que a integração precisa de configuração. O cadastro por Google cria uma sessão autenticada, mas contas, perfis e permissões ainda não são persistidos em banco de dados.

## Estrutura

```text
src/
  app/                      Next.js App Router: routes, layouts, metadata, API
  features/
    auth/                   Sign-in/up, recovery, dashboard, validation, actions
    demo-access/            Demo sign-in feature
    not-found/              Not-found feature
  shared/
    brand/                  BLUEPRINT and Google brand marks
    layout/                 Auth shell, locale provider, skip link
    styles/                 Design tokens
    ui/                     Reusable form and feedback controls
.vscode/
  settings.json             Hide generated output and local-only files
docs/                       Design, delivery, and security documentation
```

The project uses a feature-based architecture adapted to Next.js App Router: `app` owns routing, `features` own user-facing flows and their behavior, and `shared` contains reusable presentation modules. NextAuth configuration stays in the repository-root `auth.ts`, following the framework's conventional entry point. `.vscode/settings.json` hides generated/dependency output and local environment files in Explorer and search; it does not hide source files.

## Dependencies

Runtime: **Next.js 16.4.0, React 19.3.0, React DOM 19.3.0 e Auth.js 5.0.0-beta.32**. Desenvolvimento: TypeScript 5.9.3 e tipos de Node/React. As versões estão fixadas no manifesto e no lockfile.

Sem Tailwind, biblioteca de componentes, ícones externos, biblioteca de formulários, gerenciador global de estado, analytics ou cliente HTTP adicional. Auth.js atende ao OAuth Google com uma dependência. CSS Modules e HTML nativo atendem a interface. Cada componente mantém seus textos em inglês (EUA) em um arquivo `.translations.ts` co-localizado para facilitar manutenção.

## Next steps

1. Revisar identidade, conteúdo e layout com o cliente.
2. Refinar componentes com base na revisão.
3. Persistir usuários, perfis e papéis (aluno/professor) em um banco de dados.
4. Integrar cadastro por e-mail e envio/validação do código de recuperação com expiração e uso único.

Pages remain prerendered by Next.js where possible. Forms and password controls use client interactivity without turning the entire page into a Client Component.
