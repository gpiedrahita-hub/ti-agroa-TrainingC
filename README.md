# 📚 Guía - Capacitación Next.js Infinite Herbs

# Infinite Herbs - Capacitación Next.js 16+

## Proyectos Prácticos Full-Stack

**Fecha:** 4 de Marzo 2026

## 📋 Índice

1. [Visión General](https://www.perplexity.ai/search/creame-ele-readme-md-de-la-cap-h6cnBlJlQaK3bl17Bssorg#visi%C3%B3n-general)
2. [Estructura Proyectos](https://www.perplexity.ai/search/creame-ele-readme-md-de-la-cap-h6cnBlJlQaK3bl17Bssorg#estructura-proyectos)
3. [Requisitos](https://www.perplexity.ai/search/creame-ele-readme-md-de-la-cap-h6cnBlJlQaK3bl17Bssorg#requisitos)
4. [Comandos Rápidos](https://www.perplexity.ai/search/creame-ele-readme-md-de-la-cap-h6cnBlJlQaK3bl17Bssorg#comandos-r%C3%A1pidos)
5. [Configuración](https://www.perplexity.ai/search/creame-ele-readme-md-de-la-cap-h6cnBlJlQaK3bl17Bssorg#configuraci%C3%B3n)
6. [Despliegue](https://www.perplexity.ai/search/creame-ele-readme-md-de-la-cap-h6cnBlJlQaK3bl17Bssorg#despliegue)
7. [Troubleshooting](https://www.perplexity.ai/search/creame-ele-readme-md-de-la-cap-h6cnBlJlQaK3bl17Bssorg#troubleshooting)

## 🚀 Visión General

**Objetivo:** Dominar Next.js 16+ (App Router) con proyectos reales

**Tecnologías:**

`text🟩 Frontend: Next.js 16 + TypeScript + Tailwind + shadcn/ui + i18n
🟦 Backend: .NET 10 API 
🟨 Backend: Python FastAPI
🔵 Full-Stack: Integración completa **+ Cloudflare Workers Ready**`

**Aprenderás:**

- [x]  App Router + Server Components
- [x]  Static Export (S3/Cloudflare)
- [x]  Middleware (auth/i18n)
- [x]  APIs REST multi-stack
- [x]  **Cloudflare Workers deployment**
- [x]  Testing E2E (Playwright)

## 📁 Estructura de Proyectos

```java
ti-agroa-TrainingC/
├── .github/
├── documentation/
├── infinite-herbs-backend-.net/     [Backend .NET]
├── infinite-herbs-backend-python/   [Backend Python] 
├── infinite-herbs-frontend/         [Frontend Next.js]
└── infinite-herbs-full-stack/       [🔥 Stack Completo + Cloudflare Workers]
```

## 🛠️ Requisitos Previos

| Herramienta | Versión Mínima | Comando Verificación |
| --- | --- | --- |
| **Node.js** | 20.x | `node --version` |
| **npm/yarn** | Latest | `npm --version` |
| **.NET SDK** | 10.0 | `dotnet --version` |
| **Python** | 3.13 | `python --version` |
| **Wrangler** | Latest | `npx wrangler --version` |

```bash
# Cloudflare Workers CLI
npm install -g wrangler
wrangler login
```

## ▶️ Comandos Rápidos - DESARROLLO

## 1️⃣ **Frontend Next.js** ⭐

```bash
cd infinite-herbs-frontend
npm install
npm run dev
```

**URL:** `http://localhost:3000/es` | `http://localhost:3000/en`

## 2️⃣ **Backend .NET API**

```bash
cd infinite-herbs-backend-.net
# Migracion base de datos MSSQL
dotnet ef migrations add "Initial"
dotnet ef database update "Initial"
# Ejecucion
dotnet build
dotnet run
```

**URL:** `https://localhost:5001`

## 3️⃣ **Backend Python FastAPI**

```bash
cd infinite-herbs-backend-python
# Configurar ambiente
python -m venv venv
# Activar ambiente
# windows
venv\Scripts\activate.ps1
# linux
source venv/bin/activate
# Instalar dependencias
pip install -r requirements.txt
# Configurar .env
## tomar ejemplo las variables de .env.example en el el arhivo .env en la base del directorio
# Poblar base de datos
python seed.py
# Ejecutar
python run.py
```

**URL:** `http://localhost:5001`

## 4️⃣ **Full-Stack + Cloudflare Workers** 🔥

```bash
cd infinite-herbs-full-stack

# Desarrollo local
npm run dev
# Frontend: http://localhost:3000

# Preview Worker Cloudflare
npm run preview
# Frontend: http://localhost:8787

```

## ☁️ Cloudflare Workers - Deploy Full-Stack

## **🚀 Deploy 1-Click (Full-Stack)**

```bash
cd infinite-herbs-full-stack
npm install
npx wrangler deploy
```

**Resultado:**

- ✅ Frontend + Backend en un solo dominio
- ✅ Edge caching automático
- ✅ HTTPS global
- ✅ Custom domain ready

## **Configuración Workers (`wrangler.toml`)**

```bash
name = "infinite-herbs-fullstack"
main = "dist/index.js"
compatibility_date = "2026-03-04"

[vars]
JWT_SECRET = "tu-secret"
DATABASE_URL = "postgres://..."

[[routes]]
pattern = "infinite-herbs.${usuario}.workers.dev"
custom_domain = true
```

## ⚡ Comandos PRODUCCIÓN

## Frontend - Static Export (S3 Ready)

```bash
cd infinite-herbs-frontend
npm run build:static
mkdir -p dist && cp -r .next/export/* dist/
aws s3 sync dist/ s3://infinite-herbs-frontend --delete --acl public-read
```

## **Full-Stack - Cloudflare Workers** ⭐

```bash
cd infinite-herbs-full-stack
npm run build
npx wrangler deploy --env production
```

## Backend .NET / Python (Alternativos)

```bash
# .NET
dotnet publish -c Release -o ./publish

# Python
pip install -r requirements-prod.txt
python run.py
```

## ⚙️ Configuración (.env.local)

**Frontend** `infinite-herbs-frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:5001"
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_SITE_NAME="Infinite Herbs"
NODE_ENV=local
```

**Full-Stack** `infinite-herbs-full-stack/wrangler.toml`:

```bash
[env.production]
vars = { 
  JWT_SECRET="${JWT_SECRET}",
  DATABASE_URL="${DATABASE_URL}",
  NEXT_PUBLIC_SITE_NAME="${NEXT_PUBLIC_SITE_NAME}", 
  NEXT_PUBLIC_API_TIMEOUT="${NEXT_PUBLIC_API_TIMEOUT}",
  NODE_ENV="${NODE_ENV}",
}
```

## 📱 Funcionalidades

| Feature | Status | Rutas |
| --- | --- | --- |
| **i18n** | ✅ | `/es`, `/en` |
| **Auth JWT** | ✅ | `/login`, `/register` |
| **Dashboard** | ✅ | `/dashboard/users` |
| **Static SSG** | ✅ | Frontend standalone |
| **Cloudflare Workers** | ✅ | **Full-Stack integrado** |
| **Middleware** | ✅ | Edge execution |
| **TypeScript** | ✅ | Full typed |

---

## 🚀 Despliegue Production - Opciones

| Plataforma | Proyecto | Comando |
| --- | --- | --- |
| **Cloudflare Workers** | **Full-Stack** | `npx wrangler deploy` ⭐ |
| **S3 + CloudFront** | Frontend | `aws s3 sync` |
| **Railway/Render** | Backend | `git push` |
| **Neon** | Database | Managed PostgreSQL |

---

## 🔍 URLs Locales Completas

| Servicio | Puerto | URL Desarrollo | Production |
| --- | --- | --- | --- |
| **Frontend** | 3000 | `localhost:3000` | S3/Cloudflare |
| **Backend .NET** | 5001 | `https://localhost:5001` | Railway |
| **Backend Python** | 5001 | `http://localhost:5001` | Render |
| **Full-Stack** | 8787 | `localhost:8787` | **`workers.dev`** |

## 🐛 Troubleshooting Común

| Problema | Solución |
| --- | --- |
| **No estilos CSS** | `assetPrefix: './_next/static'` en `next.config.js` |
| **Middleware no funciona** | `proxy.ts` en **RAÍZ** del proyecto |
| **Workers deploy falla** | `wrangler dev` primero + secrets configurados |
| **CORS error** | `wrangler.toml` → `ALLOWED_ORIGINS=*` |
| **Build no genera export** | Next.js 16 usa `.next/export/` |

## 🎯 Para Empezar YA - **Recomendado**

```bash
# 🔥 Opción 1: Full-Stack Cloudflare (30 segundos)
cd infinite-herbs-full-stack
npm install
npm run preview
# Visita: http://localhost:8787/es/dashboard

# 🚀 Deploy production
npm run deploy
# Visita: https://infinite-herbs.tu-nombre.workers.dev
```

```bash
# 📋 Opción 2: Desarrollo separado
# T1: cd infinite-herbs-backend-python && python run.py
# T2: cd infinite-herbs-frontend && npm run dev
```

**¡Listo para la práctica!** 🚀

*Marzo 2026 - Bogotá, Colombia*