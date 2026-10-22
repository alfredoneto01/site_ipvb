import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`eventos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`data\` text,
  	\`local\` text,
  	\`descricao\` text,
  	\`imagem_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`imagem_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`eventos_imagem_idx\` ON \`eventos\` (\`imagem_id\`);`)
  await db.run(sql`CREATE INDEX \`eventos_updated_at_idx\` ON \`eventos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`eventos_created_at_idx\` ON \`eventos\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`eventos__status_idx\` ON \`eventos\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_eventos_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_titulo\` text,
  	\`version_data\` text,
  	\`version_local\` text,
  	\`version_descricao\` text,
  	\`version_imagem_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`eventos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_imagem_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_eventos_v_parent_idx\` ON \`_eventos_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_eventos_v_version_version_imagem_idx\` ON \`_eventos_v\` (\`version_imagem_id\`);`)
  await db.run(sql`CREATE INDEX \`_eventos_v_version_version_updated_at_idx\` ON \`_eventos_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_eventos_v_version_version_created_at_idx\` ON \`_eventos_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_eventos_v_version_version__status_idx\` ON \`_eventos_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_eventos_v_created_at_idx\` ON \`_eventos_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_eventos_v_updated_at_idx\` ON \`_eventos_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_eventos_v_latest_idx\` ON \`_eventos_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`avisos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text NOT NULL,
  	\`texto\` text,
  	\`link\` text,
  	\`ativo\` integer DEFAULT true,
  	\`mostrar_ate\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`avisos_updated_at_idx\` ON \`avisos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`avisos_created_at_idx\` ON \`avisos\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`ministerios\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nome\` text NOT NULL,
  	\`resumo\` text NOT NULL,
  	\`descricao\` text,
  	\`quando\` text,
  	\`responsavel\` text,
  	\`imagem_id\` integer,
  	\`cor\` text DEFAULT 'laranja',
  	\`ordem\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`imagem_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`ministerios_imagem_idx\` ON \`ministerios\` (\`imagem_id\`);`)
  await db.run(sql`CREATE INDEX \`ministerios_updated_at_idx\` ON \`ministerios\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ministerios_created_at_idx\` ON \`ministerios\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`lideranca\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nome\` text NOT NULL,
  	\`cargo\` text NOT NULL,
  	\`foto_id\` integer,
  	\`bio\` text,
  	\`ordem\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`foto_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`lideranca_foto_idx\` ON \`lideranca\` (\`foto_id\`);`)
  await db.run(sql`CREATE INDEX \`lideranca_updated_at_idx\` ON \`lideranca\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`lideranca_created_at_idx\` ON \`lideranca\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE TABLE \`visitantes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nome\` text NOT NULL,
  	\`whatsapp\` text NOT NULL,
  	\`quando\` text NOT NULL,
  	\`pessoas\` numeric DEFAULT 1,
  	\`criancas\` integer,
  	\`mensagem\` text,
  	\`contatado\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`visitantes_updated_at_idx\` ON \`visitantes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`visitantes_created_at_idx\` ON \`visitantes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`pedidos_oracao\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nome\` text,
  	\`contato\` text,
  	\`pedido\` text NOT NULL,
  	\`atendido\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`pedidos_oracao_updated_at_idx\` ON \`pedidos_oracao\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pedidos_oracao_created_at_idx\` ON \`pedidos_oracao\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`contatos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nome\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`mensagem\` text NOT NULL,
  	\`respondido\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`contatos_updated_at_idx\` ON \`contatos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`contatos_created_at_idx\` ON \`contatos\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nome\` text NOT NULL,
  	\`papel\` text DEFAULT 'secretaria' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`eventos_id\` integer,
  	\`avisos_id\` integer,
  	\`ministerios_id\` integer,
  	\`lideranca_id\` integer,
  	\`media_id\` integer,
  	\`visitantes_id\` integer,
  	\`pedidos_oracao_id\` integer,
  	\`contatos_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`eventos_id\`) REFERENCES \`eventos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`avisos_id\`) REFERENCES \`avisos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ministerios_id\`) REFERENCES \`ministerios\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lideranca_id\`) REFERENCES \`lideranca\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`visitantes_id\`) REFERENCES \`visitantes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pedidos_oracao_id\`) REFERENCES \`pedidos_oracao\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contatos_id\`) REFERENCES \`contatos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_eventos_id_idx\` ON \`payload_locked_documents_rels\` (\`eventos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_avisos_id_idx\` ON \`payload_locked_documents_rels\` (\`avisos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ministerios_id_idx\` ON \`payload_locked_documents_rels\` (\`ministerios_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_lideranca_id_idx\` ON \`payload_locked_documents_rels\` (\`lideranca_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_visitantes_id_idx\` ON \`payload_locked_documents_rels\` (\`visitantes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pedidos_oracao_id_idx\` ON \`payload_locked_documents_rels\` (\`pedidos_oracao_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contatos_id_idx\` ON \`payload_locked_documents_rels\` (\`contatos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`pagina_inicial\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_titulo\` text NOT NULL,
  	\`hero_subtitulo\` text,
  	\`hero_imagem_id\` integer,
  	\`quem_somos_titulo\` text,
  	\`quem_somos_texto\` text,
  	\`quem_somos_imagem_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_imagem_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`quem_somos_imagem_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pagina_inicial_hero_hero_imagem_idx\` ON \`pagina_inicial\` (\`hero_imagem_id\`);`)
  await db.run(sql`CREATE INDEX \`pagina_inicial_quem_somos_quem_somos_imagem_idx\` ON \`pagina_inicial\` (\`quem_somos_imagem_id\`);`)
  await db.run(sql`CREATE TABLE \`institucional\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`compromisso\` text,
  	\`historia\` text,
  	\`cremos\` text,
  	\`imagem_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`imagem_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`institucional_imagem_idx\` ON \`institucional\` (\`imagem_id\`);`)
  await db.run(sql`CREATE TABLE \`primeira_visita_passos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titulo\` text NOT NULL,
  	\`texto\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`primeira_visita\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`primeira_visita_passos_order_idx\` ON \`primeira_visita_passos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`primeira_visita_passos_parent_id_idx\` ON \`primeira_visita_passos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`primeira_visita_perguntas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pergunta\` text NOT NULL,
  	\`resposta\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`primeira_visita\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`primeira_visita_perguntas_order_idx\` ON \`primeira_visita_perguntas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`primeira_visita_perguntas_parent_id_idx\` ON \`primeira_visita_perguntas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`primeira_visita\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`configuracoes_horarios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titulo\` text NOT NULL,
  	\`descricao\` text NOT NULL,
  	\`icone\` text DEFAULT 'relogio',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`configuracoes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`configuracoes_horarios_order_idx\` ON \`configuracoes_horarios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`configuracoes_horarios_parent_id_idx\` ON \`configuracoes_horarios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`configuracoes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`endereco\` text NOT NULL,
  	\`bairro\` text NOT NULL,
  	\`maps_url\` text,
  	\`whatsapp\` text,
  	\`telefone\` text,
  	\`email\` text,
  	\`instagram\` text,
  	\`youtube\` text,
  	\`spotify\` text,
  	\`facebook\` text,
  	\`pix_tipo\` text,
  	\`pix_chave\` text,
  	\`pix_favorecido\` text,
  	\`pix_qrcode_id\` integer,
  	\`dados_bancarios\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`pix_qrcode_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`configuracoes_pix_pix_qrcode_idx\` ON \`configuracoes\` (\`pix_qrcode_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`eventos\`;`)
  await db.run(sql`DROP TABLE \`_eventos_v\`;`)
  await db.run(sql`DROP TABLE \`avisos\`;`)
  await db.run(sql`DROP TABLE \`ministerios\`;`)
  await db.run(sql`DROP TABLE \`lideranca\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`visitantes\`;`)
  await db.run(sql`DROP TABLE \`pedidos_oracao\`;`)
  await db.run(sql`DROP TABLE \`contatos\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`pagina_inicial\`;`)
  await db.run(sql`DROP TABLE \`institucional\`;`)
  await db.run(sql`DROP TABLE \`primeira_visita_passos\`;`)
  await db.run(sql`DROP TABLE \`primeira_visita_perguntas\`;`)
  await db.run(sql`DROP TABLE \`primeira_visita\`;`)
  await db.run(sql`DROP TABLE \`configuracoes_horarios\`;`)
  await db.run(sql`DROP TABLE \`configuracoes\`;`)
}
