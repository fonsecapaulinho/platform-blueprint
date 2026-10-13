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

- `/login`: acesso separado para aluno ou professor, com campos de e-mail e senha, validação e feedback.
- `/recuperar-conta`: solicitação e confirmação; o envio de código será integrado posteriormente.
- `/redefinir-senha`: prévia com campo para código e nova senha; não valida o código nem altera uma conta.
- `/acesso-demo`: final ilustrativo do login. É uma página pública, não um dashboard protegido.
- Página 404, alternância entre PT-BR e EN-US, componentes reutilizáveis e tokens do design system.

O foco é layout e componentes. Google OAuth, cadastro, banco, API, dashboard, persistência e testes automatizados não foram adicionados. O mock de autenticação é interno e não exibe credenciais de acesso na interface.

Os formulários não enviam dados pela rede nem os salvam em cookies ou local/sessionStorage. A recuperação não envia e-mail; o código é validado apenas quanto ao formato na tela de prévia. O mock não representa segurança, sessão ou autorização.

## Estrutura

```text
src/
  app/                    Rotas, metadados, layout raiz e página 404
    (auth)/               Layout compartilhado de acesso
  components/
    auth/                 AuthShell, seletor de idioma e contexto PT-BR/EN-US
    brand/                Marca tipográfica provisória
    ui/                   Button, TextField, PasswordField, Feedback e Icon
  features/auth/          Formulários, validação, mock e traduções junto aos formulários
  styles/tokens.css       Cores, tipografia, espaçamento e acabamento
docs/
  DESIGN_SYSTEM.md         Decisões de design e composição
  SECURITY_AND_SCOPE.md    Limites do mock e integração futura
  DELIVERY.md              Verificações e escopo da entrega
```

## Dependências

Runtime: **Next.js 16.4.0, React 19.3.0 e React DOM 19.3.0**. Desenvolvimento: TypeScript 5.9.3 e tipos de Node/React. As versões estão fixadas no manifesto e no lockfile.

Sem Tailwind, biblioteca de componentes, ícones externos, biblioteca de formulários, gerenciador global de estado, analytics ou cliente HTTP adicional. CSS Modules e HTML nativo atendem esta etapa com poucas dependências. Cada componente mantém seus textos PT-BR/EN-US em um arquivo `.translations.ts` co-localizado para facilitar manutenção.

## Próximos passos

1. Revisar identidade, conteúdo e layout com o cliente.
2. Refinar componentes com base na revisão.
3. Integrar o envio e a validação do código de recuperação com expiração e uso único.
4. Substituir o contrato mock por integração segura, adicionar autorização no servidor e testes dos fluxos acordados.

As páginas continuam pré-renderizadas pelo Next.js. O seletor de idioma, os formulários e os controles de senha usam interatividade no cliente, sem transformar o conteúdo inteiro em Client Component.
