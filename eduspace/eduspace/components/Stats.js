'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';

// Số đếm chạy từ 0 lên giá trị thật
function CountUp({ to }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (to == null) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(to / 40));
    const id = setInterval(() => {
      cur = Math.min(to, cur + step);
      setN(cur);
      if (cur >= to) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [to]);
  return <>{to == null ? '…' : n.toLocaleString()}</>;
}

export default function Stats() {
  const { t } = useLang();
  const [visits, setVisits] = useState(null);
  const [posts, setPosts] = useState(null);
  const [vids, setVids] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (!sessionStorage.getItem('seen')) {
          sessionStorage.setItem('seen', '1');
          const { data } = await supabase.rpc('increment_visits');
          setVisits(Number(data) || 0);
        } else {
          const { data } = await supabase.from('stats').select('visits').eq('id', 1).single();
          setVisits(Number(data?.visits) || 0);
        }
      } catch (e) {}
      try {
        const a = await supabase.from('posts').select('id', { count: 'exact', head: true });
        const b = await supabase.from('videos').select('id', { count: 'exact', head: true });
        setPosts(a.count ?? 0);
        setVids(b.count ?? 0);
      } catch (e) {}
    })();
  }, []);

  const items = [
    ['👀', visits, t('visits')],
    ['📝', posts, t('posts')],
    ['🎬', vids, t('videos')],
  ];
  return (
    <div className="stats">
      {items.map(([icon, n, label]) => (
        <div className="sc" key={label}>
          <div className="sic">{icon}</div>
          <div className="num"><CountUp to={n} /></div>
          <div>{label}</div>
        </div>
      ))}
    </div>
  );
}
