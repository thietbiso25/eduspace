import { supabase } from './supabase';

// Tải ảnh lên kho "images" của Supabase, trả về đường dẫn công khai
export async function uploadImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Chỉ chọn tệp ảnh (jpg, png, webp...).');
  if (file.size > 5 * 1024 * 1024) throw new Error('Ảnh tối đa 5 MB.');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
}
