'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';

export default function Visits() {
  const { t } = useLang();
  const [n, setN] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        if (!sessionStorage.getItem('seen')) {
          const { data } = await supabase.rpc('increment_visits');
          sessionStorage.setItem('seen', '1');
          setN(data);
        } else {
          const { data } = await supabase.from('stats').select('visits').eq('id', 1).single();
          setN(data?.visits);
        }
      } catch (e) {}
    })();
  }, []);
  return (
    <div className="card stat">
      <div className="num">{n == null ? '…' : Number(n).toLocaleString()}</div>
      {t('visits')}
    </div>
  );
}
