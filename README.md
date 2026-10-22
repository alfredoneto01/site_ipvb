# Site IPVB

Site institucional da Igreja Presbiteriana de Vila Bonilha. Next.js 16 + Payload CMS 3 (painel administrativo em `/admin`) + PostgreSQL.

| Ambiente | Onde | Banco | Fotos |
|---|---|---|---|
| Teste | Netlify | Netlify DB (Postgres/Neon) | Uploadthing |
| Produção | VPS Locaweb | Postgres no próprio VPS | Disco do VPS (`MEDIA_DIR`) |

## Rodando localmente

Não há banco local: o desenvolvimento usa o banco de teste.

```bash
pnpm install
cp .env.example .env   # cole a URL do banco de teste em DATABASE_URL
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
| `src/migrations` | Migrações do banco (Postgres) |
| `src/seed` | Conteúdo inicial (`pnpm seed`, não duplica se rodar de novo) |
| `deploy/` | PM2, Nginx, script de atualização e backup do VPS |

## Papéis do painel

- **Administrador**: tudo, incluindo usuários.
- **Pastor**: todo o conteúdo, visitantes, contatos e pedidos de oração.
- **Secretaria**: agenda, avisos, dados da igreja, primeira visita, visitantes e contatos.
- **Mídia**: imagens, avisos, ministérios e página inicial.

Pedidos de oração só aparecem para pastores e administradores.

## Conteúdo automático

- **Mensagens**: defina `YOUTUBE_CHANNEL_ID` (o ID que começa com `UC…`). Os vídeos vêm do feed público do canal, sem chave de API, e são atualizados a cada hora.
- **Páginas**: são estáticas e se regeneram ao salvar qualquer coisa no painel (e a cada hora, para tirar eventos que já passaram).

## Migrações do banco

O esquema do banco nunca muda sozinho. Depois de alterar coleções ou globais:

```bash
pnpm payload migrate:create nome-da-mudanca
```

Faça commit do arquivo gerado em `src/migrations`. O Netlify (`pnpm run ci`) e o script do VPS rodam `payload migrate` antes do build.

## Teste: Netlify

1. Importe o repositório do GitHub no Netlify (o `netlify.toml` já define o build).
2. Em **Data & storage → Database**, crie o banco. O Netlify injeta a conexão (`NETLIFY_DB_URL`) no build e nas funções; ela não aparece na lista de variáveis.
3. Variáveis: `PAYLOAD_SECRET`, `UPLOADTHING_TOKEN`, `NEXT_PUBLIC_SITE_URL` e, opcionalmente, `YOUTUBE_CHANNEL_ID`.
4. Para criar o primeiro administrador, defina também `SEED_ADMIN_EMAIL` e `SEED_ADMIN_SENHA` e faça um deploy.

O build (`pnpm run ci`) aplica as migrações e roda o seed, que só preenche um banco vazio. Cada branch ou pull request ganha uma cópia do banco e passa pelo mesmo processo.

## Produção: VPS Locaweb

Feito uma vez, como root, num VPS Ubuntu/Debian:

```bash
# Node 22, pnpm, PM2, Nginx, Postgres e certbot
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs nginx postgresql certbot python3-certbot-nginx git
corepack enable && npm install -g pm2

# Usuário do sistema que roda o site
adduser --disabled-password --gecos "" ipvb

# Banco e usuário do Postgres (troque a senha)
sudo -u postgres psql -c "CREATE USER ipvb WITH PASSWORD 'SENHA_FORTE';"
sudo -u postgres psql -c "CREATE DATABASE ipvb OWNER ipvb;"

# Pastas do site, das fotos e dos backups
mkdir -p /var/www/ipvb /var/www/ipvb-media /var/backups/ipvb
chown ipvb:ipvb /var/www/ipvb /var/www/ipvb-media /var/backups/ipvb

# Nginx + HTTPS (depois de apontar o DNS do domínio para o IP do VPS)
cp /var/www/ipvb/deploy/nginx-ipvb.conf /etc/nginx/sites-available/ipvb
ln -s /etc/nginx/sites-available/ipvb /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d ipvb.org.br -d www.ipvb.org.br

# PM2 sobe junto com o servidor
pm2 startup systemd -u ipvb --hp /home/ipvb
```

Como usuário `ipvb`:

```bash
git clone <url-do-repositorio> /var/www/ipvb
cd /var/www/ipvb
cp .env.example .env.production   # preencha DATABASE_URL, PAYLOAD_SECRET, MEDIA_DIR...
./deploy/atualizar.sh             # instala, migra, gera e sobe o site
crontab -e                        # backup diário: veja deploy/backup-banco.sh
```

Para publicar uma nova versão: `./deploy/atualizar.sh`.

### Migrar os dados do Netlify para o VPS

```bash
pg_dump --format=custom --no-owner "URL_DO_NETLIFY_DB" > ipvb.dump
pg_restore --no-owner --clean --if-exists -d "postgres://ipvb:SENHA@127.0.0.1:5432/ipvb" ipvb.dump
```

**Fotos enviadas durante o teste** ficam no Uploadthing. Duas opções:

- Manter `UPLOADTHING_TOKEN` também no `.env.production` do VPS: tudo continua no Uploadthing (mais simples).
- Deixar o token vazio no VPS: as fotos passam a ficar em `MEDIA_DIR`, e as que foram enviadas no teste precisam ser reenviadas pelo painel.
