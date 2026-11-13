# Forja Gym

App web móvil para registrar entrenamientos de gimnasio: rutinas por objetivo, series con descanso automático, biblioteca de más de 110 ejercicios con figuras 3D, rangos de fuerza, ranking de puntos con ligas, análisis de comidas por foto y 12 colores de tema. Es un único archivo (`index.html`), sin dependencias ni paso de compilación.

## Usarla

- **En local:** abre `index.html` en el navegador. Los datos se guardan en el `localStorage` del navegador.
- **Publicada:** al subir a `main`, GitHub Actions la despliega en GitHub Pages (`https://salbaconb.github.io/forjagym/`). Actívalo en *Settings > Pages > Source: GitHub Actions*.

## Cuentas en la nube (opcional, Supabase)

Sin configurar nada, las cuentas viven solo en el dispositivo. Para sincronizar entre dispositivos:

1. Crea un proyecto en [Supabase](https://supabase.com).
2. En *SQL Editor*, ejecuta `supabase_setup.sql`.
3. En *Project Settings > API*, copia la URL del proyecto y la clave `anon` / `publishable`.
4. Pégalas en `index.html`, en las constantes `SUPABASE_URL` y `SUPABASE_KEY` (al principio del script).

La clave `anon` es pública por diseño; la seguridad la dan las políticas RLS del SQL. Nunca pongas la clave `service_role`.

## Análisis de comidas por foto

La sección **Comida** usa Claude para estimar productos y calorías, y solo funciona al abrir la app desde Claude (como artefacto). En GitHub Pages la foto se archiva y se puede analizar más tarde.

## Estructura

| Archivo | Qué es |
| --- | --- |
| `index.html` | Toda la app (HTML, CSS y JS) |
| `supabase_setup.sql` | Tabla, políticas RLS y borrado de cuenta |
| `.github/workflows/pages.yml` | Despliegue en GitHub Pages |
| `.nojekyll` | Evita el procesado de Jekyll |
