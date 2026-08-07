# Bitácoras de viaje

Cuaderno de aventuras familiar: itinerario, historia y curiosidades de cada día, diario, fotos y caza de
tesoros con puntos. Cada viaje es una carpeta con un `bitacora.json`; la app no lleva ningún contenido dentro.

**La app se publica aquí. Los viajes viven en una carpeta tuya, nunca en este repositorio.**

## Publicar

1. Copia estos archivos a la raíz del repositorio:

```
index.html                 la app entera
manifest.webmanifest       datos de instalación
sw.js                      caché para uso sin conexión
icono-192.png
icono-512.png
icono-maskable-512.png
icono-apple.png
lib/                       Leaflet y JSZip (ver lib/LEEME.txt)
```

2. Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
3. En un par de minutos: `https://<usuario>.github.io/<repositorio>/`

## Usar

Abre la URL, pulsa **📁 Elegir carpeta** y selecciona tu carpeta de viajes. La app lista todas las subcarpetas
que contengan un `bitacora.json`. Reseñas, fotos y capturas se escriben en esa carpeta, no aquí.

Al servirse por `https`, el navegador ofrece **⬛ Instalar** y la app queda con su icono y funciona sin conexión.
También recuerda la carpeta elegida entre sesiones.

## Al cambiar la app

Sube el número de `VERSION` en `sw.js` (`bitacoras-v3` → `bitacoras-v4`) en el mismo commit. Sin eso, quien ya
la tenga instalada seguirá viendo la versión guardada en caché. Al detectar una versión nueva, la app avisa en
la barra superior.

## Qué NO subir aquí

Ni `bitacora.json` de viajes reales, ni fotos. Este repositorio es público si usas GitHub Pages gratuito, y git
conserva el historial para siempre: borrar una foto después no la elimina del repositorio. Los datos se quedan
en tu carpeta local, sincronizada con la nube si quieres.

## Formato de los viajes

En `GUIA-bitacoras.md` está el esquema completo del `bitacora.json` y un prompt listo para generar viajes nuevos
con una IA. Temas disponibles: `crucero`, `velero`, `montana`, `playa`, `ciudad`, `carretera`.

## Requisitos

Un navegador con acceso a archivos locales (la API File System Access). Chrome y Edge lo tienen.
