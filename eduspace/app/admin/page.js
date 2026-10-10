'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';

export default function Admin() {
  const { t } = useLang();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [posts, setPosts] = useState([]);
  const [vids, setVids] = useState([]);
  const [pf, setPf] = useState({ title: '', content: '', emoji: '' });
  const [vf, setVf] = useState({ title: '', url: '', emoji: '' });

  const load = async () => {
    const a = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    const b = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setPosts(a.data || []); setVids(b.data || []);
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
    const { data: s } = supabase.auth.onAuthStateChange((_e, ses) => setUser(ses?.user || null));
    load();
    return () => s.subscription.unsubscribe();
  }, []);

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setMsg(error ? error.message : '');
  };
  const add = async (table, row, reset) => {
    const { error } = await supabase.from(table).insert({ ...row, emoji: row.emoji || null });
    setMsg(error ? error.message : '');
    if (!error) { reset(); load(); }
  };
  const del = async (table, id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    setMsg(error ? error.message : '');
    load();
  };

  if (!user) {
    return (
      <div className="card" style={{ maxWidth: 420, margin: 'auto' }}>
        <h2>🔐 {t('adminTitle')}</h2>
        <input placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder={t('password')} value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="btn" onClick={login}>{t('login')}</button>
        {msg && <p className="meta">{msg}</p>}
      </div>
    );
  }

  return (
    <>
      <div className="sec">
        <h2>🔐 {t('adminTitle')}</h2>
        <button className="btn alt" onClick={() => supabase.auth.signOut()}>{t('logout')}</button>
      </div>
      {msg && <p className="meta">{msg}</p>}

      <div className="card">
        <h3>📝 {t('posts')}</h3>
        <input placeholder={t('titleLbl')} value={pf.title} onChange={(e) => setPf({ ...pf, title: e.target.value })} />
        <input placeholder={t('emojiLbl')} maxLength={4} value={pf.emoji} onChange={(e) => setPf({ ...pf, emoji: e.target.value })} />
        <textarea placeholder={t('contentLbl')} value={pf.content} onChange={(e) => setPf({ ...pf, content: e.target.value })} />
        <button className="btn" onClick={() => pf.title && pf.content && add('posts', pf, () => setPf({ title: '', content: '', emoji: '' }))}>{t('publish')}</button>
        {posts.map((p) => (
          <div className="row" key={p.id}><span style={{ flex: 1 }}>{p.title}</span><button className="btn alt" onClick={() => del('posts', p.id)}>{t('del')}</button></div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3>🎬 {t('videos')}</h3>
        <input placeholder={t('titleLbl')} value={vf.title} onChange={(e) => setVf({ ...vf, title: e.target.value })} />
        <input placeholder={t('urlLbl')} value={vf.url} onChange={(e) => setVf({ ...vf, url: e.target.value })} />
        <input placeholder={t('emojiLbl')} maxLength={4} value={vf.emoji} onChange={(e) => setVf({ ...vf, emoji: e.target.value })} />
        <button className="btn" onClick={() => vf.title && /^https?:\/\//.test(vf.url) && add('videos', vf, () => setVf({ title: '', url: '', emoji: '' }))}>{t('addVideo')}</button>
        {vids.map((v) => (
          <div className="row" key={v.id}><span style={{ flex: 1 }}>{v.title}</span><button className="btn alt" onClick={() => del('videos', v.id)}>{t('del')}</button></div>
        ))}
      </div>
    </>
  );
}
