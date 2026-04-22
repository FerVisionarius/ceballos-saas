-- ============================================================
-- INMOBILIARIA CEBALLOS — Schema de base de datos
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ── Tabla: usuarios ─────────────────────────────────────────
create type user_role as enum ('superadmin', 'admin', 'comercial', 'readonly');

create table if not exists public.usuarios (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  nombre      text not null,
  apellidos   text not null,
  rol         user_role not null default 'comercial',
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger para actualizar updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger usuarios_updated_at
  before update on public.usuarios
  for each row execute function update_updated_at();

-- ── Tabla: clientes ─────────────────────────────────────────
create table if not exists public.clientes (
  id                    uuid primary key default uuid_generate_v4(),
  nombre                text not null,
  apellidos             text not null,
  nif_nie               text,
  telefono              text,
  email                 text,
  direccion             text,
  ciudad                text,
  codigo_postal         text,
  nacionalidad          text,
  estado_civil          text,
  representante_nombre  text,
  representante_nif     text,
  notas                 text,
  activo                boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid references public.usuarios(id)
);

create trigger clientes_updated_at
  before update on public.clientes
  for each row execute function update_updated_at();

create index idx_clientes_nombre on public.clientes(nombre, apellidos);
create index idx_clientes_nif on public.clientes(nif_nie);

-- ── Tabla: documentos ───────────────────────────────────────
create type tipo_documento as enum (
  'nota_encargo',
  'documento_conformidad',
  'documento_senal',
  'contrato_arras',
  'reconocimiento_honorarios',
  'contrato_arrendamiento'
);

create type subtipo_documento as enum (
  'nota_encargo_exclusiva',
  'nota_encargo_sin_exclusiva',
  'conformidad_arras_confirmatorias',
  'conformidad_arras_penitenciales',
  'senal_arrendamiento',
  'senal_compraventa_confirmatoria',
  'senal_compraventa_confirmatoria_banco',
  'senal_compraventa_penitencial_banco',
  'senal_compraventa_penitencial',
  'senal_oferta',
  'contrato_arras_penitencial',
  'contrato_arras_confirmatoria',
  'reconocimiento_honorarios',
  'contrato_arrendamiento',
  'contrato_arrendamiento_rescision'
);

create table if not exists public.documentos (
  id          uuid primary key default uuid_generate_v4(),
  tipo        tipo_documento not null,
  subtipo     subtipo_documento not null,
  datos       jsonb not null default '{}',
  cliente_id  uuid references public.clientes(id) on delete set null,
  url_pdf     text,
  url_docx    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references public.usuarios(id)
);

create trigger documentos_updated_at
  before update on public.documentos
  for each row execute function update_updated_at();

create index idx_documentos_subtipo on public.documentos(subtipo);
create index idx_documentos_cliente on public.documentos(cliente_id);
create index idx_documentos_created_by on public.documentos(created_by);
create index idx_documentos_created_at on public.documentos(created_at desc);

-- ── Row Level Security (RLS) ────────────────────────────────

alter table public.usuarios enable row level security;
alter table public.clientes enable row level security;
alter table public.documentos enable row level security;

-- Usuarios: solo pueden ver su propio perfil (excepto admins)
create policy "usuarios_select_own" on public.usuarios
  for select using (
    auth.uid() = id
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
      and u.rol in ('superadmin', 'admin')
    )
  );

create policy "usuarios_update_own" on public.usuarios
  for update using (auth.uid() = id);

-- Clientes: todos los autenticados pueden ver y crear
create policy "clientes_select" on public.clientes
  for select using (auth.uid() is not null);

create policy "clientes_insert" on public.clientes
  for insert with check (auth.uid() is not null);

create policy "clientes_update" on public.clientes
  for update using (
    auth.uid() = created_by
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
      and u.rol in ('superadmin', 'admin')
    )
  );

-- Documentos: todos autenticados pueden ver y crear
create policy "documentos_select" on public.documentos
  for select using (auth.uid() is not null);

create policy "documentos_insert" on public.documentos
  for insert with check (auth.uid() is not null);

create policy "documentos_update" on public.documentos
  for update using (
    auth.uid() = created_by
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
      and u.rol in ('superadmin', 'admin')
    )
  );

-- ── Función: auto-crear perfil al registrar usuario ─────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, email, nombre, apellidos, rol)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', 'Usuario'),
    coalesce(new.raw_user_meta_data->>'apellidos', ''),
    coalesce((new.raw_user_meta_data->>'rol')::user_role, 'comercial')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Usuario superadmin inicial (ajustar email) ───────────────
-- NOTA: Crear primero el usuario en Supabase Auth, luego ejecutar:
-- update public.usuarios set rol = 'superadmin' where email = 'admin@ceballos.com';
