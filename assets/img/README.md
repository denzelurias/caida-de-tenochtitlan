# Image Assets

Las imagenes curadas actuales viven en `assets/img/curadas/`.

## Cambiar una imagen manualmente

1. Agrega tu archivo a `assets/img/curadas/`.
2. Busca en `index.html` el bloque que quieres cambiar.
3. Cambia el valor de `data-image-src`.
4. Ajusta el encuadre con `data-image-position`.

Ejemplo:

```html
<div
  class="image-placeholder"
  data-image-src="assets/img/curadas/mi-nueva-imagen.jpg"
  data-image-position="center center"
  data-label="">
</div>
```

Valores utiles para `data-image-position`:

- `center center`: encuadre equilibrado.
- `center top`: conserva la parte superior.
- `center bottom`: conserva la parte inferior.
- `35% 50%`: ajuste fino horizontal y vertical.

## Imagenes de la linea del tiempo y modal

Las imagenes de la linea del tiempo y del visor de objetos se controlan en `assets/js/main.js`, dentro de los arreglos `timelineItems` y `artifacts`.

```js
image: "assets/img/curadas/galeria-codice.jpg",
imagePosition: "center center"
```

## Mapa interactivo

El mapa de fondo esta configurado en `assets/css/styles.css`:

```css
.map-stage {
  --map-image: url("../img/curadas/mapa-valle-1524.jpg");
}
```

Los pines se pueden arrastrar en la pagina. Sus posiciones se guardan en el navegador con `localStorage`, asi que puedes hacer ajuste visual sin cambiar codigo. Si quieres fijar una posicion para todos los usuarios, cambia el `style="left: ...; top: ...;"` del pin correspondiente en `index.html`.
