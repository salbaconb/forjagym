# Forja Gym

App web móvil para registrar entrenamientos de gimnasio: rutinas por objetivo, series con descanso automático, biblioteca de más de 110 ejercicios con figuras 3D, rangos de fuerza, ranking de puntos con ligas, análisis de comidas por foto y 12 colores de tema. Es un único archivo (`forja.html`), sin dependencias ni paso de compilación.

## Usarla

- **En local:** abre `forja.html` en el navegador. Los datos se guardan en el `localStorage` del navegador.
- **Publicada:** al subir a `main`, GitHub Actions la despliega en GitHub Pages (`https://salbaconb.github.io/forjagym/`). Actívalo en *Settings > Pages > Source: GitHub Actions*.

## Instalarla como app «Forja»

Es una PWA: se instala aparte, con su icono y a pantalla completa, y abre sin conexión. Abre la dirección publicada en el móvil y:

- **Android (Chrome):** menú ⋮ > *Instalar aplicación*.
- **iPhone (Safari):** botón Compartir > *Añadir a pantalla de inicio*.
- **Ordenador (Chrome/Edge):** icono de instalar en la barra de direcciones.

La instalación requiere HTTPS (GitHub Pages ya lo da). Si cambias el código, sube la versión de `CACHE` en `sw.js` para forzar la actualización.

## Cuentas en la nube (opcional, Supabase)

Sin configurar nada, las cuentas viven solo en el dispositivo. Para sincronizar entre dispositivos:

1. Crea un proyecto en [Supabase](https://supabase.com).
2. En *SQL Editor*, ejecuta `supabase_setup.sql`.
3. En *Project Settings > API*, copia la URL del proyecto y la clave `anon` / `publishable`.
4. Pégalas en `forja.html`, en las constantes `SUPABASE_URL` y `SUPABASE_KEY` (al principio del script).

La clave `anon` es pública por diseño; la seguridad la dan las políticas RLS del SQL. Nunca pongas la clave `service_role`.

## Análisis de comidas por foto

La sección **Comida** usa Claude para estimar productos y calorías, y solo funciona al abrir la app desde Claude (como artefacto). En GitHub Pages la foto se archiva y se puede analizar más tarde.

## Estructura

| Archivo | Qué es |
| --- | --- |
| `forja.html` | Toda la app (HTML, CSS y JS) |
| `index.html` | Redirige a `forja.html` para que la web publicada abra en la raíz |
| `supabase_setup.sql` | Tabla, políticas RLS y borrado de cuenta |
| `manifest.webmanifest`, `sw.js`, `icons/` | Instalación como app «Forja» y modo sin conexión |
| `.github/workflows/pages.yml` | Despliegue en GitHub Pages |
| `.nojekyll` | Evita el procesado de Jekyll |
