#!/usr/bin/env bash
# Backup diário do banco e das fotos, mantendo os últimos 14 dias.
# Agende no cron do usuário que roda o site (crontab -e):
#   0 3 * * * /var/www/ipvb/deploy/backup-banco.sh >> /var/log/ipvb-backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."

set -a
# shellcheck disable=SC1091
source .env.production
set +a

DESTINO="${BACKUP_DIR:-/var/backups/ipvb}"
DATA="$(date +%Y-%m-%d_%H%M)"
mkdir -p "$DESTINO"

pg_dump --format=custom --no-owner "$DATABASE_URL" > "$DESTINO/banco_$DATA.dump"

if [ -n "${MEDIA_DIR:-}" ] && [ -d "$MEDIA_DIR" ]; then
  tar -czf "$DESTINO/fotos_$DATA.tar.gz" -C "$(dirname "$MEDIA_DIR")" "$(basename "$MEDIA_DIR")"
fi

find "$DESTINO" -type f -mtime +14 -delete

echo "$(date) backup concluído em $DESTINO"
