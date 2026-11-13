# Forja

Aplicación de escritorio (Windows, Mac y Linux) para registrar entrenamientos de gimnasio: rutinas por objetivo, series con descanso automático, más de 110 ejercicios con figuras 3D, rangos de fuerza, ranking de puntos con ligas, comidas por foto y 12 colores de tema. Hecha con [Electron](https://www.electronjs.org/).

## Descargar e instalar

Cada vez que se sube código a `main`, GitHub compila los instaladores y los publica en **Releases**: https://github.com/salbaconb/forjagym/releases/tag/descarga

| Sistema | Archivo |
| --- | --- |
| Windows | `Forja-win-x64.exe` (instalador) |
| Mac | `Forja-mac-arm64.dmg` (Apple Silicon) o `Forja-mac-x64.dmg` (Intel) |
| Linux | `Forja-linux-x86_64.AppImage` (dale permiso de ejecución y ábrelo) |

Los instaladores no están firmados, así que el sistema avisará la primera vez:

- **Windows:** *Más información > Ejecutar de todas formas*.
- **Mac:** clic derecho sobre Forja > *Abrir*, y confirma.

Los datos se guardan en tu ordenador, en la carpeta de datos de la aplicación.

## Ejecutarla desde el código

Necesitas [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm start          # abre Forja en modo desarrollo
npm run dist       # crea el instalador de tu sistema en dist/
```

## Estructura

| Ruta | Qué es |
| --- | --- |
| `src/main.js` | Proceso principal de Electron: ventana, enlaces externos, instancia única |
| `src/renderer/index.html` | Estructura de la interfaz |
| `src/renderer/styles/` | Estilos: `base.css`, `tema.css`, `serio.css` (tema actual), `movil.css` |
| `src/renderer/js/app.js` | Lógica de la aplicación |
| `build/` | Icono de la aplicación |
| `supabase_setup.sql` | Tabla y políticas para cuentas en la nube (opcional) |
| `.github/workflows/build.yml` | Compila los instaladores y los publica en Releases |

## Cuentas en la nube (opcional, Supabase)

Sin configurar nada, las cuentas viven solo en el ordenador. Para sincronizar entre dispositivos:

1. Crea un proyecto en [Supabase](https://supabase.com).
2. En *SQL Editor*, ejecuta `supabase_setup.sql`.
3. En *Project Settings > API*, copia la URL del proyecto y la clave `anon` / `publishable`.
4. Pégalas en `src/renderer/js/app.js`, en `SUPABASE_URL` y `SUPABASE_KEY` (al principio).

La clave `anon` es pública por diseño; la seguridad la dan las políticas RLS del SQL. Nunca pongas la clave `service_role`.

## Comida por foto

El análisis automático de calorías usa Claude y solo funciona cuando la app se abre desde Claude. En la aplicación de escritorio la foto se archiva y no se analiza.
