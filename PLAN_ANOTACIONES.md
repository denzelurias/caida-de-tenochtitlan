# Plan de implementacion: sistema de anotaciones

Este documento describe como incorporar un sistema de comentarios/anotaciones a la experiencia editorial sobre la caida de Mexico-Tenochtitlan. No contiene cambios de codigo listos para copiar, sino una especificacion para que el equipo de desarrollo implemente la funcion con buena arquitectura, calidad visual y posibilidad de despliegue en Vercel con base de datos.

## Objetivo

Agregar una opcion **Comentar** junto al boton **Indice** en la barra superior. Al activarla, la pagina entra en un modo de anotacion: la persona lectora puede hacer clic en una zona especifica del contenido y escribir una nota ligada a ese punto de la pagina.

La funcion debe sentirse como una herramienta de lectura academica, no como una red social. La metafora visual recomendada es **nota al margen de archivo/museo**: discreta, legible, sobria y respetuosa del tono historico.

## Principios de diseno

1. **No invadir la lectura.** Las anotaciones deben poder ocultarse por completo para mantener la pagina limpia.
2. **Anotar contexto, no solo coordenadas.** Cada comentario debe guardar la posicion visual y tambien el bloque narrativo al que pertenece.
3. **Mantener el tono museografico.** Usar lenguaje como "nota", "anotacion", "reflexion" o "comentario de lectura".
4. **Separar lectura de edicion.** La persona debe activar conscientemente el modo Comentar antes de colocar notas.
5. **Ser tolerante a cambios de layout.** Si la pagina cambia de tamano o se edita el texto, la anotacion debe seguir asociada a una seccion o elemento estable.
6. **Privacidad y moderacion desde el inicio.** Aunque sea un proyecto escolar, los comentarios enviados a una base de datos requieren reglas claras.

## Ubicacion en la interfaz

### Barra superior

La barra actual contiene:

- Marca/titulo a la izquierda.
- Boton **Indice** a la derecha.

La propuesta es agregar un boton antes de **Indice**:

```text
[Comentar] [Indice]
```

En pantallas pequenas:

```text
[icono nota] [Indice]
```

El boton debe tener estos estados:

- **Inactivo:** muestra `Comentar`.
- **Activo:** muestra `Comentando` o `Salir de comentar`.
- **Cargando:** cuando se estan enviando o trayendo notas.
- **Deshabilitado:** si no hay conexion o si la pagina esta en modo solo lectura.

Icono sugerido:

- `edit_note`, `comment`, `rate_review` o equivalente en Material Symbols, porque el proyecto ya carga Material Symbols.

### Barra contextual de anotacion

Cuando el modo Comentar este activo, mostrar una banda o pastilla discreta debajo de la topbar:

```text
Modo comentar activo. Haz clic en un parrafo, imagen, mapa o tarjeta para dejar una nota.
[Ver notas] [Cancelar]
```

Debe ser compacta, fija y no cubrir el contenido principal. En movil puede aparecer como barra inferior.

### Marcadores en la pagina

Cada anotacion visible debe representarse con un marcador pequeno:

- Punto circular burgundy.
- Numero secuencial opcional.
- Icono pequeno de nota.

No usar globos grandes siempre abiertos. El comentario se abre al hacer clic en el marcador.

## Lugares anotables

No conviene permitir clic literal sobre cualquier pixel sin control, porque eso produce comentarios dificiles de mantener. La implementacion debe detectar el elemento anotable mas cercano.

Elementos anotables recomendados:

- Parrafos narrativos: `.lead`, `.body-copy`.
- Titulos de seccion: `h2`, `h3`.
- Fichas laterales: `.fact-panel`.
- Tarjetas de linea del tiempo: `.timeline-card`.
- Tabs de ciudad lacustre: `.tab-panel`.
- Capitulos: `.chapter`.
- Pasos del sitio: `.step`.
- Mapa: `.map-stage`, `.map-pin`, `.map-panel`.
- Galeria: `.artifact`.
- Modal de objeto: opcional para fase 2.

Cada elemento anotable debe tener un identificador estable. La implementacion debe agregar atributos como:

```html
data-annotatable="true"
data-anchor-id="origen-lead-01"
```

El `data-anchor-id` debe ser estable y semantico. No debe depender de indices generados automaticamente si el contenido puede moverse.

Ejemplos:

- `origen-apertura-lead`
- `linea-1325-card`
- `ciudad-agua-panel`
- `poder-capitulo-templo-mayor`
- `sitio-junio-agua`
- `mapa-pin-chapultepec`
- `galeria-coyolxauhqui`
- `legado-cierre-lead`

## Flujo principal de usuario

### Crear una anotacion

1. La persona pulsa **Comentar**.
2. La interfaz muestra que el modo esta activo.
3. La persona hace clic en un elemento anotable.
4. Aparece un formulario flotante cerca del punto seleccionado.
5. El formulario muestra el contexto:
   - Seccion: `Ciudad lacustre`
   - Fragmento: primeras palabras del parrafo o titulo
6. La persona escribe su comentario.
7. Pulsa **Publicar nota** o **Guardar nota**.
8. El sistema valida, envia a la API y muestra el marcador.

### Leer anotaciones

1. Las notas pueden mostrarse automaticamente o mediante un control **Ver notas**.
2. Al tocar un marcador, se abre una tarjeta compacta.
3. La tarjeta muestra:
   - Nombre o alias.
   - Fecha relativa o absoluta.
   - Texto.
   - Seccion.
   - Acciones permitidas: responder, editar, eliminar, reportar, segun permisos.

### Cancelar

Si el modo Comentar esta activo y la persona presiona Escape, Cancelar o vuelve a pulsar **Comentar**, se sale del modo sin crear nota.

### Editar o eliminar

Solo debe permitirse editar/eliminar si:

- La persona esta autenticada y es autora.
- O el comentario fue creado anonimamente en la misma sesion y conserva un token local de edicion.
- O la persona tiene rol de moderacion.

## Formulario de comentario

Campos recomendados:

- `author_name`: nombre visible o alias.
- `body`: comentario.
- `intent`: tipo de nota, opcional.

Tipos de nota sugeridos:

- `Pregunta`
- `Observacion`
- `Dato relacionado`
- `Interpretacion`
- `Correccion`

Texto maximo:

- Comentario: 500 caracteres para fase 1.
- Alias: 40 caracteres.

Estados del formulario:

- Vacio.
- Con texto valido.
- Error de validacion.
- Enviando.
- Enviado.
- Fallo de red.

Mensajes sugeridos:

- `Escribe una nota de lectura.`
- `Tu comentario debe tener al menos 3 caracteres.`
- `No se pudo guardar. Revisa tu conexion e intenta de nuevo.`
- `Nota guardada.`

## Comportamiento visual

### Modo Comentar activo

Al activar el modo:

- El cursor puede cambiar a `crosshair` o `text`.
- Los elementos anotables pueden recibir un borde o brillo muy sutil al pasar el mouse.
- La topbar debe mantener el estilo actual: parchment, burgundy, bordes finos.
- No usar colores ajenos a `DESIGN.md`.

Estilo recomendado:

- Marcador: fondo `--oxblood`, texto `--white`.
- Panel flotante: `--paper-low`, borde `--line`, sombra ligera o sin sombra fuerte.
- Estado activo: burgundy solido o borde burgundy.

### Tarjeta de anotacion

Debe ser pequena y legible:

```text
Ana
Pregunta · Origen

¿Por que la ubicacion en el lago fue una ventaja al principio y una debilidad durante el sitio?

2 mayo 2026
```

La tarjeta no debe tapar permanentemente el parrafo. En movil debe abrirse como sheet inferior o panel centrado.

### Panel de notas

Ademas de los marcadores, conviene agregar un panel lateral opcional:

```text
Notas de lectura

Origen
1 nota

Ciudad lacustre
3 notas

Sitio
2 notas
```

Este panel puede integrarse al mismo drawer del Indice en una pestana futura:

- `Indice`
- `Notas`

Para fase 1, no es obligatorio. La prioridad es el boton Comentar y los marcadores.

## Arquitectura recomendada

El proyecto actual es una pagina estatica con:

- `index.html`
- `assets/css/styles.css`
- `assets/js/main.js`

Para guardar anotaciones en base de datos y desplegar en Vercel hay dos caminos viables.

### Opcion A: mantener sitio estatico con Vercel Functions

Recomendada si se quiere tocar lo menos posible la estructura actual.

Estructura futura:

```text
index.html
assets/
  css/styles.css
  js/main.js
api/
  annotations/
    index.js
    [id].js
lib/
  db.js
```

Ventajas:

- Menor migracion.
- Mantiene HTML/CSS/JS separados.
- Vercel puede servir el sitio estatico y las funciones `/api`.

Limitaciones:

- Menos ergonomico que Next.js para auth, SSR y rutas avanzadas.
- Hay que cuidar CORS, validacion y errores manualmente.

### Opcion B: migrar a Next.js

Recomendada si el proyecto crecera con usuarios, auth, panel administrativo, moderacion o mas paginas.

Estructura futura:

```text
app/
  page.tsx
  api/annotations/route.ts
components/
  AnnotationLayer.tsx
  AnnotationMarker.tsx
  AnnotationComposer.tsx
lib/
  db.ts
  annotations.ts
public/
  assets/
```

Ventajas:

- Mejor integracion con Vercel.
- API routes y componentes organizados.
- Mejor camino para autenticacion y moderacion.

Limitaciones:

- Mayor migracion.
- Requiere convertir la pagina a componentes.

### Recomendacion practica

Para este proyecto escolar-editorial, implementar primero **Opcion A**:

1. Mantener la pagina estatica.
2. Agregar Vercel Functions para API.
3. Usar Postgres administrado desde Vercel Marketplace.
4. Dejar abierta la posibilidad de migrar a Next.js si el proyecto crece.

## Base de datos

### Proveedor recomendado

Dos opciones fuertes:

1. **Supabase**
   - Buena si se quiere autenticacion, reglas de seguridad, panel visual y posible realtime.
   - Conveniente para comentarios, usuarios, roles y moderacion.

2. **Neon Postgres**
   - Buena si se quiere Postgres simple y serverless.
   - Conviene si la API propia controlara toda la logica.

Para la mejor calidad con comentarios, usuarios y moderacion, la recomendacion es **Supabase**. Si el equipo quiere una implementacion mas minimalista, usar **Neon Postgres**.

No usar Edge Config para comentarios. Edge Config es para configuracion y lectura rapida, no para datos escritos por usuarios.

No usar Vercel Blob para comentarios. Blob sirve para archivos, no para texto estructurado. Podria usarse en el futuro si se permiten imagenes adjuntas.

### Modelo de datos

Tabla `annotation_pages`

Sirve para identificar la pagina o documento anotado. Aunque hoy solo haya una pagina, esto evita rehacer el modelo si despues existen mas articulos.

Campos:

| Campo | Tipo | Requerido | Descripcion |
|---|---|---:|---|
| `id` | uuid | si | Identificador interno |
| `slug` | text | si | Ejemplo: `caida-tenochtitlan` |
| `title` | text | si | Titulo de la pagina |
| `created_at` | timestamp | si | Fecha de creacion |

Tabla `annotations`

| Campo | Tipo | Requerido | Descripcion |
|---|---|---:|---|
| `id` | uuid | si | Identificador de la anotacion |
| `page_id` | uuid | si | Relacion con `annotation_pages` |
| `anchor_id` | text | si | Elemento estable anotado |
| `section_id` | text | si | ID de seccion: `origen`, `linea`, `ciudad`, etc. |
| `section_title` | text | si | Nombre visible de la seccion |
| `anchor_text` | text | no | Fragmento del contenido anotado |
| `x_ratio` | numeric | si | Posicion X relativa dentro del elemento, 0 a 1 |
| `y_ratio` | numeric | si | Posicion Y relativa dentro del elemento, 0 a 1 |
| `viewport_width` | integer | no | Ancho al crear, util para debug |
| `viewport_height` | integer | no | Alto al crear, util para debug |
| `author_id` | uuid | no | Usuario autenticado, si existe |
| `author_name` | text | si | Alias visible |
| `body` | text | si | Texto de la nota |
| `intent` | text | no | Tipo de nota |
| `status` | text | si | `visible`, `pending`, `hidden`, `deleted` |
| `edit_token_hash` | text | no | Para edicion anonima desde el mismo navegador |
| `created_at` | timestamp | si | Fecha de creacion |
| `updated_at` | timestamp | si | Fecha de actualizacion |

Tabla `annotation_replies`, opcional fase 2

| Campo | Tipo | Requerido | Descripcion |
|---|---|---:|---|
| `id` | uuid | si | Identificador |
| `annotation_id` | uuid | si | Comentario padre |
| `author_id` | uuid | no | Usuario autenticado |
| `author_name` | text | si | Alias visible |
| `body` | text | si | Respuesta |
| `status` | text | si | `visible`, `pending`, `hidden`, `deleted` |
| `created_at` | timestamp | si | Fecha |

Tabla `annotation_reports`, opcional fase 2

| Campo | Tipo | Requerido | Descripcion |
|---|---|---:|---|
| `id` | uuid | si | Identificador |
| `annotation_id` | uuid | si | Nota reportada |
| `reason` | text | si | Motivo |
| `details` | text | no | Detalle |
| `created_at` | timestamp | si | Fecha |

## Estrategia de posicionamiento

Guardar solo pixeles absolutos es fragil. La posicion debe guardarse de forma relativa al elemento anotado.

Al hacer clic:

1. Buscar el elemento anotable mas cercano.
2. Leer su `data-anchor-id`.
3. Calcular `x_ratio`:

```text
(clickX - elementLeft) / elementWidth
```

4. Calcular `y_ratio`:

```text
(clickY - elementTop) / elementHeight
```

5. Guardar tambien `section_id`, `section_title` y `anchor_text`.

Al renderizar:

1. Encontrar `[data-anchor-id="..."]`.
2. Colocar el marcador dentro de ese elemento con:

```text
left: x_ratio * 100%
top: y_ratio * 100%
```

3. Si el elemento ya no existe, mostrar la nota en el panel lateral bajo "Ubicacion no disponible".

## API propuesta

Base path:

```text
/api/annotations
```

### GET `/api/annotations?page=caida-tenochtitlan`

Devuelve notas visibles de una pagina.

Respuesta:

```json
{
  "annotations": [
    {
      "id": "uuid",
      "anchorId": "ciudad-agua-panel",
      "sectionId": "ciudad",
      "sectionTitle": "Ciudad lacustre",
      "anchorText": "El lago rodeaba a la ciudad...",
      "xRatio": 0.42,
      "yRatio": 0.3,
      "authorName": "Ana",
      "body": "Esta parte conecta muy bien con el sitio de 1521.",
      "intent": "Observacion",
      "createdAt": "2026-05-02T20:30:00.000Z"
    }
  ]
}
```

### POST `/api/annotations`

Crea una nota.

Payload:

```json
{
  "pageSlug": "caida-tenochtitlan",
  "anchorId": "ciudad-agua-panel",
  "sectionId": "ciudad",
  "sectionTitle": "Ciudad lacustre",
  "anchorText": "El lago rodeaba a la ciudad...",
  "xRatio": 0.42,
  "yRatio": 0.3,
  "authorName": "Ana",
  "body": "Esta parte conecta muy bien con el sitio de 1521.",
  "intent": "Observacion"
}
```

Validaciones:

- `pageSlug`: requerido, slug conocido.
- `anchorId`: requerido, maximo 120 caracteres.
- `sectionId`: requerido, maximo 80 caracteres.
- `xRatio`, `yRatio`: numeros entre 0 y 1.
- `authorName`: requerido, 1 a 40 caracteres.
- `body`: requerido, 3 a 500 caracteres.
- `intent`: opcional, debe pertenecer a lista permitida.

Respuesta:

```json
{
  "annotation": {
    "id": "uuid",
    "anchorId": "ciudad-agua-panel",
    "sectionId": "ciudad",
    "sectionTitle": "Ciudad lacustre",
    "anchorText": "El lago rodeaba a la ciudad...",
    "xRatio": 0.42,
    "yRatio": 0.3,
    "authorName": "Ana",
    "body": "Esta parte conecta muy bien con el sitio de 1521.",
    "intent": "Observacion",
    "createdAt": "2026-05-02T20:30:00.000Z"
  }
}
```

### PATCH `/api/annotations/:id`

Edita una nota propia.

Debe requerir:

- Sesion autenticada con autor coincidente.
- O token anonimo de edicion.
- O rol moderador.

### DELETE `/api/annotations/:id`

No borrar fisicamente en primera instancia. Cambiar `status` a `deleted`.

### POST `/api/annotations/:id/report`

Fase 2. Permite reportar contenido inapropiado.

## Seguridad

### Validacion

La API debe validar todo en servidor aunque el frontend ya valide.

Reglas minimas:

- Rechazar HTML en `body` y `authorName`.
- Escapar texto antes de renderizar.
- No usar `innerHTML` con contenido de usuarios.
- Limitar longitud.
- Limitar frecuencia de creacion.
- Rechazar coordenadas fuera de 0 a 1.
- Aceptar solo `anchor_id` existentes si el equipo mantiene una lista de anchors validos.

### Rate limiting

Agregar limite por IP o por sesion:

- 5 comentarios por minuto.
- 30 comentarios por hora.

Si se usa Upstash Redis, puede servir para rate limiting. Si no, Postgres puede manejar un limite simple por `created_at` e IP hasheada.

### Moderacion

Para fase 1:

- Guardar comentarios como `visible`.
- Permitir ocultar manualmente desde base de datos si algo sale mal.

Para fase 2:

- Agregar `pending` si se quiere revision antes de publicar.
- Agregar panel privado de moderacion.
- Agregar reportes.

### Datos personales

No pedir correo para comentar en fase 1 si no es necesario. Usar alias.

Si se guarda IP para seguridad, guardar hash, no la IP cruda, salvo que el equipo tenga una razon clara y aviso de privacidad.

## Autenticacion

Hay tres niveles posibles.

### Nivel 1: anonimo con alias

Recomendado para primera version.

- Persona escribe alias y comentario.
- Se guarda un token local para permitir editar/eliminar desde ese navegador.
- No hay cuentas.

Ventajas:

- Baja friccion.
- Ideal para actividad escolar.

Riesgos:

- Moderacion mas importante.
- Una persona puede cambiar de navegador y perder control sobre su comentario.

### Nivel 2: login simple

Usar Supabase Auth, Clerk u otra solucion.

- Comentarios ligados a usuario.
- Edicion/eliminacion confiable.
- Posibilidad de roles.

### Nivel 3: aula/grupo

Si el profesor quiere revisar participacion:

- Crear grupos.
- Asociar comentarios a actividad.
- Exportar comentarios.

No implementar esto en fase 1 salvo que sea requisito.

## Integracion con el codigo actual

### `index.html`

Agregar:

- Boton `Comentar` en `.topbar`.
- Contenedor global para capa de anotaciones.
- Atributos `data-annotatable` y `data-anchor-id` en elementos clave.
- Panel o modal para crear nota.

No duplicar navegacion. El boton **Indice** debe seguir abriendo el unico drawer actual.

### `assets/css/styles.css`

Agregar estilos para:

- Boton Comentar.
- Modo activo.
- Elementos anotables en hover.
- Marcadores.
- Tarjeta flotante.
- Formulario.
- Panel de notas.
- Estados de carga/error.
- Version movil.

Respetar `DESIGN.md`:

- Superficies near-white/parchment.
- Burgundy para acciones y estados activos.
- Bordes finos.
- Radio maximo 8px, salvo botones tipo pastilla ya existentes.

### `assets/js/main.js`

Agregar modulos logicos, idealmente separados aunque sigan en el mismo archivo:

- Estado de anotaciones.
- Activacion/desactivacion del modo comentar.
- Deteccion de elemento anotable.
- Calculo de coordenadas relativas.
- Render de marcadores.
- Apertura/cierre del composer.
- Llamadas a API.
- Manejo de errores.

Si el archivo crece demasiado, considerar crear:

```text
assets/js/annotations.js
```

y cargarlo despues de `main.js`.

## Estado de frontend

Estado minimo:

```js
{
  pageSlug: "caida-tenochtitlan",
  mode: "reading" | "commenting",
  annotationsVisible: true,
  annotations: [],
  activeAnnotationId: null,
  composer: {
    open: false,
    anchorId: null,
    sectionId: null,
    xRatio: null,
    yRatio: null
  },
  loading: false,
  error: null
}
```

Reglas:

- Al abrir el Indice, si hay composer abierto, cerrarlo o mantenerlo debajo del scrim segun UX decidida.
- Escape cierra composer, modal de galeria e indice. Respetar el orden: primero composer, luego modal, luego menu.
- No permitir crear anotacion mientras el modal de galeria esta abierto en fase 1.
- Si `annotationsVisible` es false, ocultar marcadores pero mantener datos cargados.

## Accesibilidad

Requisitos minimos:

- Boton Comentar con `aria-pressed`.
- Composer con `role="dialog"` si se abre como modal/flotante.
- Foco debe moverse al textarea al crear nota.
- Escape debe cerrar composer.
- Marcadores deben ser botones, no `div`.
- Cada marcador debe tener `aria-label`, por ejemplo:

```text
Abrir nota de Ana en Ciudad lacustre
```

- Contraste suficiente entre marcador y fondo.
- En teclado, debe existir una forma de anotar sin depender de clic exacto:
  - Boton "Anotar este parrafo" visible al enfocar elementos anotables, o
  - Atajo dentro del elemento enfocado.

## Responsividad

### Escritorio

- Composer flotante junto al punto clicado.
- Si no cabe, reposicionarlo dentro del viewport.
- Marcadores se posicionan dentro de su anchor.

### Movil

- Composer como sheet inferior.
- No exigir precision de clic.
- Al tocar un elemento anotable, abrir sheet con contexto.
- Marcadores pueden mostrarse al margen derecho del bloque o dentro del bloque, pero sin tapar texto.

## Estados vacios y errores

### Sin notas

Mensaje en panel de notas:

```text
Todavia no hay notas. Activa Comentar y agrega la primera.
```

### Error al cargar

```text
No se pudieron cargar las notas. La lectura sigue disponible.
```

La pagina nunca debe bloquear la lectura por fallos en comentarios.

### Error al guardar

Mantener el texto escrito y permitir reintentar.

## Despliegue en Vercel

### Proyecto estatico con API

Archivos futuros:

```text
api/annotations/index.js
api/annotations/[id].js
lib/db.js
```

Variables de entorno:

Para Supabase:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Para Neon:

```text
DATABASE_URL
```

No exponer llaves privadas al navegador. Las escrituras deben pasar por `/api/annotations` si se usa service role o conexion directa a DB.

### Marketplace

Preferir provisionar la base desde Vercel Marketplace para que las variables de entorno se conecten al proyecto automaticamente.

Opciones:

- Supabase: buena para auth, Postgres y reglas.
- Neon: buena para Postgres serverless simple.
- Upstash: util si se agrega rate limiting.

### Ambientes

Configurar:

- `development`
- `preview`
- `production`

Cada ambiente debe tener su propia base o al menos sus propias tablas/prefijos para no mezclar pruebas con produccion.

## Plan por fases

### Fase 1: anotaciones basicas

Alcance:

- Boton Comentar.
- Modo anotacion.
- Crear comentario con alias.
- Guardar en DB.
- Cargar comentarios visibles.
- Mostrar marcadores.
- Abrir tarjeta de comentario.
- Ocultar/mostrar notas.

No incluir:

- Respuestas.
- Likes.
- Login.
- Panel de moderacion complejo.
- Notificaciones.

### Fase 2: moderacion y panel

Alcance:

- Reportar comentario.
- Estados `pending` y `hidden`.
- Panel de notas por seccion.
- Editar/eliminar notas propias.
- Exportar comentarios a CSV o JSON.

### Fase 3: experiencia de aula

Alcance:

- Grupos o sesiones de clase.
- Preguntas detonadoras por seccion.
- Vista de profesor.
- Estadisticas de participacion.

## Criterios de aceptacion

La implementacion se considera lista cuando:

- El boton **Comentar** aparece junto a **Indice** sin duplicar navegacion.
- Activar Comentar cambia claramente el estado de la pagina.
- Se puede crear una nota ligada a un elemento especifico.
- La nota persiste al recargar la pagina.
- La nota se posiciona correctamente en escritorio y movil.
- Si cambia el tamano de pantalla, la nota sigue ligada al mismo elemento.
- El usuario puede ocultar las notas.
- La lectura funciona aunque falle la API.
- No se renderiza HTML enviado por usuarios.
- Todos los controles importantes funcionan con teclado.
- No hay anchors rotos en la navegacion existente.

## Pruebas recomendadas

### Funcionales

- Crear nota en un parrafo.
- Crear nota en mapa.
- Crear nota en tarjeta de galeria.
- Recargar y verificar persistencia.
- Ocultar y mostrar notas.
- Intentar enviar comentario vacio.
- Intentar enviar comentario demasiado largo.
- Simular fallo de API.

### Layout

- Escritorio ancho.
- Laptop.
- Tablet.
- Movil.
- Zoom del navegador al 125% y 150%.

### Accesibilidad

- Navegar con Tab.
- Abrir/cerrar composer con teclado.
- Verificar `aria-expanded`, `aria-pressed` y labels.
- Contraste de marcador y texto.

### Seguridad

- Intentar enviar `<script>`.
- Intentar enviar HTML.
- Intentar coordenadas fuera de rango.
- Intentar muchas notas rapidamente.

## Decisiones pendientes para el equipo

Antes de implementar, decidir:

1. Si los comentarios seran anonimos, con alias o con login.
2. Si las notas apareceran publicas inmediatamente o en revision.
3. Si se usara Supabase o Neon.
4. Si el proyecto seguira estatico con Vercel Functions o migrara a Next.js.
5. Si habra respuestas a comentarios en la primera version.
6. Si el profesor necesita exportar las notas.

## Recomendacion final

Implementar una primera version sobria:

- Sitio estatico actual.
- Vercel Functions.
- Supabase como Postgres + posible auth futura.
- Comentarios anonimos con alias.
- Marcadores discretos.
- Panel simple para ver/ocultar notas.
- Sin respuestas en fase 1.

Esta ruta mantiene el proyecto fiel a su identidad editorial y permite que la interactividad aumente la lectura historica en lugar de competir con ella.

## Anexo A: inventario inicial de anchors

Este inventario propone los `data-anchor-id` iniciales para la pagina actual. El equipo puede ajustar nombres, pero debe mantenerlos estables despues de publicar comentarios reales.

### Inicio

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Hero principal | `inicio-hero-title` | Opcional. Permite comentarios generales sobre el titulo. |

### Origen

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Titulo de apertura | `origen-title` | H2 de la seccion. |
| Parrafo lead | `origen-lead-migracion` | Primer parrafo largo de apertura. |
| Parrafo fundacion | `origen-body-fundacion-1325` | Menciona fundacion y lago de Texcoco. |
| Parrafo ciudad entera | `origen-body-ciudad-social` | Menciona barrios, escuelas, jueces, etc. |
| Ficha de sala | `origen-ficha-sala` | Panel lateral completo. |

### Linea del tiempo

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Titulo de seccion | `linea-title` | H2. |
| Card dinamica | `linea-card-active` | Si se guarda una nota aqui, tambien guardar `timelineItemId`. |
| Evento 1325 | `linea-evento-1325` | Boton o estado de timeline. |
| Evento 1428 | `linea-evento-1428` | Boton o estado de timeline. |
| Evento 1473 | `linea-evento-1473` | Boton o estado de timeline. |
| Evento 1519 | `linea-evento-1519-entrada` | Boton o estado de timeline. |
| Evento 1520 | `linea-evento-1520-crisis` | Boton o estado de timeline. |
| Evento 1521 | `linea-evento-1521-caida` | Boton o estado de timeline. |

Para elementos dinamicos como la linea del tiempo, guardar en la anotacion un campo extra opcional:

```text
context_key = "1325" | "1428" | "1473" | "1519" | "1520" | "1521"
```

Asi, al abrir la nota, el frontend puede activar el evento correcto antes de enfocar el marcador.

### Ciudad lacustre

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Titulo de seccion | `ciudad-title` | H2. |
| Panel Agua | `ciudad-panel-agua` | Tab activa por defecto. |
| Panel Chinampas | `ciudad-panel-chinampas` | Requiere activar tab antes de mostrar marcador. |
| Panel Mercado | `ciudad-panel-mercado` | Requiere activar tab antes de mostrar marcador. |
| Panel Templo | `ciudad-panel-templo` | Requiere activar tab antes de mostrar marcador. |
| Metricas | `ciudad-metricas` | Bloque de cifras. |
| Imagen placeholder | `ciudad-imagen-canales` | Visual lateral. |

Para tabs, guardar tambien:

```text
context_type = "tab"
context_key = "agua" | "chinampas" | "mercado" | "templo"
```

### Poder

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Titulo de seccion | `poder-title` | H2. |
| Capitulo Templo Mayor | `poder-capitulo-templo-mayor` | Capitulo I. |
| Capitulo Triple Alianza | `poder-capitulo-triple-alianza` | Capitulo II. |
| Capitulo Calpulli | `poder-capitulo-calpulli` | Capitulo III. |

### Encuentro

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Banda de cita | `encuentro-quote-band` | Cita del 8 de noviembre de 1519. |
| Detalle titulo | `encuentro-detalle-title` | H2 posterior. |
| Parrafo alianzas | `encuentro-body-alianzas` | Menciona guerra mesoamericana. |
| Parrafo crisis | `encuentro-body-crisis-viruela` | Menciona Moctezuma, Cuitlahuac y viruela. |
| Parrafo Cuauhtemoc | `encuentro-body-cuauhtemoc` | Cierre de detalle. |

### Sitio

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Titulo de seccion | `sitio-title` | H2. |
| Visual del sitio | `sitio-visual` | Placeholder y estado. |
| Paso mayo | `sitio-step-mayo-bloqueo` | Bloqueo inicial. |
| Paso junio | `sitio-step-junio-agua` | Agua potable. |
| Paso julio | `sitio-step-julio-tlatelolco` | Ultimo bastion. |
| Paso agosto | `sitio-step-agosto-caida` | Captura de Cuauhtemoc. |

Para scrolly, guardar:

```text
context_type = "scrolly"
context_key = "mayo" | "junio" | "julio" | "agosto"
```

### Mapa

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Titulo de mapa | `mapa-title` | H2. |
| Canvas del mapa | `mapa-canvas` | Comentarios generales en el mapa. |
| Pin Tenochtitlan | `mapa-pin-tenochtitlan` | Lugar especifico. |
| Pin Tlatelolco | `mapa-pin-tlatelolco` | Lugar especifico. |
| Pin Chapultepec | `mapa-pin-chapultepec` | Lugar especifico. |
| Pin Iztapalapa | `mapa-pin-iztapalapa` | Lugar especifico. |
| Pin Tlacopan | `mapa-pin-tlacopan` | Lugar especifico. |
| Pin Texcoco | `mapa-pin-texcoco` | Lugar especifico. |
| Panel del mapa | `mapa-panel-active` | Guardar `context_key` con el lugar activo. |

### Galeria

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Titulo de galeria | `galeria-title` | H2. |
| Coyolxauhqui | `galeria-artifact-coyolxauhqui` | Card. |
| Piedra del Sol | `galeria-artifact-piedra` | Card. |
| Codices | `galeria-artifact-codice` | Card. |
| Agua de Chapultepec | `galeria-artifact-acueducto` | Card. |
| Tlatelolco | `galeria-artifact-mercado` | Card. |
| Bergantines | `galeria-artifact-bergantines` | Card. |

### Legado

| Elemento | Anchor sugerido | Notas |
|---|---|---|
| Titulo de cierre | `legado-title` | H2. |
| Parrafo ciudad no desaparecio | `legado-lead-ciudad` | Lead. |
| Parrafo nombres actuales | `legado-body-nombres` | Chapultepec, Tacuba, etc. |
| Parrafo interpretacion final | `legado-body-cierre` | Cierre narrativo. |
| Fuentes integradas | `legado-fuentes-integradas` | Panel lateral. |
| Fuentes principales | `legado-fuentes-principales` | Details de fuentes. |

## Anexo B: DDL SQL orientativo

Este SQL es una referencia de estructura. El equipo debe adaptarlo al proveedor final, convenciones internas y sistema de migraciones.

```sql
create table annotation_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  created_at timestamptz not null default now()
);

create table annotations (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references annotation_pages(id) on delete cascade,
  anchor_id text not null,
  section_id text not null,
  section_title text not null,
  anchor_text text,
  context_type text,
  context_key text,
  x_ratio numeric(6,5) not null check (x_ratio >= 0 and x_ratio <= 1),
  y_ratio numeric(6,5) not null check (y_ratio >= 0 and y_ratio <= 1),
  viewport_width integer,
  viewport_height integer,
  author_id uuid,
  author_name text not null check (char_length(author_name) between 1 and 40),
  body text not null check (char_length(body) between 3 and 500),
  intent text check (intent in ('Pregunta', 'Observacion', 'Dato relacionado', 'Interpretacion', 'Correccion')),
  status text not null default 'visible' check (status in ('visible', 'pending', 'hidden', 'deleted')),
  edit_token_hash text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index annotations_page_status_created_idx
  on annotations (page_id, status, created_at desc);

create index annotations_anchor_idx
  on annotations (page_id, anchor_id);

create index annotations_section_idx
  on annotations (page_id, section_id);
```

Seed inicial:

```sql
insert into annotation_pages (slug, title)
values ('caida-tenochtitlan', 'Tenochtitlan: la ciudad que cayo de pie')
on conflict (slug) do nothing;
```

Notas:

- Si se usa Supabase Auth, `author_id` puede referenciar `auth.users(id)`.
- Si se usa Neon sin auth, `author_id` puede quedarse nulo en fase 1.
- Si se usa moderacion previa, cambiar default de `status` a `pending`.
- Si se usan RLS en Supabase, no exponer `edit_token_hash` en consultas publicas.

## Anexo C: contrato de errores de API

Usar respuestas consistentes para que el frontend no tenga que adivinar.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El comentario debe tener entre 3 y 500 caracteres.",
    "field": "body"
  }
}
```

Codigos sugeridos:

| Codigo | HTTP | Uso |
|---|---:|---|
| `VALIDATION_ERROR` | 400 | Payload invalido. |
| `NOT_FOUND` | 404 | Nota o pagina inexistente. |
| `RATE_LIMITED` | 429 | Demasiados comentarios. |
| `UNAUTHORIZED` | 401 | Falta sesion o token. |
| `FORBIDDEN` | 403 | No puede editar/eliminar esa nota. |
| `SERVER_ERROR` | 500 | Error inesperado. |

## Anexo D: eventos de UI

Nombres sugeridos para eventos internos del frontend:

| Evento | Cuando ocurre |
|---|---|
| `annotations:load:start` | Antes de pedir notas. |
| `annotations:load:success` | Al recibir notas. |
| `annotations:load:error` | Si falla la carga. |
| `annotations:mode:on` | Al activar Comentar. |
| `annotations:mode:off` | Al salir de Comentar. |
| `annotations:composer:open` | Al seleccionar un anchor. |
| `annotations:composer:close` | Al cerrar formulario. |
| `annotations:create:start` | Antes de publicar. |
| `annotations:create:success` | Al guardar. |
| `annotations:create:error` | Si falla guardado. |

No es obligatorio emitir eventos DOM personalizados, pero nombrarlos ayuda a organizar el codigo y las pruebas.

## Anexo E: reparto recomendado de PRs

Para reducir riesgo, dividir el trabajo en cambios pequenos.

### PR 1: preparar anchors y UI estatica

- Agregar boton Comentar.
- Agregar atributos `data-annotatable` y `data-anchor-id`.
- Agregar estilos base de modo comentar.
- Sin API todavia.
- Verificar que todos los `href="#..."` sigan apuntando a IDs existentes.

### PR 2: capa frontend local

- Activar/desactivar modo comentar.
- Detectar anchor.
- Abrir composer.
- Renderizar marcadores desde datos mock.
- Probar escritorio y movil.

### PR 3: API y base de datos

- Crear tablas/migraciones.
- Crear GET y POST.
- Validar payload.
- Sanitizar salida.
- Manejar errores.

### PR 4: persistencia completa

- Conectar frontend con API.
- Crear nota real.
- Recargar y verificar persistencia.
- Mostrar estados de carga/error.

### PR 5: seguridad y calidad

- Rate limiting.
- Edit token anonimo o decision de no editar en fase 1.
- Pruebas de XSS.
- Pruebas de accesibilidad.
- Revision visual final.

## Anexo F: detalles que no deben olvidarse

- No cerrar el Indice ni el modal de galeria de forma accidental al crear notas, salvo que el equipo decida una regla clara.
- No permitir anotaciones sobre la barra superior, scrim, drawer o footer.
- No guardar comentarios vacios o solo espacios.
- Normalizar espacios multiples en `body`.
- Mantener saltos de linea solo si el diseno los soporta.
- Usar fechas en ISO en API y formatear en frontend.
- Evitar dependencias pesadas para algo que puede resolverse con DOM y fetch.
- Si se cambia el texto historico, no cambiar anchors existentes sin migrar notas.
- Si un anchor desaparece, no borrar sus notas automaticamente.
- Documentar cualquier cambio de `data-anchor-id` en el PR que lo haga.
