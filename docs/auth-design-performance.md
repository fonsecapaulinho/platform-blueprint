# Auth: design, segurança e performance

Baseline: commit `3d41ca8`, build de produção antes de alterar o código. Comparação local em `next build` + `next start`, porta 3101. Lighthouse 13.5.0, Edge/Chromium 155, Windows, cache de navegador novo em cada execução, uma execução por rota/perfil. Mobile: emulação 412 × 823, CPU 4×, RTT 150 ms, throughput 1638,4 Kbps; desktop: preset desktop oficial do Lighthouse. Os JSONs preservam a configuração exata, timestamps e ambiente. Baseline coletado em 14/10/2026; comparação em 15/10/2026 após a retomada do trabalho, no mesmo host e com a mesma versão do navegador. São amostras de laboratório, não medianas nem dados de produção pública. Oscilações pequenas de LCP/TBT não provam melhoria ou regressão isolada.

A nota próxima de 50 não foi reproduzida: baseline mobile 97–99, final 98–99; desktop 100 nos dois. A meta acima de 90 foi atingida em todas as rotas públicas medidas. `/dashboard` exige sessão Google e não foi auditada como área autenticada. `/complete-sign-up` foi medida em acesso direto sem draft; o fluxo com draft foi validado nos testes de navegador. INP: indisponível sem coleta de interações/dados de campo; TBT abaixo é métrica de laboratório, não substituto numérico de INP.

## Antes → depois

JS/CSS são KiB transferidos (medida Lighthouse, incluindo overhead de transporte). Requisições incluem documento, assets e prefetch. LCP em segundos; TBT em milissegundos. Os JSONs também registram `decodedJS`/`decodedCSS`, em bytes descomprimidos.

| Rota | Perfil | Nota | LCP (s) | CLS | TBT (ms) | JS (KiB) | CSS (KiB) | Requisições |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| sign-in | mobile | 99 → 98 | 2.121 → 2.227 | 0.0000 → 0.0000 | 51.5 → 96.0 | 157.5 → 152.3 | 4.26 → 4.36 | 19 → 14 |
| sign-in | desktop | 100 → 100 | 0.490 → 0.510 | 0.0000 → 0.0000 | 0.0 → 0.0 | 157.5 → 152.3 | 4.26 → 4.36 | 19 → 14 |
| sign-up | mobile | 99 → 98 | 2.118 → 2.276 | 0.0000 → 0.0000 | 48.5 → 103.0 | 152.8 → 155.4 | 4.26 → 4.36 | 16 → 14 |
| sign-up | desktop | 100 → 100 | 0.493 → 0.511 | 0.0000 → 0.0000 | 0.0 → 0.0 | 152.8 → 155.4 | 4.26 → 4.36 | 16 → 14 |
| forgot-password | mobile | 99 → 98 | 2.109 → 2.119 | 0.0000 → 0.0000 | 43.5 → 96.0 | 149.9 → 151.1 | 4.26 → 4.36 | 16 → 14 |
| forgot-password | desktop | 100 → 100 | 0.490 → 0.502 | 0.0000 → 0.0000 | 0.0 → 0.0 | 149.9 → 151.1 | 4.26 → 4.36 | 16 → 14 |
| reset-password | mobile | 99 → 99 | 2.123 → 2.100 | 0.0000 → 0.0000 | 48.5 → 79.0 | 150.1 → 152.6 | 4.26 → 4.36 | 16 → 14 |
| reset-password | desktop | 100 → 100 | 0.535 → 0.494 | 0.0000 → 0.0000 | 0.0 → 0.0 | 150.1 → 152.6 | 4.26 → 4.36 | 16 → 14 |
| verify-code | mobile | 99 → 98 | 2.246 → 2.155 | 0.0000 → 0.0000 | 39.5 → 130.0 | 155.0 → 150.0 | 4.26 → 4.36 | 17 → 14 |
| verify-code | desktop | 100 → 100 | 0.490 → 0.500 | 0.0000 → 0.0000 | 0.0 → 0.0 | 155.0 → 150.0 | 4.26 → 4.36 | 17 → 14 |
| complete-sign-up | mobile | 97 → 98 | 2.419 → 2.128 | 0.0350 → 0.0000 | 93.0 → 100.0 | 153.0 → 155.6 | 4.26 → 4.36 | 16 → 14 |
| complete-sign-up | desktop | 100 → 100 | 0.544 → 0.497 | 0.0068 → 0.0000 | 0.0 → 0.0 | 153.0 → 155.6 | 4.26 → 4.36 | 16 → 14 |
| demo-access | mobile | 99 → 99 | 2.271 → 2.110 | 0.0000 → 0.0000 | 51.5 → 90.0 | 148.6 → 149.6 | 4.26 → 4.36 | 16 → 14 |
| demo-access | desktop | 100 → 100 | 0.497 → 0.491 | 0.0000 → 0.0000 | 0.0 → 0.0 | 148.6 → 149.6 | 4.26 → 4.36 | 16 → 14 |

## Evidências e decisões

| Ponto verificado | Evidência | Ação / resultado |
|---|---|---|
| Produção vs. dev | Comandos de build bem-sucedidos e servidor `next start`; nenhum dev overlay | Medições exclusivamente em produção. Não há evidência para atribuir a nota 50 ao modo dev sem acesso à medição original. |
| JS, código não usado e divisão por rota | Login inicial carregava scripts e RSC de `/forgot-password` e `/sign-up` por prefetch. Auditoria de JS não usado apontou principalmente um chunk do runtime Next/React (~29 KiB de economia estimada), não uma biblioteca de UI adicional | `prefetch={false}` nos links de auth. Login: 19 → 14 requisições e ~5,2 KiB menos JS transferido. Não removemos partes internas do framework com base em cobertura de uma única navegação. Cadastro/redefinição ganham código pelas regras/checklist e pelo card reutilizável; isso está refletido nos números. |
| Server Components | Rotas/layouts já usam o padrão server; formulários e shell usam estado/contexto de locale | Sem migração especulativa do shell: não foi comprovado gargalo relevante nessa fronteira. |
| i18n | `Locale` e provider têm somente `en-US`; mensagens por feature | Sem download de múltiplos idiomas. Novos textos tipados no mesmo sistema, sem framework de tradução adicional. |
| SVG/imagens | Logo anterior era texto/CSS; nenhuma imagem grande na página. Novo logo usa paths vetoriais com dimensões reservadas | Logo inline sem request adicional ou dependência de fonte; SVGs claro/escuro reutilizáveis e ícones derivados do mesmo símbolo. Favicon ICO 16/32/48 e Apple 180×180. |
| Fontes | Fonte de sistema; zero requests de fontes nas auditorias | Sem fonte externa, bloqueio por download, excesso de pesos ou necessidade de preload/font-display. |
| CSS | ~4,26 KiB transferidos antes e ~4,36 KiB depois; auditoria de CSS não usado sem economia reportável | Mantidas duas folhas pequenas do bundler. CSS crítico bloqueia a primeira renderização por natureza; sem biblioteca/inline-CSS adicional para otimizar um custo pequeno sem evidência suficiente. |
| Animação/composição | Flip altera apenas `transform`; sem filter, backdrop-filter ou will-change persistente; auditoria sem animações não compostas no carregamento | `preserve-3d`, backface oculta, 600 ms e redução de movimento. Sombras estáticas mantidas: não houve custo comprovado que justificasse removê-las. Testes amostram a largura durante toda a transição. |
| CLS | `/complete-sign-up`: 0,0350 mobile / 0,0068 desktop; auditoria identificou o card crescendo quando o aviso aparecia depois da hidratação | Renderização inicial consistente do estado sem draft. CLS final zero em todas as rotas medidas. |
| Efeitos/re-renderizações | Países eram calculados em efeito na montagem mesmo na etapa de identidade; duas faces do cadastro duplicariam esse trabalho | Opções calculadas com `useMemo` somente na etapa de conta. Nenhum listener global novo; checklist usa avaliação local de uma string limitada a 128 caracteres. Sem alegação de ganho isolado de timing. |
| Cache/compressão | Respostas verificadas: assets `public, max-age=31536000, immutable`; HTML auth `private, no-cache, no-store`; gzip nos dois | Mantida configuração existente. Não cachear HTML privado para aumentar artificialmente a nota. Headers em `performance/headers.json`. |
| Overflow | Reproduzido em 280px: `html { min-width: 320px }` fazia documento ter 320px. Não reproduzido em 320–1440px no baseline, inclusive durante flip | Removida a largura mínima raiz, card/main com `min-width: 0`, grid com `minmax(0, 1fr)` e quebra de conteúdo. Nenhum `overflow-x: hidden` no body. Final sem overflow em 280/320/375/768/1024/1440px. |

## Card, marca e acessibilidade

`AuthCard` recebe `enableFlip` (padrão **false**), `flipped`, `children` e `back`. Desativado, renderiza apenas o conteúdo ativo em um card estático. Login e cadastro passam `true`. Ativado, mantém duas faces, retira a inativa da árvore de acessibilidade e do teclado com `aria-hidden`/`inert`, e transfere o foco para o seletor ativo ao trocar de lado. Os testes cobrem as duas configurações.

A pesquisa da skill ui-ux-pro-max indicou composição simples, tipografia legível, movimento por transform/opacity e foco visível. Mantivemos a fonte e as cores existentes, com SVG geométrico em paths, escala de espaçamento e interação por teclado. A borda do input cresce de 1 para 2px com compensação de padding, sem outline/anel ou alteração de tamanho; demais controles conservam foco visível. Tema atual é claro; a variante escura do logo está disponível em `public/brand`.

Mensagens de preview/demonstração e suas chaves foram removidas. Os nomes internos de rotas/adapters legados (`demo-access`, `mock-auth-service`) não são avisos na interface e permanecem para preservar a navegação. O backend não foi implementado por este trabalho.

## Política de senha e limites de segurança

`password-policy.ts` centraliza 12–128 caracteres Unicode, maiúscula/minúscula/número/especial, bloqueio local de termos comuns e variações, sequências de quatro caracteres (alfabéticas, numéricas, teclado, reversas), repetições de três e identidade disponível. Checklist e indicador usam i18n e anúncio `aria-live`. O indicador é uma avaliação de requisitos, não uma estimativa criptográfica de entropia/tempo de quebra. Senhas não são gravadas no storage nem enviadas a serviços de terceiros.

Cadastro compara nome e e-mail. Recuperação compara o e-mail informado no fluxo, mantido temporariamente em sessionStorage e removido ao concluir. A recuperação ainda não recebe nome de um perfil verificado: a integração real deve fornecer essa identidade e validar novamente no servidor usando o mesmo módulo. A lista local de termos comuns não equivale a uma base completa de senhas vazadas.

A política de composição foi implementada conforme pedido, mas **não é conformidade integral com NIST SP 800-63B-4**: a orientação atual exige 15 caracteres para senha como fator único e não admite composição obrigatória. [NIST](https://pages.nist.gov/800-63-4/sp800-63b.html) e [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html). O [art. 46 da LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm) exige medidas técnicas/administrativas adequadas e não define uma regex de senha.

Antes de conectar autenticação real: validação autoritativa no servidor, corpus mantido de senhas comprometidas, identidade proveniente da sessão/token de recuperação, hash adequado (por exemplo Argon2id), TLS, rate limiting, tokens de recuperação com expiração/uso único e proteção das sessões. Referência: [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Nenhum frontend isolado garante “segurança máxima” ou conformidade LGPD.

## Validação e reprodução

- `npm run build` e `npm run typecheck`: passaram.
- `npm test`: oito testes de política de senha e contrato do card, usando Node/TypeScript já existentes.
- ESLint com configuração recomendada TypeScript: passou em `src`, `auth.ts` e `next.config.ts`. Executado com tooling temporário, pois o projeto não tinha script/configuração de lint. Nenhuma dependência adicionada à aplicação.
- `npm run test:browser`: sete rotas em seis larguras; flip e inverso, foco, face inativa, redução de movimento, borda sem outline, favicons e fluxos de cadastro/recuperação com senha inválida e válida. Sem exceções de página.
- Evidência: [baseline](performance/auth-before.json), [final](performance/auth-after.json), [headers](performance/headers.json). São extratos estruturados dos relatórios Lighthouse, preservando os audits relevantes; screenshots/base64 foram omitidos.

Para repetir o Lighthouse, com Node e Edge instalados:

```powershell
npm ci
npm run build
# Em outro terminal, manter rodando:
npm run start -- --port 3101
# Tooling isolado e ignorado pelo Git:
npm install --prefix .auth-audit-tools --no-save lighthouse@13.5.0 playwright
node scripts/audit-auth.mjs current
$env:PLAYWRIGHT_MODULE = (Resolve-Path .auth-audit-tools/node_modules/playwright).Path
npm run test:browser
```

Relatórios completos serão salvos em `.auth-artifacts/performance/current`. O browser pode ser escolhido com `AUTH_BROWSER`; a URL com `AUTH_TEST_URL`. Para comparar, use a mesma versão do navegador, host, perfis e condições de carga. Medir em hospedagem real continua necessário para avaliar CDN, latência do backend e INP de campo.
