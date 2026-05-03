# Sistema de anotaciones

## Flujo de usuario

1. El botón `Comentar` activa el modo comentar.
2. La barra contextual confirma el modo y ofrece `Ver notas` o `Cancelar`.
3. El usuario elige un fragmento con `data-annotatable="true"`.
4. El compositor pide alias, intención y comentario.
5. Al publicar, se guarda la nota y aparece un marcador circular.
6. `Ver notas` abre un panel lateral con todas las notas visibles.

## Backend

La página funciona en modo local desde `file://` usando `localStorage`. Para desplegarla con persistencia real:

1. Crea un proyecto de Supabase.
2. Ejecuta `supabase/migrations/20260503044933_create_annotation_system.sql` en el SQL editor o mediante el flujo de migraciones de Supabase.
3. En Vercel, define estas variables:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANNOTATION_ADMIN_TOKEN=...
RATE_LIMIT_SALT=...
```

4. Despliega el proyecto. Las rutas `/api/annotations` y `/api/annotations/[id]` funcionarán como Vercel Functions.

## Seguridad

- La clave `SUPABASE_SERVICE_ROLE_KEY` o `SUPABASE_SECRET_KEY` vive sólo en el servidor.
- El navegador nunca recibe claves privadas de Supabase.
- Las tablas tienen RLS activo.
- El frontend no usa `innerHTML` para comentarios de usuarios.
- El servidor rechaza HTML, comentarios vacíos, coordenadas fuera de rango y anchors no registrados.
- La eliminación queda protegida por `ANNOTATION_ADMIN_TOKEN`; la edición queda reservada para una fase con autenticación.

## Cambios de anchors

No cambies un `data-anchor-id` si ya hay notas en producción. Si un bloque narrativo cambia de texto, conserva el mismo anchor cuando siga representando la misma idea histórica.
