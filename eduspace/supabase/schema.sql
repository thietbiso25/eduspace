-- Chạy toàn bộ file này trong Supabase: SQL Editor > New query > Run
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null, content text not null, emoji text,
  created_at timestamptz default now());
create table videos (
  id uuid primary key default gen_random_uuid(),
  title text not null, url text not null, emoji text,
  created_at timestamptz default now());
create table admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table stats (id int primary key default 1 check (id = 1), visits bigint not null default 0);
insert into stats (id, visits) values (1, 0);

alter table posts enable row level security;
alter table videos enable row level security;
alter table admins enable row level security;
alter table stats enable row level security;

create function is_admin() returns boolean language sql security definer stable
set search_path = public as $$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- Ai cũng đọc được; chỉ admin được thêm, sửa, xóa
create policy "read posts" on posts for select using (true);
create policy "admin write posts" on posts for all using (is_admin()) with check (is_admin());
create policy "read videos" on videos for select using (true);
create policy "admin write videos" on videos for all using (is_admin()) with check (is_admin());
create policy "read stats" on stats for select using (true);

-- Đếm lượt truy cập (ai cũng gọi được, nhưng chỉ làm được đúng việc +1)
create function increment_visits() returns bigint language sql security definer
set search_path = public as $$ update stats set visits = visits + 1 where id = 1 returning visits $$;
grant execute on function increment_visits() to anon, authenticated;

-- SAU KHI tạo tài khoản admin (Authentication > Users > Add user), chạy dòng này
-- (thay email của bạn):
-- insert into admins (user_id) select id from auth.users where email = 'email-cua-ban@gmail.com';

-- (Cài mới) chạy thêm file migration-2.sql để có ảnh bìa và kho ảnh

-- (Cài mới) chạy thêm migration-2.sql và migration-3-games.sql
