import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_eventos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__eventos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_ministerios_cor" AS ENUM('laranja', 'azul', 'verde');
  CREATE TYPE "public"."enum_visitantes_quando" AS ENUM('ebd', 'culto', 'quinta');
  CREATE TYPE "public"."enum_users_papel" AS ENUM('admin', 'pastor', 'secretaria', 'midia');
  CREATE TYPE "public"."enum_configuracoes_horarios_icone" AS ENUM('relogio', 'livro', 'pessoas');
  CREATE TABLE "eventos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"data" timestamp(3) with time zone,
  	"local" varchar,
  	"descricao" varchar,
  	"imagem_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_eventos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_eventos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_data" timestamp(3) with time zone,
  	"version_local" varchar,
  	"version_descricao" varchar,
  	"version_imagem_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__eventos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "avisos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"texto" varchar,
  	"link" varchar,
  	"ativo" boolean DEFAULT true,
  	"mostrar_ate" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ministerios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"resumo" varchar NOT NULL,
  	"descricao" jsonb,
  	"quando" varchar,
  	"responsavel" varchar,
  	"imagem_id" integer,
  	"cor" "enum_ministerios_cor" DEFAULT 'laranja',
  	"ordem" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lideranca" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"cargo" varchar NOT NULL,
  	"foto_id" integer,
  	"bio" varchar,
  	"ordem" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "visitantes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"whatsapp" varchar NOT NULL,
  	"quando" "enum_visitantes_quando" NOT NULL,
  	"pessoas" numeric DEFAULT 1,
  	"criancas" boolean,
  	"mensagem" varchar,
  	"contatado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pedidos_oracao" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"contato" varchar,
  	"pedido" varchar NOT NULL,
  	"atendido" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contatos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"mensagem" varchar NOT NULL,
  	"respondido" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"papel" "enum_users_papel" DEFAULT 'secretaria' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"eventos_id" integer,
  	"avisos_id" integer,
  	"ministerios_id" integer,
  	"lideranca_id" integer,
  	"media_id" integer,
  	"visitantes_id" integer,
  	"pedidos_oracao_id" integer,
  	"contatos_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pagina_inicial" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar NOT NULL,
  	"hero_subtitulo" varchar,
  	"hero_imagem_id" integer,
  	"quem_somos_titulo" varchar,
  	"quem_somos_texto" varchar,
  	"quem_somos_imagem_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "institucional" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"compromisso" varchar,
  	"historia" jsonb,
  	"cremos" jsonb,
  	"imagem_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "primeira_visita_passos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "primeira_visita_perguntas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pergunta" varchar NOT NULL,
  	"resposta" varchar NOT NULL
  );
  
  CREATE TABLE "primeira_visita" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "configuracoes_horarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descricao" varchar NOT NULL,
  	"icone" "enum_configuracoes_horarios_icone" DEFAULT 'relogio'
  );
  
  CREATE TABLE "configuracoes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"endereco" varchar NOT NULL,
  	"bairro" varchar NOT NULL,
  	"maps_url" varchar,
  	"whatsapp" varchar,
  	"telefone" varchar,
  	"email" varchar,
  	"instagram" varchar,
  	"youtube" varchar,
  	"spotify" varchar,
  	"facebook" varchar,
  	"pix_tipo" varchar,
  	"pix_chave" varchar,
  	"pix_favorecido" varchar,
  	"pix_qrcode_id" integer,
  	"dados_bancarios" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "eventos" ADD CONSTRAINT "eventos_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventos_v" ADD CONSTRAINT "_eventos_v_parent_id_eventos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."eventos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventos_v" ADD CONSTRAINT "_eventos_v_version_imagem_id_media_id_fk" FOREIGN KEY ("version_imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ministerios" ADD CONSTRAINT "ministerios_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lideranca" ADD CONSTRAINT "lideranca_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_eventos_fk" FOREIGN KEY ("eventos_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_avisos_fk" FOREIGN KEY ("avisos_id") REFERENCES "public"."avisos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ministerios_fk" FOREIGN KEY ("ministerios_id") REFERENCES "public"."ministerios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lideranca_fk" FOREIGN KEY ("lideranca_id") REFERENCES "public"."lideranca"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visitantes_fk" FOREIGN KEY ("visitantes_id") REFERENCES "public"."visitantes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pedidos_oracao_fk" FOREIGN KEY ("pedidos_oracao_id") REFERENCES "public"."pedidos_oracao"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contatos_fk" FOREIGN KEY ("contatos_id") REFERENCES "public"."contatos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pagina_inicial" ADD CONSTRAINT "pagina_inicial_hero_imagem_id_media_id_fk" FOREIGN KEY ("hero_imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pagina_inicial" ADD CONSTRAINT "pagina_inicial_quem_somos_imagem_id_media_id_fk" FOREIGN KEY ("quem_somos_imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "institucional" ADD CONSTRAINT "institucional_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "primeira_visita_passos" ADD CONSTRAINT "primeira_visita_passos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."primeira_visita"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "primeira_visita_perguntas" ADD CONSTRAINT "primeira_visita_perguntas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."primeira_visita"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracoes_horarios" ADD CONSTRAINT "configuracoes_horarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracoes" ADD CONSTRAINT "configuracoes_pix_qrcode_id_media_id_fk" FOREIGN KEY ("pix_qrcode_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "eventos_imagem_idx" ON "eventos" USING btree ("imagem_id");
  CREATE INDEX "eventos_updated_at_idx" ON "eventos" USING btree ("updated_at");
  CREATE INDEX "eventos_created_at_idx" ON "eventos" USING btree ("created_at");
  CREATE INDEX "eventos__status_idx" ON "eventos" USING btree ("_status");
  CREATE INDEX "_eventos_v_parent_idx" ON "_eventos_v" USING btree ("parent_id");
  CREATE INDEX "_eventos_v_version_version_imagem_idx" ON "_eventos_v" USING btree ("version_imagem_id");
  CREATE INDEX "_eventos_v_version_version_updated_at_idx" ON "_eventos_v" USING btree ("version_updated_at");
  CREATE INDEX "_eventos_v_version_version_created_at_idx" ON "_eventos_v" USING btree ("version_created_at");
  CREATE INDEX "_eventos_v_version_version__status_idx" ON "_eventos_v" USING btree ("version__status");
  CREATE INDEX "_eventos_v_created_at_idx" ON "_eventos_v" USING btree ("created_at");
  CREATE INDEX "_eventos_v_updated_at_idx" ON "_eventos_v" USING btree ("updated_at");
  CREATE INDEX "_eventos_v_latest_idx" ON "_eventos_v" USING btree ("latest");
  CREATE INDEX "avisos_updated_at_idx" ON "avisos" USING btree ("updated_at");
  CREATE INDEX "avisos_created_at_idx" ON "avisos" USING btree ("created_at");
  CREATE INDEX "ministerios_imagem_idx" ON "ministerios" USING btree ("imagem_id");
  CREATE INDEX "ministerios_updated_at_idx" ON "ministerios" USING btree ("updated_at");
  CREATE INDEX "ministerios_created_at_idx" ON "ministerios" USING btree ("created_at");
  CREATE INDEX "lideranca_foto_idx" ON "lideranca" USING btree ("foto_id");
  CREATE INDEX "lideranca_updated_at_idx" ON "lideranca" USING btree ("updated_at");
  CREATE INDEX "lideranca_created_at_idx" ON "lideranca" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "visitantes_updated_at_idx" ON "visitantes" USING btree ("updated_at");
  CREATE INDEX "visitantes_created_at_idx" ON "visitantes" USING btree ("created_at");
  CREATE INDEX "pedidos_oracao_updated_at_idx" ON "pedidos_oracao" USING btree ("updated_at");
  CREATE INDEX "pedidos_oracao_created_at_idx" ON "pedidos_oracao" USING btree ("created_at");
  CREATE INDEX "contatos_updated_at_idx" ON "contatos" USING btree ("updated_at");
  CREATE INDEX "contatos_created_at_idx" ON "contatos" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_eventos_id_idx" ON "payload_locked_documents_rels" USING btree ("eventos_id");
  CREATE INDEX "payload_locked_documents_rels_avisos_id_idx" ON "payload_locked_documents_rels" USING btree ("avisos_id");
  CREATE INDEX "payload_locked_documents_rels_ministerios_id_idx" ON "payload_locked_documents_rels" USING btree ("ministerios_id");
  CREATE INDEX "payload_locked_documents_rels_lideranca_id_idx" ON "payload_locked_documents_rels" USING btree ("lideranca_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_visitantes_id_idx" ON "payload_locked_documents_rels" USING btree ("visitantes_id");
  CREATE INDEX "payload_locked_documents_rels_pedidos_oracao_id_idx" ON "payload_locked_documents_rels" USING btree ("pedidos_oracao_id");
  CREATE INDEX "payload_locked_documents_rels_contatos_id_idx" ON "payload_locked_documents_rels" USING btree ("contatos_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "pagina_inicial_hero_hero_imagem_idx" ON "pagina_inicial" USING btree ("hero_imagem_id");
  CREATE INDEX "pagina_inicial_quem_somos_quem_somos_imagem_idx" ON "pagina_inicial" USING btree ("quem_somos_imagem_id");
  CREATE INDEX "institucional_imagem_idx" ON "institucional" USING btree ("imagem_id");
  CREATE INDEX "primeira_visita_passos_order_idx" ON "primeira_visita_passos" USING btree ("_order");
  CREATE INDEX "primeira_visita_passos_parent_id_idx" ON "primeira_visita_passos" USING btree ("_parent_id");
  CREATE INDEX "primeira_visita_perguntas_order_idx" ON "primeira_visita_perguntas" USING btree ("_order");
  CREATE INDEX "primeira_visita_perguntas_parent_id_idx" ON "primeira_visita_perguntas" USING btree ("_parent_id");
  CREATE INDEX "configuracoes_horarios_order_idx" ON "configuracoes_horarios" USING btree ("_order");
  CREATE INDEX "configuracoes_horarios_parent_id_idx" ON "configuracoes_horarios" USING btree ("_parent_id");
  CREATE INDEX "configuracoes_pix_pix_qrcode_idx" ON "configuracoes" USING btree ("pix_qrcode_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "eventos" CASCADE;
  DROP TABLE "_eventos_v" CASCADE;
  DROP TABLE "avisos" CASCADE;
  DROP TABLE "ministerios" CASCADE;
  DROP TABLE "lideranca" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "visitantes" CASCADE;
  DROP TABLE "pedidos_oracao" CASCADE;
  DROP TABLE "contatos" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "pagina_inicial" CASCADE;
  DROP TABLE "institucional" CASCADE;
  DROP TABLE "primeira_visita_passos" CASCADE;
  DROP TABLE "primeira_visita_perguntas" CASCADE;
  DROP TABLE "primeira_visita" CASCADE;
  DROP TABLE "configuracoes_horarios" CASCADE;
  DROP TABLE "configuracoes" CASCADE;
  DROP TYPE "public"."enum_eventos_status";
  DROP TYPE "public"."enum__eventos_v_version_status";
  DROP TYPE "public"."enum_ministerios_cor";
  DROP TYPE "public"."enum_visitantes_quando";
  DROP TYPE "public"."enum_users_papel";
  DROP TYPE "public"."enum_configuracoes_horarios_icone";`)
}
