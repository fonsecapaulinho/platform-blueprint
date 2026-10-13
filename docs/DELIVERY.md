# Registro da entrega · 13/10/2026

## Escopo

Aplicação BLUEPRINT com Next.js App Router, TypeScript estrito, CSS Modules e traduções PT-BR/EN-US. Inclui login e início de cadastro Google com Auth.js, sessão JWT e destino `/dashboard` protegido. O cadastro por e-mail, banco de dados, perfis e papéis não estão conectados.

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
- Campos mantêm foco visível cinza neutro; a borda/foco roxo foi removida.
- Cadastro por e-mail valida os campos no cliente e informa claramente que não cria conta sem backend.
- Botões Google exibem instrução localizada quando as variáveis OAuth não estão configuradas.
- Cadastro com Google usa o mesmo provider OAuth, com retorno à área `/dashboard`.

Não é uma execução de suíte automatizada, medição Lighthouse, auditoria completa de acessibilidade ou teste em dispositivo físico.

## OAuth Google

Copie `.env.example` para `.env.local`, preencha os segredos e configure o callback URI no Google Cloud Console. Consulte as instruções no README. Para produção, use o gerenciador de secrets da hospedagem.

## Pacote

O ZIP inclui código-fonte, `package-lock.json`, `.env.example`, configuração e documentação. Exclui `node_modules`, `.next`, Git, `.env.local` e arquivos temporários. Execute `npm ci` após extrair o ZIP.
