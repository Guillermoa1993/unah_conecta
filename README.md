# 🐾 UNAH Conecta Pumas

> Plataforma web para la gestión de eventos universitarios de la **Universidad Nacional Autónoma de Honduras (UNAH)**.  
> Proyecto integrador — Grupo 1

---

## 📋 Descripción

UNAH Conecta Pumas centraliza la creación, aprobación y seguimiento de eventos académicos, culturales, deportivos y sociales. Permite a estudiantes inscribirse, registrar asistencia por QR y solicitar constancias de horas VOAE.

### Roles del sistema

| Rol | Acceso |
|-----|--------|
| **Estudiante** | Ver eventos, inscribirse, escanear QR, historial de horas |
| **Tutor** | Crear eventos, gestionar mis eventos, modo evento en vivo |
| **VOAE** | Aprobar/rechazar eventos, gestionar constancias, moderadores |
| **Admin** | Usuarios, roles, permisos, configuración del sistema |
| **Dev** | Acceso completo (modo preview para desarrollo) |

---

## 🛠️ Tecnologías

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

- React 18 + TypeScript + Vite 6
- Tailwind CSS v4 + shadcn/ui
- React Router v7
- Lucide Icons + Recharts

### Backend
![Node](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)

- Express.js 5 + TypeScript
- PostgreSQL (Render.com)
- Clean Architecture (Domain → Use Cases → Infrastructure → Interfaces)
- JWT + Bcrypt

---

## 📁 Estructura del proyecto

```
unah_conecta/
├── backend/                    # API REST
│   ├── database/
│   │   └── schema.sql          # DDL completo de la BD
│   ├── scripts/
│   │   └── initDb.ts           # Script de inicialización de tablas
│   └── src/
│       ├── domain/             # Entidades e interfaces (sin dependencias)
│       │   ├── entities/       # Usuario, Evento, Inscripcion, Asistencia...
│       │   └── repositories/   # Contratos de repositorios
│       ├── use-cases/          # Lógica de negocio pura
│       │   ├── auth/           # Login, Registro
│       │   ├── eventos/        # CRUD + Aprobar/Rechazar
│       │   ├── inscripciones/  # Inscribir, Cancelar
│       │   ├── asistencia/     # Registro por QR
│       │   └── constancias/    # Gestión horas VOAE
│       ├── infrastructure/     # Implementaciones concretas
│       │   ├── database/       # Conexión PostgreSQL (pg Pool)
│       │   └── repositories/   # Queries SQL por entidad
│       └── interfaces/         # Capa HTTP
│           ├── controllers/    # Handlers Express
│           ├── middlewares/    # JWT auth + error handler
│           └── routes/         # Definición de rutas por módulo
│
├── frontend/                   # App React
│   └── src/
│       ├── app/
│       │   ├── components/     # UI reutilizable (shadcn + custom)
│       │   ├── pages/          # Páginas por rol (student/tutor/admin/voae)
│       │   └── routes.tsx      # Definición de rutas
│       ├── context/            # AuthContext (JWT global)
│       ├── hooks/              # useEventos, useAuth, useNotificaciones...
│       ├── services/           # Capa API (fetch + JWT automático)
│       └── types/              # Tipos TypeScript compartidos
│
├── docker-compose.yml          # Orquestación de servicios
└── INSTRUCCIONES.txt           # Guía detallada de uso
```

---

## ⚙️ Requisitos previos

- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(opcional, para Adminer)*

---

## 🚀 Instalación y ejecución

### Clonar el repositorio

```bash
git clone https://github.com/Guillermoa1993/unah_conecta.git
cd unah_conecta
git checkout Grupo_1
```

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Inicializar tablas en la BD (solo la primera vez)
npm run db:init

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5000
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar app
npm run dev
# → http://localhost:5185
```

---

## 🐳 Ejecución con Docker

```bash
# Producción
docker compose up --build

# Desarrollo con hot-reload
docker compose --profile dev up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| Adminer (BD) | http://localhost:8080 |

### Credenciales Adminer

| Campo | Valor |
|-------|-------|
| Sistema | PostgreSQL |
| Servidor | `dpg-d8f4rregvqtc738td3og-a.virginia-postgres.render.com` |
| Usuario | `unahcu` |
| Base de datos | `puma_conecta` |

---

## 🌐 Endpoints del API

### Autenticación
```
POST   /api/auth/login
POST   /api/auth/registro
GET    /api/auth/me
```

### Eventos
```
GET    /api/eventos
GET    /api/eventos/mis-eventos
GET    /api/eventos/pendientes
GET    /api/eventos/:id
POST   /api/eventos
PUT    /api/eventos/:id
PATCH  /api/eventos/:id/aprobar
PATCH  /api/eventos/:id/rechazar
```

### Inscripciones
```
GET    /api/inscripciones/mis-inscripciones
POST   /api/inscripciones/evento/:id
DELETE /api/inscripciones/evento/:id
```

### Asistencia
```
POST   /api/asistencia/qr
POST   /api/asistencia/manual/evento/:id
GET    /api/asistencia/evento/:id
```

### Constancias VOAE
```
GET    /api/constancias/mis-constancias
GET    /api/constancias/pendientes
POST   /api/constancias/evento/:id
PATCH  /api/constancias/:id/aprobar
PATCH  /api/constancias/:id/rechazar
```

### Notificaciones
```
GET    /api/notificaciones
GET    /api/notificaciones/no-leidas
PATCH  /api/notificaciones/:id/leer
PATCH  /api/notificaciones/leer-todas
```

> Todas las rutas (excepto login y registro) requieren:  
> `Authorization: Bearer <token>`

---

## 🔑 Variables de entorno

### `backend/.env`
```env
DATABASE_URL=postgresql://unahcu:password@host/puma_conecta?sslmode=require
PORT=5000
JWT_SECRET=tu_secret_aqui
FRONTEND_URL=http://localhost:5185
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏛️ Arquitectura

El backend sigue **Clean Architecture** con separación estricta de capas:

```
Interfaces (HTTP)  →  Use Cases (Negocio)  →  Domain (Entidades)
                              ↑
                    Infrastructure (BD, APIs externas)
```

Esto garantiza que la lógica de negocio sea independiente del framework y la base de datos.

---

## 👥 Equipo — Grupo 1

Proyecto integrador de Ingeniería en Sistemas — UNAH  
Curso: Programación Web / Ingeniería de Software

---

<div align="center">
  <img src="frontend/public/puma_unah.png" height="60" alt="UNAH Pumas"/>
  <p><strong>Universidad Nacional Autónoma de Honduras</strong></p>
</div>
