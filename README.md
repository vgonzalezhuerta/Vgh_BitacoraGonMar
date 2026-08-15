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
icono-fuente.svg           dibujo del que salen los cuatro PNG
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
la tenga instalada seguirá viendo la versión guardada en caché.

Ese número se ve en la barra superior, junto al título: así se sabe de un vistazo qué versión está usando la app
instalada. Al tocarlo busca una versión nueva; si la encuentra, la insignia se enciende y basta con volver a
tocarla para recargar. `sw.js` es el único sitio donde se escribe el número: la app se lo pregunta.

## Qué NO subir aquí

Ni `bitacora.json` de viajes reales, ni fotos. Este repositorio es público si usas GitHub Pages gratuito, y git
conserva el historial para siempre: borrar una foto después no la elimina del repositorio. Los datos se quedan
en tu carpeta local, sincronizada con la nube si quieres.

## Momentos

Además de los viajes, la app guarda momentos sueltos: fecha y hora, reseña, fotos y las personas que estaban.
Los nombres se acumulan solos, así que a partir del segundo momento se eligen de un desplegable.

Viven en `Momentos/momentos.json` dentro de tu carpeta raíz, con sus fotos al lado. La app crea esa carpeta
la primera vez sin que tengas que hacer nada.

## Formato de los viajes

`FORMATO-viajes.md` es la **única** descripción del formato: esquema del `bitacora.json`, estados, temas, reglas
de contenido y comprobación final. No se copia a ningún otro sitio. Su §8 explica cómo enlazarlo por URL cruda
desde un proyecto de Claude que prepare los viajes por ti.

`GUIA-bitacoras.md` es la guía de uso: cómo montar tu carpeta de viajes, instalar la app y manejarla.

## Requisitos

Un navegador con acceso a archivos locales (la API File System Access). Chrome y Edge lo tienen.
