# Segurança e limites da demonstração

## O que foi feito

- Não há chaves de API, dados de alunos ou segredos.
- A senha de acesso por e-mail só é comparada pelo mock; cadastro e autenticação por e-mail não são enviados a um serviço nem persistidos.
- A sessão OAuth usa o cookie de sessão seguro do Auth.js; não há banco de dados, logs de credenciais ou analytics.
- Inputs são renderizados como texto por React; não se usa `dangerouslySetInnerHTML`.
- Destinos de navegação são fixos; não há parâmetro de redirecionamento arbitrário.
- Campos têm limites de comprimento. Recuperação retorna confirmação genérica, sem revelar existência de conta.
- Envios duplicados são bloqueados no cliente para melhorar a experiência. Isso não substitui controles de servidor.
- Headers incluem `nosniff`, bloqueio de frames, referrer policy e restrição de câmera/microfone/geolocalização.
- CSP inicial limita frames, objetos, base URI e destino de formulários. **Não é uma CSP completa contra XSS**: uma política de scripts com nonce/hash deve ser definida junto da arquitetura final.
- Metadados solicitam não indexar as páginas; isso não é controle de acesso.

## Limites

`/demo-access` é uma página pública do mock. O mock de e-mail/senha valida valores no navegador, acessíveis no bundle. No cadastro, a validação de nome, e-mail, campos e formato do código ocorre somente no cliente; não há consulta de conta, envio de e-mail, validação real de código ou criação de usuário. A prévia mantém temporariamente nome, e-mail e perfil em `sessionStorage` para preencher `/complete-sign-up`; senha e código não são armazenados. `/verify-code` valida apenas o formato na prévia e não confirma códigos recebidos. `/reset-password` não altera senhas.

O login Google usa Auth.js, OpenID Connect e sessão JWT em cookie. Configure `AUTH_SECRET`, `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` fora do repositório. O callback `/dashboard` exige sessão. Não há banco/adapter: identidade e perfil do usuário não são persistidos e os papéis aluno/professor ainda não são autorizados pelo servidor. O papel escolhido durante cadastro é apenas seleção de interface, não uma permissão. Cadastro por e-mail, recuperação por e-mail e códigos de uso único aguardam backend.

O contrato `AuthService` é propositalmente pequeno. A API real de recuperação/redefinição precisará acrescentar token, expiração e tratamento de sessão; não conectar o método demonstrativo de redefinição diretamente a uma conta real.

## Antes de operar com alunos

- Persistir identidade, perfis e papéis aluno/professor num banco de dados e aplicar autorização no servidor.
- Conectar cadastro por e-mail, proteção contra abuso e validação de entrada no servidor.
- Implementar tokens de recuperação de uso único, expiração e confirmação genérica; validar tudo no servidor.
- Definir política de senha, HTTPS, CSP completa compatível com Next.js e controles de logs/privacidade.
- Remover credenciais e telas de demonstração do caminho de produção.
- Rever Permissions-Policy quando áudio/microfone entrar no escopo.

Auth.js fornece a integração OAuth e sessão; as demais proteções de produção continuam sendo trabalho recorrente.
