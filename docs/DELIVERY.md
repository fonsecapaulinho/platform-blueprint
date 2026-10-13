# Registro da entrega · 13/10/2026

## Escopo

BLUEPRINT app using Next.js App Router, strict TypeScript, CSS Modules, and an English (US)-only interface. Includes Google login and sign-up through Auth.js, JWT sessions, and a protected `/dashboard` destination. Email sign-up at `/sign-up` and `/complete-sign-up` is a visual preview; the database, account lookup, code delivery/verification, and user creation are not connected.

Fluxos de recuperação em `/forgot-password`, `/verify-code` e `/reset-password` permanecem prévias, sem envio ou validação de código.

## Verificações

- `npm run build`: concluído; rotas de OAuth, login, cadastro e dashboard compiladas.
- `npm run typecheck`: concluído sem erros.
- `npm audit --omit=dev`: zero vulnerabilidades reportadas.
- `/api/auth/providers`: retornou o provider Google quando testado com credenciais locais fictícias.
- `/dashboard`: redireciona para `/sign-in` sem sessão.
- OAuth real não foi concluído: faltam as credenciais de um cliente Google pertencente ao proprietário do projeto.

As verificações de build/tipos não são testes automatizados. Nenhuma credencial OAuth real foi adicionada ao repositório.

## Revisão visual e funcional

- Login revisado em viewport mobile 320 × 568, sem rolagem.
- Focused fields highlight their green border without an additional ring.
- Cadastro por e-mail permite seguir da identidade à etapa de código e ao formulário final em `/complete-sign-up`, com nome/e-mail preenchidos; os dados de prévia ficam no `sessionStorage` da aba. Não há link de e-mail ativo e a interface avisa que não envia/valida códigos nem cria conta.
- Date of birth uses the native control's US English presentation; country of origin is a localized country list.
- A tela de cadastro permite selecionar aluno/professor; a escolha acompanha o início de cadastro Google.
- O ícone oficial multicolorido do Google aparece nos botões de login e cadastro.
- Auxiliary copy removed as requested; sign-in verified without scrolling at 320 × 568. Detailed sign-up is split into steps.
- Google buttons display an English setup message when OAuth variables are missing.
- Cadastro com Google usa o mesmo provider OAuth, com retorno à área `/dashboard`.

Não é uma execução de suíte automatizada, medição Lighthouse, auditoria completa de acessibilidade ou teste em dispositivo físico.

## OAuth Google

Copie `.env.example` para `.env.local`, preencha os segredos e configure o callback URI no Google Cloud Console. Consulte as instruções no README. Para produção, use o gerenciador de secrets da hospedagem.

## Pacote

O ZIP inclui código-fonte, `package-lock.json`, `.env.example`, configuração e documentação. Exclui `node_modules`, `.next`, Git, `.env.local` e arquivos temporários. Execute `npm ci` após extrair o ZIP.
