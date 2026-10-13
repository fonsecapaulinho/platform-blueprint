# Segurança e limites da demonstração

## O que foi feito

- Não há chaves de API, dados de alunos ou segredos.
- Nenhuma senha é enviada a um serviço ou armazenada pela aplicação.
- Não há persistência, cookies de sessão, logs de credenciais ou analytics.
- Inputs são renderizados como texto por React; não se usa `dangerouslySetInnerHTML`.
- Destinos de navegação são fixos; não há parâmetro de redirecionamento arbitrário.
- Campos têm limites de comprimento. Recuperação retorna confirmação genérica, sem revelar existência de conta.
- Envios duplicados são bloqueados no cliente para melhorar a experiência. Isso não substitui controles de servidor.
- Headers incluem `nosniff`, bloqueio de frames, referrer policy e restrição de câmera/microfone/geolocalização.
- CSP inicial limita frames, objetos, base URI e destino de formulários. **Não é uma CSP completa contra XSS**: uma política de scripts com nonce/hash deve ser definida junto da arquitetura final.
- Metadados solicitam não indexar as páginas; isso não é controle de acesso.

## Limites

`/demo-access` e `/reset-password` são públicas. O mock valida valores no navegador, acessíveis no bundle. `/verify-code` valida apenas o formato na prévia e não confirma códigos recebidos. Não usar essa implementação como autenticação real nem cadastrar usuários reais.

O contrato `AuthService` é propositalmente pequeno. A API real de recuperação/redefinição precisará acrescentar token, expiração e tratamento de sessão; não conectar o método demonstrativo de redefinição diretamente a uma conta real.

## Antes de operar com alunos

- Escolher autenticação gerenciada ou implementar uma estratégia de sessão no servidor.
- Aplicar autorização por usuário no servidor/banco, independentemente da interface.
- Implementar cookies seguros conforme arquitetura, proteção contra abuso e validação de entrada no servidor.
- Implementar tokens de recuperação de uso único, expiração e confirmação genérica; validar tudo no servidor.
- Definir política de senha, HTTPS, CSP completa compatível com Next.js e controles de logs/privacidade.
- Remover credenciais e telas de demonstração do caminho de produção.
- Rever Permissions-Policy quando áudio/microfone entrar no escopo.

Nenhum pacote de segurança ou autenticação foi adicionado apenas para simular proteção. Atualizações de dependências e auditoria de produção continuam sendo trabalho recorrente.
