# Suez Guide - Project Structure

## Quick Start

**To run the project:**
```bash
# Open the main entry point
open public/index.html
```

---

## Directory Structure

```
suez_guide/
├── public/              🌐 Deployment (serve this)
│   ├── index.html       Main entry point
│   ├── pages/           All user pages
│   ├── css/             Styles
│   └── assets/          Images, media
│
├── src/                 💻 Source Code (Clean Architecture)
│   ├── presentation/    UI Logic
│   │   ├── controllers/ Event handlers
│   │   ├── renderers/   DOM updates
│   │   └── utils/       UI helpers
│   ├── business/        Business Logic
│   │   └── services/    Use cases, caching
│   └── data/            Data Access
│       └── repositories/ API calls
│
├── common/              🔧 Shared Utilities
│   ├── config/          App configuration
│   ├── theme/           Theme system
│   ├── i18n/            Internationalization
│   └── services/        Common services
│
└── admin/               👤 Admin Panel (separate app)
    ├── index.html
    └── src/             Admin's own architecture
```

---

## Architecture Principles

### 🎯 Clean Architecture (3 Layers)

**1. Presentation Layer** (`src/presentation/`)
- UI rendering & event handling
- No business logic or data access

**2. Business Layer** (`src/business/`)
- Business rules & validation
- Orchestration & caching
- No UI or database code

**3. Data Layer** (`src/data/`)
- Database queries (Supabase)
- API calls
- No business logic or UI

### 📦 src/ vs public/

- **src/** = Source code for development
- **public/** = Compiled output for deployment

---

## How It Works

### Data Flow
```
public/index.html
    ↓ loads
src/presentation/controllers/home-page.js
    ↓ calls
src/business/services/place-service.js
    ↓ calls
src/data/repositories/places-repository.js
    ↓ returns data
src/business/services/ (processes)
    ↓ returns to
src/presentation/controllers/ (coordinates)
    ↓ calls
src/presentation/renderers/home-renderer.js
    ↓ updates
DOM in public/index.html
```

---

## Development Guidelines

### Adding a New Page

1. Create HTML in `public/pages/new-page.html`
2. Create controller in `src/presentation/controllers/new-page.js`
3. Create renderer in `src/presentation/renderers/new-renderer.js`
4. Add service if needed in `src/business/services/`
5. Add repository if needed in `src/data/repositories/`

### Path References

From `public/index.html`:
```html
<script src="src/presentation/controllers/home-page.js"></script>
```

From `public/pages/*.html`:
```html
<script src="../../src/presentation/controllers/page.js"></script>
```

---

## Key Files

- `public/index.html` - Main entry point
- `src/app.js` - Application initializer
- `common/config/config.js` - App configuration
- `common/services/supabase-init.js` - Database setup

---

## Admin Panel

The admin panel is a **separate application** with its own architecture.

Access: `admin/index.html`

---

## Stack

- **Framework:** Vanilla JavaScript (ES6+)
- **Database:** Supabase
- **Icons:** Lucide
- **Architecture:** Clean Architecture (3-layer)
