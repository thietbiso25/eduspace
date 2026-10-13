'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { GAMES } from './games';

// Trò chơi dự phòng: dùng khi chưa chạy file SQL tạo bảng games
const builtin = GAMES.map((g, i) => ({
  id: 'b' + i, title: g.n, emoji: g.e, description: g.d, kind: 'quiz', questions: g.q, url: null,
}));

// Lấy danh sách trò chơi do quản trị viên cấu hình
export function useGames() {
  const [games, setGames] = useState(null);
  useEffect(() => {
    supabase.from('games').select('*').order('position').order('created_at')
      .then(({ data, error }) => setGames(error ? builtin : data || []));
  }, []);
  return games;
}
