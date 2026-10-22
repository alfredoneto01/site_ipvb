#!/usr/bin/env bash
# Atualiza o site no VPS com a última versão da branch main.
# Uso (na pasta do projeto): ./deploy/atualizar.sh
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env.production ]; then
  echo "Falta o arquivo .env.production (veja .env.example)." >&2
  exit 1
fi

# Carrega as variáveis de produção para o build e as migrações.
set -a
# shellcheck disable=SC1091
source .env.production
set +a

echo "==> Baixando a versão mais recente"
git pull --ff-only

echo "==> Instalando dependências"
pnpm install --frozen-lockfile

echo "==> Aplicando migrações do banco"
pnpm payload migrate

echo "==> Gerando o site"
pnpm build

# O modo standalone não copia arquivos estáticos; eles vão junto ao servidor.
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/

echo "==> Reiniciando o site sem derrubar conexões"
if pm2 describe ipvb > /dev/null 2>&1; then
  pm2 reload ipvb --update-env
else
  pm2 start deploy/ecosystem.config.cjs
  pm2 save
fi

echo "==> Pronto!"
