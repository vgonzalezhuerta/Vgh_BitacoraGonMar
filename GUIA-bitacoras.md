# Bitácoras de viaje — guía del formato

## Cómo se organizan los archivos

```
Viajes/                          ← carpeta raíz (la eliges una vez en la app)
├─ (la app se abre desde GitHub Pages, no hace falta aquí)
├─ Abrir Bitacoras.bat           ← lanzador Windows
├─ Abrir Bitacoras.command       ← lanzador macOS / Linux
├─ manifest.webmanifest          ← datos de instalación
├─ sw.js                         ← caché para uso sin conexión
├─ icono-*.png                   ← iconos de la app instalada
├─ costa-fortuna-2026/
│   ├─ bitacora.json             ← TODO el viaje: contenido + reseñas + índice de fotos
│   ├─ mapa.jpg                  ← opcional, mapa ilustrado de la ruta
│   ├─ portada.jpg               ← opcional, portada en la biblioteca
│   ├─ foto_dia3_....jpg         ← fotos del diario (las crea la app)
│   └─ captura_2-0_....jpg       ← pruebas de capturas (las crea la app)
├─ pirineos-2027/
│   └─ bitacora.json
└─ roma-2027/
    └─ bitacora.json
```

La app recorre las subcarpetas de la raíz y muestra como viaje cualquiera que contenga un `bitacora.json`. No hay nada codificado dentro del HTML: cambiar un texto, una ruta o un objetivo se hace editando el JSON.

## Viajes pendientes, en curso y hechos

La biblioteca agrupa los viajes en tres secciones: **En curso** arriba, **Pendientes** en medio (lo más próximo
primero, y las ideas sin fecha al final) y **Hechos** abajo (el último viaje primero).

Normalmente no hay que hacer nada: el estado sale de las fechas del viaje comparadas con hoy. Si `startDate`
está en el futuro es pendiente; si hoy cae entre `startDate` y `endDate` está en curso; si `endDate` ya pasó
está hecho. **Un viaje sin `startDate` es pendiente**, así que puedes preparar viajes de backlog enteros sin
haber decidido las fechas.

Para forzarlo, añade `trip.status` con `"pendiente"`, `"curso"` o `"hecho"`: manda sobre las fechas. Sirve para
archivar un viaje que se canceló, o para dejar en el backlog uno cuyas fechas tentativas ya pasaron.

La tarjeta de un viaje pendiente no enseña progreso — sería siempre cero. En su lugar muestra cuántos días y
cuántos objetivos trae preparados, y cuánto falta para empezarlo si tiene fecha.

## Temas visuales

`trip.theme` acepta: `crucero`, `velero`, `montana`, `playa`, `ciudad`, `carretera`.
Cada uno cambia paleta, tipografía de titulares e ilustración de cabecera. `crucero` es el estilo original (azul marino, oro, Pirata One).

## Estructura del JSON

```jsonc
{
  "schemaVersion": 2,

  "trip": {
    "id": "costa-fortuna-2026",
    "title": "Costa Fortuna",
    "subtitle": "Mediterráneo Oriental · 26 junio – 3 julio 2026",
    "startDate": "2026-06-26",         // ordena la biblioteca; omítelo en un viaje de backlog
    "endDate": "2026-07-03",
    "status": "pendiente",             // opcional: pendiente | curso | hecho (manda sobre las fechas)
    "theme": "crucero",
    "crew": ["Teresa", "Víctor", "Lucía", "Daniel", "Lucas"],
    "coverImage": "portada.jpg",       // opcional
    "wording": {                       // vocabulario del viaje (opcional)
      "stopSingular": "puerto",
      "stopPlural": "puertos",
      "progressLabel": "Puertos conquistados",
      "huntTitle": "Caza de estatuas",
      "huntUnit": "estatuas",
      "diaryTitle": "El diario de a bordo",
      "crewLabel": "Tripulación",
      "vehicleTitle": "Tu barco: Costa Fortuna"
    },
    "ranks": [                         // rangos por puntos (opcional)
      { "min": 0,   "name": "Grumete en Prácticas", "icon": "⚓" },
      { "min": 400, "name": "Contramaestre",        "icon": "🪢" }
    ]
  },

  "vehicle": {                          // opcional: barco, furgoneta, tren…
    "icon": "🚢", "name": "Costa Fortuna",
    "stats": [{ "icon": "📏", "value": "272 m", "label": "Eslora", "note": "Como 3 campos de fútbol" }],
    "curiosities": [{ "icon": "🖼", "title": "El techo del atrio es un museo", "text": "…" }]
  },

  "map": {
    "center": [38.5, 27.0],
    "zoom": 5,
    "closeLoop": true,                  // une la última parada con la primera
    "routeColor": "#c0392b",
    "staticImage": "mapa.jpg"           // opcional
  },

  "days": [
    {
      "n": 1,
      "emoji": "🏛️",
      "date": "Viernes 26 junio 2026",
      "place": "El Pireo | Atenas",
      "badge": "EMBARQUE",              // opcional
      "hours": "⚓ Salida 23:00",
      "note": "Frase corta de gancho para el día",

      "map": {                          // opcional: si falta, no sale en el mapa
        "lat": 37.943, "lng": 23.638,
        "label": "Pireo / Atenas",
        "when": "26 jun · 3 jul",
        "color": "#c0392b",
        "image": "https://…"            // foto para el globo del mapa
      },

      "history": {
        "paragraphs": ["Párrafo 1…", "Párrafo 2…"],
        "funFact": "El dato curioso que se lleva el recuadro dorado",
        "challenge": "Misión opcional del día"
      },

      "route": {
        "title": "Ruta a pie recomendada — 14:00 a 22:00",
        "alert": "Salida del barco a las 23:00 — volver antes de las 22:30",
        "color": "#8e44ad",             // color de la ruta en el mapa
        "zoom": 12,                     // zoom a partir del cual aparece
        "line": [[37.9503, 23.6254], [37.9765, 23.7283]],
        "steps": [
          { "time": "14:00", "place": "Puerto del Pireo → Metro L1",
            "desc": "Línea 1 hasta Monastiraki, 16 min, 1,20 €",
            "icon": "🚇", "transit": true,
            "lat": 37.9503, "lng": 23.6254, "short": "🚢 Puerto" }
        ]
      },

      "hunt": {                          // opcional
        "intro": "Texto de introducción a la caza del día",
        "items": [
          { "emoji": "🦉", "name": "Linterna de Lisícrates",
            "clue": "Dónde está y cómo reconocerla", "pts": 25 }
        ]
      },

      "journalPlaceholder": "Pregunta que invita a escribir la reseña del día"
    }
  ],

  // ── Lo que escribe la app (déjalo vacío al generar un viaje nuevo) ──
  "visited":     [],
  "journals":    {},                     // { "0": "texto de la reseña" }
  "caught":      {},                     // { "2-0": true }
  "photoFiles":  {},                     // { "day-2-0": "foto_dia3_1.jpg" }
  "statueFiles": {}                      // { "2-0": "captura_2-0.jpg" }
}
```

`transit: true` pinta el paso con el color secundario (metro, bus, tender). Si `icon` está vacío se numera el paso automáticamente.

---

## Prompt para generar el JSON de un viaje nuevo

Pega esto en una conversación nueva junto con este documento y los datos de tu viaje:

> Genera un archivo `bitacora.json` siguiendo exactamente el esquema de la guía adjunta, para este viaje:
>
> - **Viaje:** [nombre] · [tipo: crucero / ruta de montaña / playa / ciudad / carretera]
> - **Fechas:** [inicio – fin]
> - **Viajeros:** [nombres y edades de los niños, si los hay]
> - **Itinerario:** [una línea por día: fecha, lugar, horarios de llegada/salida]
> - **Transporte:** [barco, furgoneta, tren… con su nombre si lo tiene]
>
> Requisitos:
> 1. Un objeto en `days` por cada día, en orden, con `n`, `emoji`, `date`, `place`, `hours` y `note`.
> 2. `history.paragraphs`: 3-4 párrafos de historia y curiosidades reales del lugar, escritos para que un niño de 8 años los entienda y un adulto los disfrute. Nada de relleno: datos concretos, fechas, cifras y anécdotas. Añade `funFact` con el dato más sorprendente.
> 3. `route`: itinerario a pie realista para ese día, con horas encajadas entre la llegada y la salida, precios aproximados de entradas y transporte, y `lat`/`lng` de cada parada. Marca `transit: true` en los desplazamientos.
> 4. `hunt.items`: entre 3 y 8 objetivos por día (estatuas, escudos, fuentes, detalles arquitectónicos), todos accesibles desde la calle y sin pagar entrada siempre que sea posible. `clue` debe decir dónde está exactamente y cómo reconocerlo. `pts` entre 20 y 40 según dificultad.
> 5. `map` de cada día con coordenadas reales del puerto o del centro.
> 6. Rellena `trip.wording` con el vocabulario propio del tipo de viaje y `trip.ranks` con 5 rangos temáticos por puntos.
> 7. Deja `visited`, `journals`, `caught`, `photoFiles` y `statueFiles` vacíos.
> 8. Devuelve solo el JSON, válido y sin comentarios.

Guarda el resultado como `bitacora.json` dentro de una subcarpeta nueva de tu carpeta de viajes y pulsa **Actualizar** en la app.

---

## Instalar la app en el ordenador

La app vive dentro de la propia carpeta de viajes, junto a sus iconos y su service worker.

- **Windows:** doble clic en `Abrir Bitacoras.bat`
- **macOS / Linux:** doble clic en `Abrir Bitacoras.command` (la primera vez en macOS: clic derecho → Abrir)

El lanzador levanta un servidor local en `http://localhost:8765` y abre la app en su propia ventana, sin barra de
navegación. Ese servidor solo escucha en tu ordenador: nada sale a internet.

Con la app abierta aparece **⬛ Instalar** en la barra superior (o menú ⋮ → Instalar). Al aceptarlo queda como una
aplicación más, con su icono de ancla y su ventana propia, y ya puedes abrirla sin pasar por el lanzador — salvo que
cierres el servidor, así que lo cómodo es seguir arrancándola desde el `.bat` / `.command`.

La primera vez que la abras con internet se guardan Leaflet, JSZip y las tipografías; a partir de ahí funciona sin
conexión. Sin ellos guardados, el mapa interactivo y la copia ZIP avisan y el resto sigue funcionando.

**Al cambiar `bitacora.html`:** sube el número de `VERSION` en `sw.js` (`bitacoras-v1` → `bitacoras-v2`) para que la
app instalada recoja la versión nueva en lugar de la guardada en caché.

En el móvil no funciona: la API que lee carpetas del disco no existe en Android ni en iOS.

## Uso de la app

1. Arranca la app con el lanzador (o abre `bitacora.html` directamente en Chrome o Edge de escritorio).
2. **Elegir carpeta** → selecciona esta misma carpeta raíz de viajes. Queda recordada: en visitas siguientes basta con pulsar *Reconectar*.
3. Toca un viaje para abrirlo. Marca paradas visitadas, escribe reseñas, añade fotos del día y captura objetivos con la cámara.
4. Todo se guarda al instante en el `bitacora.json` de ese viaje; las fotos se comprimen y se escriben como `.jpg` en su carpeta.
5. **Copia** descarga un ZIP del viaje completo. **PDF** abre el diálogo de impresión: elige *Guardar como PDF*.
