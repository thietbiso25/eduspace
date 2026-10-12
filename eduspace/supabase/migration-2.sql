-- Bản cập nhật 3: ảnh bìa + kho ảnh. Chạy trong Supabase > SQL Editor (tab SQL, không phải Logs)
alter table posts add column if not exists cover_url text;

insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

create policy "public read images" on storage.objects for select using (bucket_id = 'images');
create policy "admin insert images" on storage.objects for insert with check (bucket_id = 'images' and public.is_admin());
create policy "admin update images" on storage.objects for update using (bucket_id = 'images' and public.is_admin());
create policy "admin delete images" on storage.objects for delete using (bucket_id = 'images' and public.is_admin());
