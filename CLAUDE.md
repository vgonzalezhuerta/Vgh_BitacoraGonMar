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
├─ Momentos/
│   ├─ momentos.json      { people: [], moments: [] }
│   └─ momento_*.jpg
└─ Cervezas/
    ├─ cervezas.json      { schemaVersion, beers: [] }
    └─ cerveza_*.jpg
```

Un viaje es cualquier subcarpeta con `bitacora.json`. El esquema completo está en `FORMATO-viajes.md`;
si se cambia el formato, actualizar ese documento en el mismo commit.

Hay dos clases de viaje: con **itinerario** preparado (`days`, historia, rutas, caza de tesoros) y de
**vacaciones** (`trip.kind: "album"`, sin `days`, con tarjetas en `entries`). Los primeros los prepara un
proyecto de Claude; los segundos los crea la propia app.

Campos de estado dentro de `bitacora.json`, escritos por la app: `visited` (array), `journals`,
`caught`, `photoFiles`, `statueFiles` (objetos indexados por `"díaÍndice"` o `"día-objetivo"`) y `moments`
(por día, lista de momentos con ubicación opcional).

## Arquitectura de `index.html`

Variables globales que llevan el estado: `rootHandle` (carpeta raíz), `tripHandles` (viajes
encontrados), `tripDir` y `D` (viaje abierto), `momDir` y `M` (momentos), `urls` (miniaturas),
`fullUrls` (originales bajo demanda), `pending` (imágenes que fallaron).

Bloques principales, en orden dentro del `<script>`:

- **Temas** — `THEMES` y `HERO_ART`: paletas, tipografías e ilustración SVG de cabecera por tipo de viaje
  (`crucero`, `velero`, `montana`, `playa`, `ciudad`, `carretera`). `applyTheme()` los aplica a variables CSS.
- **Almacenamiento de handles** — `db()`, `rememberRoot()`, `recallRoot()`.
- **Botón atrás** — `marcaPantalla()`, `PADRE` y el `popstate`. La app es una sola página sin historial, así
  que en Android el botón atrás la cerraba. No se guarda un historial completo: se recuerda la pantalla actual
  y atrás sube un escalón según `PADRE` (formulario → su lista → viajes); desde viajes ya sí cierra. Mientras no
  se está en la raíz se mantiene **una** entrada de historial, que es la que recoge el toque. Toda pantalla
  nueva tiene que llamar a `marcaPantalla()` y entrar en `PADRE`, o atrás se saltará un escalón.
- **Escaneo** — `pickRoot()`, `scanTrips()`. `pickerBusy` impide dos selectores a la vez (Chrome falla).
  El arranque no espera al escaneo: `indiceGuardado()` pinta la biblioteca con el índice de la última visita
  (`resumenViaje()` por viaje, guardado en IndexedDB) y `scanTrips()` relee la carpeta por detrás, de dos en dos,
  llamando a `alPintar` con cada viaje que encuentra. Por eso las tarjetas se dibujan desde `t.resumen` y no
  desde `t.data`, que puede no estar todavía: `abreViaje(carpeta)` lee ese `bitacora.json` en el momento de
  abrirlo. Las tarjetas llevan la carpeta y no un índice, porque mientras se escanea la lista se reordena.
- **Biblioteca y momentos** — `showLibrary()`, `showMoments()`, formulario de momentos.
- **Mapamundi** — `showWorldMap()`, `initWorldMap()`: todos los viajes en un mapa, con un punto por viaje (el
  centro de sus sitios) o todos los sitios sueltos. Se pinta del índice, sin abrir ningún `bitacora.json`: los
  puntos van en `resumen.puntos` (paradas con `map`, tarjetas con `lat`, momentos con `lat`), tope de 80 por
  viaje para que el índice no engorde. `irAlPunto()` trabaja sobre `mundiViajes`, una copia congelada, porque el
  escaneo de fondo reordena `tripHandles` mientras el mapa está abierto; `abreViaje(carpeta, destino)` salta al
  día o a la tarjeta después de abrir.
- **Caché de miniaturas** — `cacheInit()` detecta si hay IndexedDB (solo por `https`) o cae a
  `localStorage` (necesario en `file://`). `thumbSize()` y `thumbQuality()` aprietan más en localStorage.
- **Render del viaje** — `renderTrip()`, `dayCard()`, `scoreboard()`.
- **Momentos del día** — `renderDayMoments()`, `saveDayMoment()`: lo que pasó fuera del plan, con ubicación
  opcional del GPS o marcada en el mapa. Nunca escribe en `route`: el itinerario preparado es de solo lectura.
- **Cervezas** — `showBeers()`, `renderBeerList()`, formulario y `importKeep()`: las cervezas probadas por el
  mundo, en `Cervezas/cervezas.json`. Cada una lleva `name`, `brewery`, `style`, `place`, `city`, `country`,
  `datetime`, `rating` (0–5), `notes`, `photos` y, opcional, `lat`/`lng`. La ficha enseña **una portada** con
  un `+N`, y `abreGaleria()` abre las demás en el lightbox: pintarlas todas eran cientos de archivos que leer
  antes de ver nada, y enseñar solo la primera sin salida dejaba las otras inalcanzables. `observaMiniaturas()`
  pide cada portada cuando su ficha se acerca a la pantalla; `miniaturaCerveza()` pinta el archivo tal cual y
  deja la miniatura cociéndose en segundo plano para la próxima visita; `enCola()` no deja pasar más de dos
  lecturas de Drive a la vez. El mapa de la lista (`initBeerMap()`)
  sigue al buscador; el del formulario (`initBeerFormMap()`) es de una sola cerveza y cualquier toque mueve su
  marcador. Los dos van con `zoomAnimation: false`: al cambiar de pantalla se destruye el mapa y una animación
  de zoom en vuelo revienta al terminar sobre un contenedor que ya no existe. `aplicaUbicaciones()` vuelca un
  `ubicaciones.json` preparado fuera sobre las fichas, casándolo por nombre de nota — aquí no hay geocodificador
  y sin conexión no podría haberlo. El importador lee la carpeta `Keep` de un export de Google Takeout: una
  nota por cerveza, con sus fotos sueltas al lado. `estiloDesdeTitulo()` saca el estilo del título y nunca del
  texto (está lleno de «parecido a una IPA»); `puntuacionDesdeTexto()` deduce la nota del adjetivo y la marca
  con `ratingGuessed` para que se vea que es una propuesta. `source` (`keep:<archivo>`) evita duplicar al
  reimportar.
- **Viajes de vacaciones** — `esAlbum()`, `renderAlbum()`, `saveEntry()`, `createAlbumTrip()`: viajes sin
  itinerario (`trip.kind: "album"`), hechos de tarjetas en `entries`. La app crea su carpeta y su JSON.
  La fecha de una tarjeta es opcional —hay planes que se repiten a diario o varias veces— y sin ella la tarjeta
  se va al final de la lista y no pinta línea de fecha en ningún sitio: ni en el álbum, ni en el globo del mapa,
  ni en el recuerdo.
  `repinta()` decide entre `renderTrip()` y `renderAlbum()`; todo lo demás (fotos, caché, ZIP, PDF) es común.
- **Carga de imágenes** — `loadMedia()` y `readPending()`. Lee de dos en dos con 3 reintentos: Drive en
  Android sirve los archivos de uno en uno y con más concurrencia caducan.
- **Guardado** — `save()` (con debounce), `writeFile(name, blob, dir)`.
- **Mapa** — Leaflet, `initMap()`. Las rutas a pie aparecen al superar cierto zoom.
- **Recuerdo** — `cuerpoRecuerdo()` y `docRecuerdo()` arman el documento del viaje (portada, días o tarjetas,
  diario, momentos, marcador). De ahí salen tres cosas: `generatePDF()` lo abre en una ventana y lanza el
  diálogo de impresión; `generateKeepsake()` guarda un HTML autocontenido con las fotos en `data:`;
  `generatePoster()` compone un JPG en un canvas. Si se toca la maquetación, cambia en los tres a la vez.

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
