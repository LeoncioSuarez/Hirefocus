# Especificaciones Técnicas: ATS Inteligente  - Hirefocus

**Stack:** FastAPI (Python) + React (Vite) + PostgreSQL

Estructura y flujos de integración para la aplicación ATS.

---

## 1. Arquitectura de Integraciones
Enfoque en la experiencia de usuario y automatización.

1.  **Affinda (Parsing):** Extracción automática de datos de CVs (PDF/Docx a JSON) para poblar perfiles de candidatos.
2.  **Stream Chat:** Chat en tiempo real para la comunicación fluida entre reclutadores y candidatos. **Los contactos (candidatos) están sincronizados como usuarios de Stream Chat.**
3.  **Nylas:** Gestión unificada de correos y calendarios (Sincronización bidireccional con Google/Outlook).

---

## 2. Modelo de Datos (Esquema SQL)

Base de datos PostgreSQL utilizando **SQLModel** (Pydantic + SQLAlchemy).
*Los nombres de tablas y columnas están en inglés para estandarización del código.*

### Tablas Principales

| Tabla (Table) | Descripción | Campos Clave (Key Fields) |
| :--- | :--- | :--- |
| **`users`** | Usuarios del sistema (Reclutadores, Admins) | `id`, `username`, `email`, `hashed_password`, `is_active`, `avatar_url`, `stream_token`, `nylas_grant_id`, `created_at` |
| **`job_offers`** | Vacantes de empleo (Jobs) | `id`, `title`, `description`, `required_skills` (JSON), `applicant_count`, `category`, `salary_range`, `location`, `type`, `status`, `created_at` |
| **`candidates`** | Perfiles de candidatos y contactos | `id`, `full_name`, `email`, `phone`, `avatar_url`, `stream_id`, `stream_token`, `affinda_resume_id`, `skills` (JSONB), `resume_url`, `linkedin_url`, `created_at` |
| **`applications`** | Relación Candidato-Vacante (Pipeline) | `id`, `candidate_id` (FK `candidates.id`), `job_id` (FK `job_offers.id`), `stage` (Screening/Interview/Hired), `created_at` |
| **`events`** | Eventos de calendario (Entrevistas) | `id`, `nylas_event_id`, `application_id`, `title`, `start_time`, `end_time`, `participants` (JSON) |
| **`notes`** | Notas internas sobre candidatos | `id`, `candidate_id`, `user_id` (Autor), `content`, `created_at` |
| **`documents`** | Otros documentos adjuntos | `id`, `candidate_id`, `file_url`, `file_type`, `created_at` |

---

## 3. Flujos de Trabajo (Workflows)

### A. Procesamiento de CVs (Affinda)
*   **Acción:** El usuario sube un archivo (PDF/Docx).
*   **Lógica:** FastAPI lo envía a **Affinda**, recibe el JSON y actualiza la tabla `candidates`.
*   **Sincronización:** Al crear un candidato, se genera automáticamente su perfil en **Stream Chat** si se desea habilitar la comunicación directa.

### B. Comunicación en Tiempo Real y Sincronización de Contactos (Stream Chat)
*   **Sincronización de Contactos:** Todos los registros en `candidates` tienen un `stream_id` único. Cuando un reclutador abre la vista de "Contactos", puede iniciar chats directamente con ellos. 
*   **Autenticación:**
    - Reclutadores: Usan su `stream_token` de la tabla `users`.
    - Candidatos (si acceden): Usan su `stream_token` de la tabla `candidates`.
*   **Frontend:** El componente de Chat muestra la lista de contactos sincronizada desde el backend o recuperada mediante el cliente de Stream filtrando por los miembros del canal.

### C. Correo y Calendario (Nylas)
*   **Sincronización:** Registro de `nylas_grant_id` en `users`.
*   **Calendario:** Gestión de citas y disponibilidad vía Nylas API, reflejado en la tabla `events`.


## 4. Estructura del Proyecto

```
Hirefocus/
├── backend/
│   ├── core/               # Configuración (Env vars, Security, Hash)
│   ├── db/                 # Conexión DB (database.py)
│   ├── models/             # Modelos SQLModel (users.py, jobs.py, applicants.py, etc.)
│   ├── routers/            # Endpoints de la API (auth, users, jobs, integrations)
│   ├── schemas/            # Pydantic Schemas para Request/Response (DTOs)
│   ├── services/           # Lógica de negocio e Integraciones (affinda_client.py, nylas_service.py, stream_service.py)
│   ├── main.py             # Entry point FastAPI
│   └── alembic/            # Migraciones de base de datos
│
└── frontend/               # React (Vite)
    ├── src/
    │   ├── api/            # Llamadas a Axios (endpoints backend)
    │   ├── assets/         # Imágenes, iconos, fuentes
    │   ├── components/     # Componentes UI reutilizables (Botones, Modales, Layouts)
    │   ├── context/        # React Context (AuthContext, ThemeContext)
    │   ├── hooks/          # Custom Hooks
    │   ├── pages/          # Vistas (DashboardCompany, Projects, Contacts, CalendarPage, Login)
    │   ├── utils/          # Funciones auxiliares
    │   └── App.js          # Configuración de Rutas (React Router)
```

### Funciones Clave del Frontend (Actual state):
*   **DashboardCompany:** Vista principal para reclutadores.
*   **Projects (Job Offers):** Listado y gestión de vacantes (`job_offers`).
*   **Contacts (Candidates):** Gestión de candidatos (`candidates`), buscador y filtrado.
*   **Calendar:** Vista de agenda e integración con Nylas.
