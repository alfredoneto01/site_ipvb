// PM2: mantém o site no ar no VPS e reinicia se cair ou se o servidor reiniciar.
// Uso (na pasta do projeto): pm2 start deploy/ecosystem.config.cjs && pm2 save
const path = require('path')

const raiz = path.resolve(__dirname, '..')

module.exports = {
  apps: [
    {
      name: 'ipvb',
      cwd: path.join(raiz, '.next/standalone'),
      script: 'server.js',
      // Variáveis de produção (DATABASE_URL, PAYLOAD_SECRET, MEDIA_DIR...).
      node_args: `--env-file=${path.join(raiz, '.env.production')}`,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Só aceita conexões locais; o Nginx é quem fica exposto à internet.
        HOSTNAME: '127.0.0.1',
      },
      max_memory_restart: '700M',
      time: true,
    },
  ],
}
