# Preparar viajes para Bitácoras — documento de referencia

Versión vigente: https://raw.githubusercontent.com/vgonzalezhuerta/Vgh_BitacoraGonMar/main/PROYECTO-CLAUDE.md

Este documento es la única fuente de verdad del formato. Si algo de la conversación lo contradice, manda este
documento.

---

## 1. Qué se produce

Un único archivo `bitacora.json` que describe un viaje entero: días, historia, rutas a pie, caza de tesoros y
vocabulario del viaje. La app no lleva contenido dentro; todo sale de este JSON.

El resultado se guarda como `bitacora.json` dentro de una subcarpeta nueva de la carpeta de viajes del usuario
(por ejemplo `Viajes/costa-fortuna-2026/bitacora.json`). Junto a él puede haber `portada.jpg` y `mapa.jpg`.

**Salida:** solo el JSON, válido, sin comentarios y sin texto alrededor. Si el viaje es largo, entrégalo por
días en mensajes sucesivos, pero cada trozo debe ser pegable en el archivo final sin retoques.

---

## 2. Qué preguntar antes de generar

Si falta algo de esto, pregúntalo. No lo inventes.

- **Viaje:** nombre y tipo (crucero, velero, montaña, playa, ciudad, carretera).
- **Fechas:** inicio y fin. Si es un viaje de backlog todavía sin fechas, dilo y sáltalas (ver §4).
- **Viajeros:** nombres, y edad de los niños si los hay — marca el nivel de los textos y la dificultad de la caza.
- **Itinerario:** una línea por día con fecha, lugar y horas de llegada y salida.
- **Transporte:** barco, furgoneta, tren…, con su nombre si lo tiene.
- **Ritmo:** si quieren días densos o tranquilos, y si hay limitaciones (movilidad, carritos, calor, presupuesto).

Con esto ya se puede generar. Todo lo demás (historia, rutas, objetivos, rangos) lo pones tú.

---

## 3. Esquema completo

`schemaVersion` es siempre `2`. Los campos marcados *opcional* pueden omitirse; si se omiten, la app usa su
valor por defecto y no rompe nada.

```jsonc
{
  "schemaVersion": 2,

  "trip": {
    "id": "costa-fortuna-2026",        // igual que el nombre de la carpeta, en minúsculas y con guiones
    "title": "Costa Fortuna",
    "subtitle": "Mediterráneo Oriental · 26 junio – 3 julio 2026",
    "startDate": "2026-06-26",         // ISO. Opcional en un viaje de backlog sin fechas aún
    "endDate": "2026-07-03",
    "status": "pendiente",             // opcional: pendiente | curso | hecho. Ver §4
    "theme": "crucero",                // ver §5
    "crew": ["Teresa", "Víctor", "Lucía", "Daniel", "Lucas"],
    "coverImage": "portada.jpg",       // opcional, archivo en la misma carpeta

    "wording": {                       // opcional, pero rellénalo siempre: da voz al viaje
      "stopSingular": "puerto",
      "stopPlural": "puertos",
      "progressLabel": "Puertos conquistados",
      "huntTitle": "Caza de estatuas",
      "huntUnit": "estatuas",
      "diaryTitle": "El diario de a bordo",
      "crewLabel": "Tripulación",
      "vehicleTitle": "Tu barco: Costa Fortuna"
    },

    "ranks": [                         // opcional. 5 rangos, ordenados por min ascendente
      { "min": 0,    "name": "Grumete en Prácticas", "icon": "⚓" },
      { "min": 400,  "name": "Contramaestre",        "icon": "🪢" }
    ]
  },

  "vehicle": {                          // opcional: barco, furgoneta, tren…
    "icon": "🚢",
    "name": "Costa Fortuna",
    "stats": [
      { "icon": "📏", "value": "272 m", "label": "Eslora", "note": "Como 3 campos de fútbol" }
    ],
    "curiosities": [
      { "icon": "🖼", "title": "El techo del atrio es un museo", "text": "…" }
    ]
  },

  "map": {                              // mapa general del viaje
    "center": [38.5, 27.0],             // [lat, lng]
    "zoom": 5,
    "closeLoop": true,                  // une la última parada con la primera
    "routeColor": "#c0392b",
    "staticImage": "mapa.jpg"           // opcional, mapa ilustrado
  },

  "days": [
    {
      "n": 1,                           // número visible del día
      "emoji": "🏛️",
      "date": "Viernes 26 junio 2026",  // texto libre, en español
      "place": "El Pireo | Atenas",
      "badge": "EMBARQUE",              // opcional: EMBARQUE, NAVEGACIÓN, DESEMBARQUE…
      "hours": "⚓ Salida 23:00",
      "note": "Frase corta de gancho para el día",

      "map": {                          // opcional; sin esto el día no sale en el mapa
        "lat": 37.943,
        "lng": 23.638,
        "label": "Pireo / Atenas",
        "when": "26 jun · 3 jul",
        "color": "#c0392b",
        "image": "https://…"            // foto para el globo del mapa
      },

      "history": {
        "paragraphs": ["Párrafo 1…", "Párrafo 2…"],
        "funFact": "El dato más sorprendente; se lleva el recuadro dorado",
        "challenge": "Misión opcional del día"
      },

      "route": {
        "title": "Ruta a pie recomendada — 14:00 a 22:00",
        "alert": "Salida del barco a las 23:00 — volver antes de las 22:30",
        "color": "#8e44ad",             // color de la ruta en el mapa
        "zoom": 12,                     // zoom a partir del cual aparece la ruta
        "line": [[37.9503, 23.6254], [37.9765, 23.7283]],
        "steps": [
          {
            "time": "14:00",
            "place": "Puerto del Pireo → Metro L1",
            "desc": "Línea 1 hasta Monastiraki, 16 min, 1,20 €",
            "icon": "🚇",
            "transit": true,            // desplazamiento: se pinta con el color secundario
            "lat": 37.9503,
            "lng": 23.6254,
            "short": "🚢 Puerto"        // etiqueta corta para el mapa
          }
        ]
      },

      "hunt": {                          // opcional
        "intro": "Texto de introducción a la caza del día",
        "items": [
          {
            "emoji": "🦉",
            "name": "Linterna de Lisícrates",
            "clue": "Dónde está exactamente y cómo reconocerla",
            "pts": 25
          }
        ]
      },

      "journalPlaceholder": "Pregunta que invita a escribir la reseña del día"
    }
  ],

  // ── Lo que escribe la app. En un viaje nuevo van vacíos, siempre presentes ──
  "visited":     [],
  "journals":    {},                     // { "0": "texto de la reseña" }
  "caught":      {},                     // { "2-0": true }
  "photoFiles":  {},                     // { "day-2-0": "foto_dia3_1.jpg" }
  "statueFiles": {}                      // { "2-0": "captura_2-0.jpg" }
}
```

Detalles que se escapan:

- Las claves de `journals`, `caught`, `photoFiles` y `statueFiles` usan el **índice del día en el array**
  empezando por 0, no el `n` visible. `"2-0"` es el primer objetivo del tercer día.
- Si `icon` de un paso está vacío, la app numera el paso automáticamente.
- `line` es la traza dibujada; `steps` con `lat`/`lng` son los puntos marcados. Puedes dar solo `steps` y la
  ruta se dibuja uniéndolos.
- Los emojis van dentro del JSON tal cual, en UTF-8.

---

## 4. Estado del viaje: pendiente, en curso, hecho

La biblioteca agrupa los viajes en tres secciones: **En curso** arriba, **Pendientes** en medio (lo más próximo
primero) y **Hechos** abajo (el más reciente primero).

Lo normal es **no poner `status`**: la app lo deduce de las fechas contra el día de hoy.

| situación                        | estado    |
|----------------------------------|-----------|
| `startDate` en el futuro         | pendiente |
| hoy entre `startDate` y `endDate`| en curso  |
| `endDate` ya pasado              | hecho     |
| sin `startDate`                  | pendiente |

Pon `status` a mano solo cuando las fechas mientan: un viaje que se canceló y quieres archivar (`"hecho"`), o
uno con fechas tentativas ya pasadas que sigue en el backlog (`"pendiente"`). Un `status` que no reconozca se
ignora y manda la fecha.

**Viajes de backlog.** Un viaje puede prepararse entero sin tener fechas: omite `startDate` y `endDate`, deja
`subtitle` con la intención (`"Idea para un puente largo · 4 días"`) y usa `date` de cada día en relativo
(`"Día 1"`, `"Día 2"`) en lugar de un día de la semana concreto. La tarjeta de un viaje pendiente no muestra
progreso: muestra cuántos días y cuántos objetivos trae preparados, y cuánto falta si hay fecha.

---

## 5. Temas visuales

`trip.theme` acepta exactamente uno de estos:

| tema        | para                              |
|-------------|-----------------------------------|
| `crucero`   | cruceros (azul marino, oro, estilo pirata) |
| `velero`    | navegación a vela                 |
| `montana`   | montaña y senderismo (sin ñ)      |
| `playa`     | costa y descanso                  |
| `ciudad`    | escapadas urbanas                 |
| `carretera` | rutas en coche o furgoneta        |

Cada uno cambia paleta, tipografía de titulares e ilustración de cabecera.

---

## 6. Reglas de contenido

Lo que separa un JSON válido de un viaje que apetece leer.

**Historia (`history.paragraphs`).** 3-4 párrafos por día, de historia y curiosidades **reales** del lugar,
escritos para que un niño de 8 años los entienda y un adulto los disfrute. Datos concretos: fechas, cifras,
nombres, anécdotas. Nada de relleno turístico ("una ciudad llena de encanto"). Si no estás seguro de un dato,
no lo pongas. `funFact` se lleva el dato más sorprendente del día, en una o dos frases.

**Rutas (`route`).** Itinerario a pie realista, con las horas encajadas entre la llegada y la salida reales del
día y margen de vuelta. Incluye precios aproximados de entradas y transporte, y `lat`/`lng` de cada parada.
Marca `transit: true` en los desplazamientos. Si el día es de navegación o de carretera, no fuerces una ruta a
pie: omite `route`.

**Caza de tesoros (`hunt.items`).** Entre 3 y 8 objetivos por día: estatuas, escudos, fuentes, detalles
arquitectónicos, azulejos, gárgolas. Todos visibles desde la calle y sin pagar entrada siempre que se pueda.
`clue` dice dónde está exactamente y cómo reconocerlo, sin resolverlo del todo. `pts` entre 20 y 40 según
dificultad. Ajusta la dificultad a la edad de los niños del viaje.

**Vocabulario (`trip.wording`).** Adáptalo al tipo de viaje: en un crucero son puertos y tripulación, en
montaña refugios y cordada, en carretera etapas y expedición.

**Rangos (`trip.ranks`).** Cinco, temáticos, con `min` ascendente empezando en 0. El último debe quedar cerca
del total de puntos posible del viaje, no por encima.

---

## 7. Comprobación antes de entregar

- [ ] JSON válido, sin comentarios, sin comas finales.
- [ ] `schemaVersion` es `2`.
- [ ] Un objeto en `days` por cada día del viaje, en orden, sin saltos en `n`.
- [ ] `trip.id` coincide con el nombre de carpeta propuesto.
- [ ] Si es un viaje de backlog: sin `startDate`/`endDate`, o con `status: "pendiente"` si las fechas ya pasaron.
- [ ] `theme` es uno de los seis de §5.
- [ ] Todas las coordenadas son reales y caen donde deben (lat antes que lng).
- [ ] Las horas de cada `route` caben entre llegada y salida del día.
- [ ] `visited`, `journals`, `caught`, `photoFiles` y `statueFiles` están presentes y vacíos.
- [ ] Ningún dato histórico inventado.
