drop policy if exists "public can create visible annotations" on public.annotations;
create policy "public can create visible annotations"
on public.annotations
for insert
to anon, authenticated
with check (status = 'visible');

grant insert (
  page_id,
  anchor_id,
  section_id,
  section_title,
  anchor_text,
  context_type,
  context_key,
  x_ratio,
  y_ratio,
  viewport_width,
  viewport_height,
  author_name,
  body,
  intent,
  status
) on public.annotations to anon, authenticated;
