# Fonseca Learning · primeira entrega

Base Next.js para revisar o layout de acesso da plataforma. Interface em português, inspirada na composição dos prints do Twee, com identidade visual própria e provisória da Fonseca. Não usa imagens, marca ou código do Twee.

## Executar

Node.js 24 LTS recomendado (mínimo declarado no projeto: 22). npm acompanha o Node.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. A raiz redireciona para `/login`.

```sh
npm run typecheck
npm run build
npm start
```

Não é preciso configurar variáveis de ambiente. O ZIP contém código e lockfile; `node_modules` e `.next` são gerados localmente e não acompanham a entrega.

## O que está pronto

- `/login`: campos de e-mail e senha, mostrar/ocultar senha, validação, processamento e erro de credenciais.
- `/recuperar-conta`: solicitação e confirmação genérica, sem envio de e-mail.
- `/redefinir-senha`: prévia pública para criar/confirmar uma senha fictícia; não altera conta alguma.
- `/acesso-demo`: final ilustrativo do login. É uma página pública, não um dashboard protegido.
- Página 404, estrutura responsiva, componentes reutilizáveis e tokens do design system.

O foco é layout e componentes. Google OAuth, cadastro, escolha de papel, banco, API, dashboard, persistência e testes automatizados não foram adicionados.

## Experimentar o mock

| Campo | Valor fictício |
| --- | --- |
| E-mail | `aluno@example.com` |
| Senha | `Demo123!` |

Outros dados produzem erro de login. A recuperação aceita qualquer e-mail válido e sempre usa a mesma confirmação. A redefinição valida 8–128 caracteres e igualdade, mas **não muda a senha do mock**. Não use credenciais pessoais. Há um atraso de 650 ms apenas para demonstrar o carregamento.

Nada é enviado por rede pelos formulários, salvo em cookies ou gravado em local/sessionStorage. As credenciais acima são públicas por definição. O mock não representa segurança, sessão ou autorização.

## Estrutura

```text
src/
  app/                    Rotas, metadados, layout raiz e página 404
    (auth)/               Layout compartilhado de acesso
  components/
    auth/                 AuthShell, AuthCard, FormHeader e composição visual
    brand/                Marca tipográfica provisória
    ui/                   Button, TextField, PasswordField, Feedback e Icon
  features/auth/          Formulários, validação e contrato/mock de autenticação
  styles/tokens.css       Cores, tipografia, espaçamento e acabamento
docs/
  DESIGN_SYSTEM.md         Decisões de design e composição
  SECURITY_AND_SCOPE.md    Limites do mock e integração futura
  DELIVERY.md              Verificações e escopo da entrega
```

## Dependências

Runtime: **Next.js 16.4.0, React 19.3.0 e React DOM 19.3.0**. Desenvolvimento: TypeScript 5.9.3 e tipos de Node/React. As versões estão fixadas no manifesto e no lockfile.

Sem Tailwind, biblioteca de componentes, ícones externos, biblioteca de formulários, gerenciador global de estado, analytics ou cliente HTTP adicional. CSS Modules e HTML nativo atendem esta etapa com poucas dependências.

## Próximos passos

1. Revisar identidade, conteúdo e layout com o cliente.
2. Refinar componentes com base na revisão.
3. Introduzir testes Cypress dos fluxos acordados, em etapa própria.
4. Substituir o contrato mock por integração segura; adicionar recuperação por token e autorização no servidor.

As páginas são pré-renderizadas pelo Next.js; somente formulários e comportamento de senha precisam de interatividade no cliente. Evite transformar o layout inteiro em Client Component.
