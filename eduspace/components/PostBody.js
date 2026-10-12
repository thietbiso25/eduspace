'use client';
import { sanitize, isHtml } from '@/lib/sanitize';

// Hiển thị nội dung bài viết (HTML đã làm sạch; bài cũ dạng chữ thường vẫn hiển thị bình thường)
export default function PostBody({ content }) {
  if (!isHtml(content)) return <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>;
  return <div className="rich" dangerouslySetInnerHTML={{ __html: sanitize(content) }} />;
}
