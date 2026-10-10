# EduSpace — dự án thật (Next.js + Supabase)

## 1. Tạo cơ sở dữ liệu (Supabase)
1. Vào supabase.com → New project (đặt tên, đặt mật khẩu database, chọn vùng gần Việt Nam như Singapore).
2. Vào **SQL Editor** → New query → dán toàn bộ file `supabase/schema.sql` → Run.
3. Vào **Authentication → Users → Add user**: tạo tài khoản admin (email + mật khẩu của bạn).
4. Quay lại SQL Editor, chạy dòng cuối trong `schema.sql` (bỏ dấu `--`, thay email của bạn) để gán quyền admin.
5. Vào **Project Settings → API**: copy `Project URL` và `anon public key`.

## 2. Lấy khóa chatbot
Tạo khóa API Gemini (Google AI Studio). Kiểm tra tên model mới nhất rồi điền vào `GEMINI_MODEL`.
Không dán khóa này vào mã hay gửi cho ai.

## 3. Chạy thử trên máy (cần cài Node.js 18+)
```
cp .env.example .env.local     # rồi mở .env.local điền các giá trị
npm install
npm run dev                    # mở http://localhost:3000
```
Trang quản trị: `/admin` (không có nút trên menu, chỉ bạn biết đường dẫn).

## 4. Đưa lên mạng
1. Tạo kho mới trên GitHub, tải toàn bộ thư mục này lên (file `.env.local` đã được loại trừ).
2. Vào vercel.com → Add New → Project → chọn kho GitHub đó.
3. Ở mục **Environment Variables**, thêm đủ các biến như trong `.env.example`.
4. Bấm **Deploy**. Xong bạn có link dạng `ten-web.vercel.app`.
5. Muốn tên miền riêng: Vercel → Settings → Domains.

## Lưu ý
- Giới hạn chatbot (`CHAT_DAILY_LIMIT`) chỉ là lớp chặn cơ bản; theo dõi mức dùng trong trang quản lý của nhà cung cấp AI.
- Thay link YouTube/TikTok bằng kênh thật qua `NEXT_PUBLIC_YOUTUBE_URL` / `NEXT_PUBLIC_TIKTOK_URL`.
- Đọc lại nội dung trang Về chúng tôi và Điều khoản trong `lib/i18n.js` trước khi công khai.
