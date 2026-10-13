-- Bản cập nhật 6: quản lý trò chơi trong trang /admin
-- Chạy trong Supabase > SQL Editor (tab SQL, không phải Logs)
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  emoji text,
  kind text not null default 'quiz' check (kind in ('quiz', 'link')),
  url text,
  questions jsonb,
  position int not null default 0,
  created_at timestamptz default now()
);
alter table games enable row level security;
drop policy if exists "read games" on games;
drop policy if exists "admin write games" on games;
create policy "read games" on games for select using (true);
create policy "admin write games" on games for all using (public.is_admin()) with check (public.is_admin());

-- Nạp sẵn 4 trò chơi hiện có (chỉ khi bảng còn trống)
do $$
begin
  if not exists (select 1 from games) then
    insert into games (title, description, emoji, kind, questions, position) values ('Quiz tổng hợp', '5 câu hỏi kiến thức chung.', '🎮', 'quiz', '[{"q":"Thủ đô của Việt Nam là gì?","o":["Hà Nội","Huế","Đà Nẵng","Cần Thơ"],"a":0},{"q":"7 × 8 bằng bao nhiêu?","o":["54","56","64","48"],"a":1},{"q":"Khí cây xanh hấp thụ khi quang hợp?","o":["Oxi","Nitơ","Cacbon đioxit","Hiđro"],"a":2},{"q":"Hành tinh lớn nhất Hệ Mặt Trời?","o":["Trái Đất","Sao Mộc","Sao Hỏa","Sao Thổ"],"a":1},{"q":"\"Truyện Kiều\" là tác phẩm của ai?","o":["Hồ Xuân Hương","Nguyễn Trãi","Nguyễn Du","Nguyễn Khuyến"],"a":2}]'::jsonb, 1);
    insert into games (title, description, emoji, kind, questions, position) values ('Toán vui', 'Thử tài tính nhanh.', '🧮', 'quiz', '[{"q":"12 + 15 = ?","o":["25","27","29","37"],"a":1},{"q":"9 × 6 = ?","o":["54","56","45","63"],"a":0},{"q":"100 − 37 = ?","o":["63","73","67","57"],"a":0},{"q":"48 ÷ 6 = ?","o":["6","7","8","9"],"a":2}]'::jsonb, 2);
    insert into games (title, description, emoji, kind, questions, position) values ('Khoa học vui', 'Khám phá thế giới tự nhiên.', '🔬', 'quiz', '[{"q":"Nước sôi ở bao nhiêu độ C?","o":["50","80","100","120"],"a":2},{"q":"Con nào là động vật có vú?","o":["Cá sấu","Cá heo","Cá mập","Rùa"],"a":1},{"q":"Trái Đất quay quanh gì?","o":["Mặt Trăng","Sao Hỏa","Mặt Trời","Sao Mộc"],"a":2},{"q":"Bộ phận nào bơm máu đi khắp cơ thể?","o":["Phổi","Tim","Gan","Dạ dày"],"a":1}]'::jsonb, 3);
    insert into games (title, description, emoji, kind, questions, position) values ('Tiếng Anh vui', 'Từ vựng cơ bản.', '🔤', 'quiz', '[{"q":"“Cat” nghĩa là gì?","o":["Con chó","Con mèo","Con chim","Con cá"],"a":1},{"q":"“Red” là màu gì?","o":["Xanh","Vàng","Đỏ","Tím"],"a":2},{"q":"Từ nào nghĩa là “quyển sách”?","o":["Pen","Book","Desk","Bag"],"a":1},{"q":"“Thank you” nghĩa là gì?","o":["Xin chào","Tạm biệt","Cảm ơn","Xin lỗi"],"a":2}]'::jsonb, 4);
  end if;
end
$$;
