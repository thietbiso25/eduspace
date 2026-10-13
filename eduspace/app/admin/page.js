'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import { uploadImage } from '@/lib/upload';
import RichEditor from '@/components/RichEditor';
import GameAdmin from '@/components/GameAdmin';
import ChatCheck from '@/components/ChatCheck';

const EMPTY = { title: '', content: '', emoji: '', cover_url: '' };
const hasContent = (s) => /<img/i.test(s) || s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() !== '';

export default function Admin() {
  const { t } = useLang();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [posts, setPosts] = useState([]);
  const [vids, setVids] = useState([]);
  const [pf, setPf] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [rk, setRk] = useState(0);
  const [busy, setBusy] = useState(false);
  const [vf, setVf] = useState({ title: '', url: '', emoji: '' });
  const top = useRef(null);

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

  const cancelEdit = () => { setPf(EMPTY); setEditId(null); setRk((k) => k + 1); };
  const startEdit = (p) => {
    setPf({ title: p.title, content: p.content, emoji: p.emoji || '', cover_url: p.cover_url || '' });
    setEditId(p.id); setRk((k) => k + 1); setMsg('');
    top.current && top.current.scrollIntoView({ behavior: 'smooth' });
  };

  const pickCover = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true); setMsg('Đang tải ảnh...');
    try {
      const url = await uploadImage(f);
      setPf((p) => ({ ...p, cover_url: url })); setMsg('');
    } catch (err) { setMsg(err.message); }
    setBusy(false);
  };

  const savePost = async () => {
    if (!pf.title.trim() || !hasContent(pf.content)) { setMsg('Cần nhập tiêu đề và nội dung.'); return; }
    const row = { title: pf.title.trim(), content: pf.content, emoji: pf.emoji.trim() || null, cover_url: pf.cover_url || null };
    const { error } = editId
      ? await supabase.from('posts').update(row).eq('id', editId)
      : await supabase.from('posts').insert(row);
    if (error) { setMsg(error.message); return; }
    cancelEdit(); setMsg(t('saved')); load();
  };

  const addVideo = async () => {
    if (!vf.title || !/^https?:\/\//.test(vf.url)) return;
    const { error } = await supabase.from('videos').insert({ ...vf, emoji: vf.emoji || null });
    setMsg(error ? error.message : '');
    if (!error) { setVf({ title: '', url: '', emoji: '' }); load(); }
  };
  const del = async (table, id) => {
    if (!window.confirm(t('confirmDel'))) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    setMsg(error ? error.message : '');
    if (table === 'posts' && id === editId) cancelEdit();
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
      <div className="sec" ref={top}>
        <h2>🔐 {t('adminTitle')}</h2>
        <button className="btn alt" onClick={() => supabase.auth.signOut()}>{t('logout')}</button>
      </div>
      {msg && <p className="meta">{msg}</p>}

      <div className="card">
        <h3>📝 {editId ? t('editing') : t('posts')}</h3>
        <input placeholder={t('titleLbl')} value={pf.title} onChange={(e) => setPf({ ...pf, title: e.target.value })} />

        <div className="meta">{t('coverLbl')}</div>
        {pf.cover_url && <img className="pcover" src={pf.cover_url} alt="" style={{ maxHeight: 200 }} />}
        <div className="row" style={{ marginBottom: 8 }}>
          <label className="btn alt">{t('uploadCover')}
            <input type="file" accept="image/*" hidden onChange={pickCover} disabled={busy} />
          </label>
          {pf.cover_url && <button className="btn alt" onClick={() => setPf({ ...pf, cover_url: '' })}>{t('removeCover')}</button>}
        </div>
        {!pf.cover_url && (
          <input placeholder={t('emojiLbl')} maxLength={4} value={pf.emoji} onChange={(e) => setPf({ ...pf, emoji: e.target.value })} />
        )}

        <div className="meta">{t('contentLbl')}</div>
        <RichEditor initial={pf.content} resetKey={rk} onChange={(html) => setPf((p) => ({ ...p, content: html }))} onError={setMsg} />

        <div className="row">
          <button className="btn" onClick={savePost} disabled={busy}>{editId ? t('save') : t('publish')}</button>
          {editId && <button className="btn alt" onClick={cancelEdit}>{t('cancel')}</button>}
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3>📚 {t('posts')} ({posts.length})</h3>
        {posts.map((p) => (
          <div className="row" key={p.id}>
            <span style={{ flex: 1 }}>{p.title}</span>
            <Link className="btn alt" href={`/posts/${p.id}`}>{t('view')}</Link>
            <button className="btn alt" onClick={() => startEdit(p)}>{t('edit')}</button>
            <button className="btn alt" onClick={() => del('posts', p.id)}>{t('del')}</button>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3>🎬 {t('videos')}</h3>
        <input placeholder={t('titleLbl')} value={vf.title} onChange={(e) => setVf({ ...vf, title: e.target.value })} />
        <input placeholder={t('urlLbl')} value={vf.url} onChange={(e) => setVf({ ...vf, url: e.target.value })} />
        <input placeholder={t('emojiLbl')} maxLength={4} value={vf.emoji} onChange={(e) => setVf({ ...vf, emoji: e.target.value })} />
        <button className="btn" onClick={addVideo}>{t('addVideo')}</button>
        {vids.map((v) => (
          <div className="row" key={v.id}>
            <span style={{ flex: 1 }}>{v.title}</span>
            <button className="btn alt" onClick={() => del('videos', v.id)}>{t('del')}</button>
          </div>
        ))}
      </div>

      <GameAdmin onMsg={setMsg} />
      <ChatCheck />
    </>
  );
}
