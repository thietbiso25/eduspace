'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import PostBody from '@/components/PostBody';

export default function PostPage() {
  const { id } = useParams();
  const { t } = useLang();
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    supabase.from('posts').select('*').eq('id', id).maybeSingle().then(({ data }) => setPost(data || null));
  }, [id]);

  if (post === undefined) return <p className="meta">…</p>;
  if (post === null) return (<><Link href="/posts">{t('backList')}</Link><p>{t('notFound')}</p></>);

  return (
    <article>
      <Link href="/posts">{t('backList')}</Link>
      {post.cover_url && <img className="pcover" src={post.cover_url} alt={post.title} />}
      <h2>{post.title}</h2>
      <div className="meta">{new Date(post.created_at).toLocaleDateString()}</div>
      <div className="card"><PostBody content={post.content} /></div>
    </article>
  );
}
