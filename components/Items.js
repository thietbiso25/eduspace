'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import { excerpt } from '@/lib/sanitize';
import VideoThumb from './VideoThumb';
import PostThumb from './PostThumb';

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
          <Link href={`/posts/${r.id}`} className="card hv" key={r.id}>
            <PostThumb post={r} tag={t('posts')} />
            <div className="meta">{new Date(r.created_at).toLocaleDateString()}</div>
            <h3>{r.title}</h3>
            <p>{excerpt(r.content, 120)}</p>
          </Link>
        ) : (
          /^https?:\/\//.test(r.url) ? (
            <a className="card hv" key={r.id} href={r.url} target="_blank" rel="noopener noreferrer">
              <VideoThumb title={r.title} emoji={r.emoji} url={r.url} />
              <b>{r.title}</b><br />
              <span className="vlink">{t('openVideo')}</span>
            </a>
          ) : (
            <div className="card" key={r.id}>
              <VideoThumb title={r.title} emoji={r.emoji} url={r.url} />
              <b>{r.title}</b>
            </div>
          )
        )
      )}
    </div>
  );
}
