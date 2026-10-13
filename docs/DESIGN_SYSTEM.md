# BLUEPRINT Foundations v0.2

## Escolha

Design system próprio, pequeno e baseado em tokens CSS, componentes React tipados e CSS Modules. É a opção mais adequada para este recorte: os controles atuais são nativos, o layout tem poucas variações e não há motivo para instalar uma suíte inteira de interface.

Um design system é um conjunto consistente de decisões e contratos de componentes, não necessariamente uma dependência. Quando existirem componentes complexos (combobox, menu, dialog), avaliar uma primitiva acessível dedicada antes de reimplementar seu comportamento de teclado. Não antecipar essas dependências agora.

Referência visual: experiência de login compacta e centralizada, fundo lavanda suave e cartão branco com controles simples. A interface BLUEPRINT acrescenta apenas um pequeno indicativo de aprendizagem de inglês e não replica a marca ou os recursos visuais do Twee.

## Paleta

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-canvas` | `#F3F0FF` | Fundo lavanda |
| `--color-surface` | `#FFFFFF` | Cartões e campos |
| `--color-surface-soft` | `#F8F7FC` | Superfícies secundárias |
| `--color-primary` | `#6541CF` | Ações, links e foco |
| `--color-primary-hover` | `#5030AD` | Hover das ações |
| `--color-primary-soft` | `#ECE5FF` | Fundo de ícones |
| `--color-ink` | `#252333` | Texto principal |
| `--color-muted` | `#646174` | Texto secundário |
| `--color-border` | `#DCD8E8` | Divisórias decorativas |
| `--color-input-border` | `#9690A7` | Limite dos campos |
| `--color-accent` | `#F9DC89` | Destaque editorial, não texto claro |
| `--color-danger` | `#A42C3C` | Erro com mensagem textual |
| `--color-success` | `#21644C` | Confirmação com mensagem textual |

O violeta principal é mais escuro que o exemplo para apoiar a leitura de textos e botões. Nunca usar cor como único indicador de estado. Divisórias claras não substituem bordas identificáveis dos controles.

## Tipografia

Pilha nativa: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`. Sem requisição externa, fonte adicional ou mudança de layout causada por download. A aparência varia ligeiramente por sistema operacional, uma escolha consciente desta etapa.

- Corpo e inputs: aproximadamente 16 px, entrelinha 1,5.
- Descrição do formulário: 15 px, entrelinha 1,65.
- Labels: 14 px, peso 650.
- Título de formulário: 28–32 px, peso 750.
- Mensagem editorial: tamanho fluido de aproximadamente 42–66 px.
- Espaçamento por escala de 4 px; cartões com raio de 24 px e campos de 8 px.

Caso uma fonte de marca seja aprovada futuramente, preferir WOFF2 local licenciado via `next/font/local`, com poucos pesos. Isso não está instalado nesta entrega.

## Componentes e responsabilidades

| Componente | Responsabilidade |
| --- | --- |
| Brand | Marca visual reutilizável, sem lógica |
| AuthShell | Cabeçalho, formulário, mensagem editorial e rodapé |
| AuthCard | Superfície do formulário |
| FormHeader | Eyebrow, único h1 e descrição da página |
| Button | Variantes primary/secondary, pending e disabled; type padrão button |
| TextField | Label, input, hint, erro e associação por aria-describedby |
| PasswordField | TextField com controle de visibilidade de senha |
| Feedback | Mensagem info/error/success com status/alert |
| Icon | Pequeno conjunto de SVGs decorativos locais |
| LoginForm | Validação, processamento e chamada do contrato de login |
| RecoveryForm | Solicitação simulada e confirmação |
| ResetPasswordForm | Validação de senha/confirmacão e conclusão simulada |

Estados são locais ao formulário. O serviço simulado vive em `features/auth`, separado dos componentes visuais. Não criar um componente genérico gigantesco com dezenas de flags para todas as páginas.

## Responsividade e acessibilidade

- Desktop: duas colunas; formulário com largura máxima de 430 px.
- Até 900 px: espaços menores e composição editorial reduzida.
- Até 720 px: apenas o conteúdo essencial do acesso; mensagem lateral é ocultada.
- Controles de toque com altura de 44–50 px; campos com 16 px para leitura móvel.
- Labels persistentes, autocomplete adequado e mensagens vinculadas ao campo.
- Foco no primeiro campo inválido e foco na confirmação quando a tela muda.
- Link de salto, landmarks e foco visível.
- Senha aceita colar e gerenciadores; controle mostrar/ocultar tem nome acessível.
- Respeito a `prefers-reduced-motion`; sem animações decorativas pesadas.

Esta entrega não declara conformidade certificada. Leitor de tela, dispositivos físicos e cobertura automatizada terão validação dedicada nas próximas etapas.
