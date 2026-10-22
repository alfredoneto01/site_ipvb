# Site IPVB

Site institucional da Igreja Presbiteriana de Vila Bonilha. Next.js 16 + Payload CMS 3 (painel administrativo em `/admin`).

## Rodando localmente

```bash
pnpm install
cp .env.example .env   # gere um PAYLOAD_SECRET longo
pnpm seed              # cria o banco SQLite e o conteúdo inicial
pnpm dev               # http://localhost:3000
```

No primeiro acesso a `/admin`, o Payload pede para criar um usuário. Esse primeiro cadastro vira **administrador**.

## Estrutura

| Pasta | O que tem |
|---|---|
| `src/app/(frontend)` | Páginas públicas (início, quem somos, primeira visita, programação, ministérios, mensagens, contribua, contato) |
| `src/app/(frontend)/actions.ts` | Server actions dos formulários (visita, oração, contato) |
| `src/collections` | Agenda, avisos, ministérios, liderança, imagens, formulários e usuários |
| `src/globals` | Página inicial, Quem somos, Primeira visita e Dados da igreja |
| `src/access/roles.ts` | Papéis: administrador, pastor, secretaria, mídia |
| `src/seed` | Conteúdo inicial (`pnpm seed`, não duplica se rodar de novo) |

## Papéis do painel

- **Administrador**: tudo, incluindo usuários.
- **Pastor**: todo o conteúdo, visitantes, contatos e pedidos de oração.
- **Secretaria**: agenda, avisos, dados da igreja, primeira visita, visitantes e contatos.
- **Mídia**: imagens, avisos, ministérios e página inicial.

Pedidos de oração só aparecem para pastores e administradores.

## Conteúdo automático

- **Mensagens**: defina `YOUTUBE_CHANNEL_ID` (o ID que começa com `UC…`). Os vídeos vêm do feed público do canal, sem chave de API, e são atualizados a cada hora.
- **Páginas**: são estáticas e se regeneram ao salvar qualquer coisa no painel (e a cada hora, para tirar eventos que já passaram).

## Deploy (Netlify)

- **Hospedagem**: Netlify, conectado ao repositório do GitHub (cada push na branch principal publica). Configuração em `netlify.toml`.
- **Banco**: Turso. `DATABASE_URL` = `libsql://…` e `DATABASE_AUTH_TOKEN`.
- **Fotos**: Uploadthing (`UPLOADTHING_TOKEN`). O envio vai direto do navegador, sem o limite de 6 MB das funções.
- **Variáveis no Netlify**: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `PAYLOAD_SECRET`, `UPLOADTHING_TOKEN`, `YOUTUBE_CHANNEL_ID`, `NEXT_PUBLIC_SITE_URL`.

### Migrações do banco

Em desenvolvimento o Payload ajusta o banco local sozinho. Em produção, as mudanças de esquema vão por migração:

```bash
pnpm payload migrate:create nome-da-mudanca   # depois de alterar coleções/globais
```

O build do Netlify (`pnpm run ci`) roda `payload migrate` antes do `next build`.

Para popular o banco de produção pela primeira vez, rode localmente apontando para o Turso:

```bash
DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... pnpm payload migrate
DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... pnpm seed
```
