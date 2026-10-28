'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Đường dẫn cũ /chat: về trang chủ rồi mở khung chat nổi
export default function ChatRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
    const id = setTimeout(() => window.dispatchEvent(new Event('open-chat')), 300);
    return () => clearTimeout(id);
  }, [router]);
  return null;
}
