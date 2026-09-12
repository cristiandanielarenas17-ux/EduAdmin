# Administración de Liceos y Escuelas

Sistema administrativo moderno para estudiantes, mensualidades, pagos, configuración y respaldos.

## Stack
- Next.js + React + TypeScript
- Tailwind CSS
- MySQL
- mysql2
- Recharts
- Lucide React

## Instalación

1. Instala Node.js 20+ y MySQL 8+.
2. Ejecuta `database/schema.sql` en phpMyAdmin/MySQL.
3. Copia `.env.example` como `.env.local` y configura tus credenciales.
4. Ejecuta:

```bash
npm install
npm run dev
```

5. Abre http://localhost:3000

## Funciones incluidas
- Dashboard con KPIs y gráfico
- Alumnos: listar, buscar, crear y eliminar
- Pagos: registrar y listar
- Configuración institucional
- Exportación de respaldo JSON
- Diseño responsive y dark mode
- API interna para alumnos, pagos, configuración y dashboard

## Nota
Los datos de demostración se insertan desde `database/seed.sql`. El sistema puede funcionar sin seed y empezar vacío.


## Corrección del Dashboard
Se separó Recharts en `components/revenue-chart.tsx` como Client Component para evitar el error `Super expression must either be null or a function` durante el renderizado del Dashboard.

## Base de datos local (versión independiente)
EduAdmin utiliza SQLite integrada mediante sql.js. La base de datos se crea automáticamente y se guarda en la carpeta de datos del usuario de Windows. No requiere MySQL, XAMPP ni phpMyAdmin.

Cada instalación de EduAdmin tiene su propia base de datos local. Para mover los datos a otro equipo, utiliza la función de respaldo/restauración de la aplicación.


## Configuración MySQL

1. Crear `administracion_liceos` y las tablas ejecutando `database/schema.sql` en MySQL Workbench.
2. Copiar `.env.example` como `.env.local`.
3. Colocar la contraseña de MySQL en `DB_PASSWORD`.
4. Esta versión usa MySQL en `127.0.0.1:3307` por defecto.
5. Ejecutar `npm install` y luego `npm run dev` para probar.
6. Para generar el instalador de Windows: `npm run desktop:build`.
