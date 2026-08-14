# Bitácoras de viaje — contexto del proyecto

App de una sola página para registrar viajes familiares (itinerario, historia, diario, fotos y caza de
tesoros con puntos) y momentos sueltos. Sin backend, sin base de datos, sin build.

## Restricciones que NO se pueden romper

Estas condicionan casi cada decisión. Antes de proponer un cambio, comprobar que no choca con ninguna:

1. **Se usa desde Chrome en Android**, sobre una carpeta de Google Drive montada por el proveedor de
   archivos del sistema. Es el escenario principal, no el de escritorio.
2. **Todo el HTML, CSS y JS va en `index.html`**, en un solo archivo. Sin bundler, sin npm, sin frameworks.
   Se edita, se sube al repo y funciona.
3. **Debe funcionar sin conexión.** Las librerías externas se cargan desde `lib/` y solo caen al CDN si
   faltan. No añadir dependencias nuevas sin una copia local en `lib/`.
4. **Los datos nunca se guardan en el repositorio.** Viajes, momentos y fotos viven en la carpeta que el
   usuario elige. El repo es solo la app. `.gitignore` bloquea `*.jpg` y `bitacora.json`.
5. **La lectura de la carpeta va por File System Access API** (`showDirectoryPicker`). No sustituir por
   subida de archivos ni por almacenamiento del navegador: el usuario quiere sus archivos en su carpeta.
6. **Español en toda la interfaz**, incluidos mensajes de error.

## Cómo están los datos

```
Carpeta raíz elegida por el usuario
├─ 202606 - CruceroIslasGriegas/
│   ├─ bitacora.json      itinerario + reseñas + índice de fotos
│   ├─ mapa.jpg           opcional
│   └─ *.jpg              fotos del diario y pruebas de capturas
├─ amsterdam-2027/
│   └─ bitacora.json
└─ Momentos/
    ├─ momentos.json      { people: [], moments: [] }
    └─ momento_*.jpg
```

Un viaje es cualquier subcarpeta con `bitacora.json`. El esquema completo está en `GUIA-bitacoras.md`;
si se cambia el formato, actualizar esa guía en el mismo commit.

Campos de estado dentro de `bitacora.json`, escritos por la app: `visited` (array), `journals`,
`caught`, `photoFiles`, `statueFiles` (objetos indexados por `"díaÍndice"` o `"día-objetivo"`).

## Arquitectura de `index.html`

Variables globales que llevan el estado: `rootHandle` (carpeta raíz), `tripHandles` (viajes
encontrados), `tripDir` y `D` (viaje abierto), `momDir` y `M` (momentos), `urls` (miniaturas),
`fullUrls` (originales bajo demanda), `pending` (imágenes que fallaron).

Bloques principales, en orden dentro del `<script>`:

- **Temas** — `THEMES` y `HERO_ART`: paletas, tipografías e ilustración SVG de cabecera por tipo de viaje
  (`crucero`, `velero`, `montana`, `playa`, `ciudad`, `carretera`). `applyTheme()` los aplica a variables CSS.
- **Almacenamiento de handles** — `db()`, `rememberRoot()`, `recallRoot()`.
- **Escaneo** — `pickRoot()`, `scanTrips()`. `pickerBusy` impide dos selectores a la vez (Chrome falla).
- **Biblioteca y momentos** — `showLibrary()`, `showMoments()`, formulario de momentos.
- **Caché de miniaturas** — `cacheInit()` detecta si hay IndexedDB (solo por `https`) o cae a
  `localStorage` (necesario en `file://`). `thumbSize()` y `thumbQuality()` aprietan más en localStorage.
- **Render del viaje** — `renderTrip()`, `dayCard()`, `scoreboard()`.
- **Carga de imágenes** — `loadMedia()` y `readPending()`. Lee de dos en dos con 3 reintentos: Drive en
  Android sirve los archivos de uno en uno y con más concurrencia caducan.
- **Guardado** — `save()` (con debounce), `writeFile(name, blob, dir)`.
- **Mapa** — Leaflet, `initMap()`. Las rutas a pie aparecen al superar cierto zoom.
- **PDF** — `generatePDF()` abre una ventana maquetada y lanza el diálogo de impresión.

## Al terminar cualquier cambio

1. **Sube `VERSION` en `sw.js`** (`bitacoras-vN` → `vN+1`). Sin eso, la app instalada sigue sirviendo la
   versión cacheada y el cambio no llega. Es el error más fácil de cometer aquí. Ese número es el único que
   se escribe: la insignia de la barra superior se lo pregunta al service worker (`postMessage('version')`),
   así que no hay que tocarlo en `index.html`.
2. Comprobar que el JS sigue siendo válido y que no se han roto los viajes existentes.
3. No dejar `console.log` de depuración; los errores se muestran al usuario con `status(msg, true)`.

## Estilo del código

- Sin punto y coma opcional omitido, comillas simples, `const`/`let`.
- Comentarios en español y solo donde explican un *por qué* no evidente (una limitación de Drive, un fallo
  de Chrome). No comentar lo que el código ya dice.
- Los textos de interfaz se escapan con `esc()` antes de meterlos en plantillas.
- Errores: nunca fallar en silencio. `try/catch` y `status()` con un mensaje que diga qué hacer.
