# EduAdmin + Aiven + Vercel

Variables necesarias en Vercel:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME
- DB_SSL_MODE=REQUIRED
- DB_SSL_CA (recomendado; certificado CA de Aiven)

El proyecto usa `mysql2` y conexiones TLS. No subas contraseñas a GitHub.

El esquema está en `database/schema.sql`. Se puede inicializar con `npm run db:init` desde una máquina que tenga Node.js y las variables configuradas.
