# Inmobiliaria Ceballos — SaaS de Gestión Documental

## Stack
- **Next.js 14** (App Router + Server Components)
- **Supabase** (PostgreSQL + Auth + Storage)
- **NextAuth.js** (gestión de sesiones y roles)
- **Tailwind CSS**
- **Coolify** (despliegue en VPS)

---

## 1. Setup local (Cursor)

```bash
# Clonar / abrir en Cursor
npm install

# Copiar variables de entorno
cp .env.example .env.local
# → Rellenar con tus credenciales de Supabase

npm run dev
# → http://localhost:3000
```

---

## 2. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar:
   ```
   supabase/migrations/001_schema_inicial.sql
   ```
3. En **Authentication → Settings**:
   - Desactivar "Confirm email" para entorno de pruebas
4. Crear el primer usuario en **Authentication → Users**
5. Darle rol superadmin:
   ```sql
   update public.usuarios set rol = 'superadmin' where email = 'TU@EMAIL.COM';
   ```
6. Copiar las claves a `.env.local`

---

## 3. Despliegue en Coolify

### Prerequisitos
- VPS con Coolify instalado
- Dominio apuntando al VPS

### Pasos en Coolify

1. **New Resource → Application → GitHub**
2. Seleccionar el repositorio
3. **Build Pack**: Dockerfile
4. **Port**: 3000
5. **Environment Variables** — añadir todas las del `.env.example`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXTAUTH_URL=https://gestion.ceballos.com
   NEXTAUTH_SECRET=<generar con: openssl rand -base64 32>
   ```
6. **Domain**: `gestion.ceballos.com`
7. Deploy → ✅

### Auto-deploy con Git

En Coolify activar **Webhook** para deploy automático en cada push a `main`.

---

## 4. Estructura del proyecto

```
app/
├── (auth)/login/          → Login
├── (app)/
│   ├── dashboard/         → Dashboard principal
│   ├── clientes/          → Gestión de clientes
│   └── documentos/        → Módulo documental
│       └── nuevo/         → Wizard de creación
components/
├── ui/                    → Componentes UI base
└── documentos/
    ├── DocumentoWizard    → Orquestador del flujo
    ├── SelectorTipo       → Paso 1: selección de tipo
    ├── SelectorSubtipo    → Paso 2: selección de subtipo
    ├── FormularioDinamico → Paso 3: formulario con validación
    └── CampoInput         → Renderizado de cada tipo de campo
lib/
├── documentos/schema.ts   → ← AQUÍ están los 15 documentos
└── utils.ts
supabase/migrations/       → SQL para la base de datos
```

---

## 5. Roles de usuario

| Rol | Acceso |
|-----|--------|
| `superadmin` | Todo, incluyendo ajustes y gestión de usuarios |
| `admin` | Todo excepto gestión de usuarios avanzada |
| `comercial` | Clientes + Documentos |
| `readonly` | Solo dashboard y visualización |

---

## 6. Próximos pasos (Sprint 2)

- [ ] Generación de PDF con `@react-pdf/renderer`
- [ ] Exportación a Word con `docx`
- [ ] Subida a Supabase Storage + URL firmada
- [ ] Formulario de nuevo cliente
- [ ] Búsqueda y filtrado de clientes
- [ ] Página de detalle de cliente con historial de documentos
- [ ] Panel de ajustes y gestión de usuarios

---

## 7. Añadir o modificar documentos

Para añadir un nuevo tipo de documento o modificar los campos de uno existente, editar únicamente:

```
lib/documentos/schema.ts
```

El formulario dinámico se adapta automáticamente sin tocar ningún componente de UI.
