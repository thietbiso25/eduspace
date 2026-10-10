'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import Cover from './Cover';

export default function Items({ type, limit }) {
  const { t } = useLang();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let q = supabase.from(type).select('*').order('created_at', { ascending: false });
    if (limit) q = q.limit(limit);
    q.then(({ data }) => setRows(data || []));
  }, [type, limit]);

  if (!rows) return <p className="meta">…</p>;
  if (!rows.length) return <p className="meta">{t('empty')}</p>;

  return (
    <div className="grid">
      {rows.map((r) =>
        type === 'posts' ? (
          <div className="card" key={r.id}>
            <Cover title={r.title} emoji={r.emoji} tag={t('posts')} />
            <div className="meta">{new Date(r.created_at).toLocaleDateString()}</div>
            <h3>{r.title}</h3>
            <p>{limit && r.content.length > 110 ? r.content.slice(0, 110) + '…' : r.content}</p>
          </div>
        ) : (
          <div className="card" key={r.id}>
            <Cover title={r.title} emoji={r.emoji} tag="Video" play />
            <b>{r.title}</b><br />
            {/^https?:\/\//.test(r.url) && (
              <a href={r.url} target="_blank" rel="noopener noreferrer">{t('openVideo')}</a>
            )}
          </div>
        )
      )}
    </div>
  );
}
