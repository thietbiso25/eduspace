'use client';
import { useState } from 'react';
import Cover from './Cover';
import { ytId } from '@/lib/youtube';

// Ảnh bìa video: tự lấy ảnh đại diện từ YouTube; nếu không phải YouTube
// hoặc ảnh lỗi thì dùng ảnh bìa màu + emoji như cũ.
export default function VideoThumb({ title, emoji, url }) {
  const id = ytId(url);
  const [bad, setBad] = useState(false);
  if (!id || bad) return <Cover title={title} emoji={emoji} tag="Video" play />;
  return (
    <div className="thumb">
      <img
        src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`}
        alt={title}
        loading="lazy"
        onError={() => setBad(true)}
      />
      <span className="tag">Video</span>
      <span className="pl">▶</span>
    </div>
  );
}
