# Bitácoras de viaje — guía de uso

Cómo montar tu carpeta de viajes y usar la app. **El formato del `bitacora.json` no está aquí:** vive en
[FORMATO-viajes.md](FORMATO-viajes.md), que es el único sitio donde se describe.

## Cómo se organizan los archivos

La app se abre desde GitHub Pages; en tu carpeta solo van los viajes.

```
Viajes/                          ← carpeta raíz (la eliges una vez en la app)
├─ costa-fortuna-2026/
│   ├─ bitacora.json             ← TODO el viaje: contenido + reseñas + índice de fotos
│   ├─ mapa.jpg                  ← opcional, mapa ilustrado de la ruta
│   ├─ portada.jpg               ← opcional, portada en la biblioteca
│   ├─ foto_dia3_....jpg         ← fotos del diario (las crea la app)
│   └─ captura_2-0_....jpg       ← pruebas de capturas (las crea la app)
├─ pirineos-2027/
│   └─ bitacora.json
├─ roma-2027/
│   └─ bitacora.json
└─ Momentos/
    ├─ momentos.json             ← instantes sueltos (la crea la app sola)
    └─ ....jpg
```

La app recorre las subcarpetas de la raíz y muestra como viaje cualquiera que contenga un `bitacora.json`. No
hay nada codificado dentro del HTML: cambiar un texto, una ruta o un objetivo se hace editando el JSON.

## Viajes pendientes, en curso y hechos

La biblioteca agrupa los viajes en tres secciones: **En curso** arriba, **Pendientes** en medio (lo más próximo
primero, y las ideas sin fecha al final) y **Hechos** abajo (el último viaje primero).

Normalmente no hay que hacer nada: el estado sale de las fechas del viaje comparadas con hoy. **Un viaje sin
`startDate` es pendiente**, así que puedes preparar viajes de backlog enteros sin haber decidido las fechas. Y
`trip.status` lo fuerza cuando las fechas mienten. Las reglas exactas, en
[FORMATO-viajes.md §4](FORMATO-viajes.md).

La tarjeta de un viaje pendiente no enseña progreso — sería siempre cero. En su lugar muestra cuántos días y
cuántos objetivos trae preparados, y cuánto falta para empezarlo si tiene fecha.

## Viajes de vacaciones (sin itinerario)

No todos los viajes tienen recorrido. Para unas vacaciones —una semana en la playa, unos días en casa de los
abuelos— hay un segundo tipo que no se prepara: se crea vacío y se va llenando.

En la biblioteca, **🏖️ Nuevo viaje de vacaciones** pide nombre, fechas, tipo y quién va. La app crea la
subcarpeta y su `bitacora.json`; no hay que escribir JSON ni pasar por Claude.

Dentro, cada plan es una **tarjeta**: título, fecha, reseña, fotos y, si quieres, el sitio marcado en el mapa.
Un día en el parque de atracciones es una tarjeta con sus diez fotos y su reseña. Las tarjetas se ordenan solas
por fecha, y si alguna tiene sitio, arriba aparece un mapa con todas.

Salen en la biblioteca junto a los demás viajes, con la insignia *vacaciones*, agrupadas igual por En curso,
Pendientes y Hechos según sus fechas. La copia ZIP y el PDF los incluyen como a cualquier otro viaje.

## Crear un viaje nuevo

1. Genera el `bitacora.json` siguiendo [FORMATO-viajes.md](FORMATO-viajes.md). Ese documento incluye un §8 con
   las instrucciones para montar un proyecto de Claude que los prepare por ti.
2. Guárdalo en una subcarpeta nueva de tu carpeta de viajes.
3. Pulsa **Actualizar** en la app.

## Instalar la app en el ordenador

Abre la URL de GitHub Pages en Chrome o Edge de escritorio. Al servirse por `https`, aparece **⬛ Instalar** en
la barra superior (o menú ⋮ → Instalar). Al aceptarlo queda como una aplicación más, con su icono y su ventana
propia, y recuerda la carpeta elegida entre sesiones.

La primera vez que la abras con internet se guardan Leaflet, JSZip y las tipografías; a partir de ahí funciona
sin conexión. Sin ellos guardados, el mapa interactivo y la copia ZIP avisan y el resto sigue funcionando.

En el móvil no funciona: la API que lee carpetas del disco no existe en Android ni en iOS.

## Uso de la app

1. **Elegir carpeta** → selecciona tu carpeta raíz de viajes. Queda recordada: en visitas siguientes basta con
   pulsar *Reconectar*.
2. Toca un viaje para abrirlo. Marca paradas visitadas, escribe reseñas, añade fotos del día y captura
   objetivos con la cámara.
3. Todo se guarda al instante en el `bitacora.json` de ese viaje; las fotos se comprimen y se escriben como
   `.jpg` en su carpeta.
4. **Copia** descarga un ZIP del viaje completo. **PDF** abre el diálogo de impresión: elige *Guardar como PDF*.

La pestaña **Momentos** guarda instantes sueltos fuera de los viajes: fecha y hora, reseña, fotos y quién
estaba. Van a `Momentos/momentos.json`, que la app crea sola la primera vez.

## Momentos y sitios fuera de la ruta

Dentro de un viaje, cada día tiene al final **✨ Momentos y sitios fuera de la ruta**. Sirve para lo que no
estaba en el plan: la heladería que encontrasteis por casualidad, una playa a la que os desviasteis, un rato
que merece recordarse. Cada uno lleva hora, sitio, texto, fotos y, si quieres, un punto en el mapa.

El punto se marca de dos maneras:

- **📍 Estoy aquí** toma tu posición del GPS. Necesita que des permiso de ubicación y que la app esté abierta
  por `https` (la URL de GitHub Pages).
- **🗺️ Marcar en el mapa** te lleva al mapa del viaje; el siguiente toque marca el sitio. Vale también tocar
  encima de una parada o de un paso de la ruta, si el sitio es justo ese.

Los momentos con punto salen en el mapa como marcadores ✨, con otro color que las paradas del itinerario, y
su globo tiene un enlace para saltar al día en el diario. Salen también en el PDF y en la copia ZIP.

**La ruta preparada no se toca nunca.** Los pasos de `route` siguen siendo lo que se planeó; esto se guarda
aparte, en `moments` del `bitacora.json`. Así se puede ver a la vez lo previsto y lo que pasó de verdad, y
regenerar el viaje desde el proyecto de Claude sin perder nada de lo vuestro.

## Al tocar la app

Si cambias `index.html`, sube el número de `VERSION` en `sw.js` (`bitacoras-v7` → `bitacoras-v8`) en el mismo
commit. Sin eso, quien la tenga instalada seguirá viendo la versión guardada en caché. Y si el cambio toca el
formato del JSON, actualiza [FORMATO-viajes.md](FORMATO-viajes.md) a la vez.
