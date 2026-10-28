'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';

// Biến địa chỉ http(s) trong câu trả lời thành liên kết bấm được
function Linkify({ text }) {
  return text.split(/(https?:\/\/[^\s)]*[^\s).,;!?])/g).map((p, i) =>
    /^https?:\/\//.test(p)
      ? <a key={i} href={p} target="_blank" rel="noopener noreferrer">{p}</a>
      : <span key={i}>{p}</span>
  );
}

const CHIPS = ['sug1', 'sug4', 'sug5', 'sug2', 'sug3'];

// Nút nổi "Hỏi trợ lý" + khung chat, có mặt ở mọi trang
export default function ChatWidget() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(null);
  const [canSpeak, setCanSpeak] = useState(false);
  const end = useRef(null);
  const input = useRef(null);

  useEffect(() => { setCanSpeak('speechSynthesis' in window); }, []);

  // Mở khung từ nơi khác (menu, nút ở trang chủ) bằng sự kiện "open-chat"
  useEffect(() => {
    const o = () => setOpen(true);
    window.addEventListener('open-chat', o);
    return () => window.removeEventListener('open-chat', o);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', k);
    const id = setTimeout(() => input.current && input.current.focus(), 60);
    return () => { window.removeEventListener('keydown', k); clearTimeout(id); };
  }, [open]);

  useEffect(() => { end.current && end.current.scrollIntoView({ block: 'end' }); }, [msgs, busy, open]);
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  // Đọc to câu trả lời bằng giọng của thiết bị
  const speak = (id, content) => {
    const s = window.speechSynthesis;
    if (speaking === id) { s.cancel(); setSpeaking(null); return; }
    s.cancel();
    const u = new SpeechSynthesisUtterance(content.replace(/https?:\/\/\S+/g, ''));
    u.lang = lang === 'en' ? 'en-US' : 'vi-VN';
    u.onend = u.onerror = () => setSpeaking((c) => (c === id ? null : c));
    setSpeaking(id);
    s.speak(u);
  };

  const send = async (override) => {
    const q = (typeof override === 'string' ? override : text).trim();
    if (!q || busy) return;
    const next = [...msgs, { role: 'user', text: q }];
    setMsgs(next); setText(''); setBusy(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, lang }),
      });
      if (r.status === 429) setMsgs([...next, { role: 'assistant', text: t('limitMsg') }]);
      else if (!r.ok) setMsgs([...next, { role: 'assistant', text: t('errMsg') }]);
      else { const d = await r.json(); setMsgs([...next, { role: 'assistant', text: d.text || t('errMsg') }]); }
    } catch (e) {
      setMsgs([...next, { role: 'assistant', text: t('errMsg') }]);
    }
    setBusy(false);
  };

  const who = (id, content) => (
    <div className="cw-who">
      <span>🤖</span><b>{t('assistant')}</b>
      {canSpeak && (
        <button className="cw-spk" onClick={() => speak(id, content)} aria-label={t('listen')} title={t('listen')}>
          {speaking === id ? '⏹' : '🔊'}
        </button>
      )}
    </div>
  );

  if (!open) {
    return (
      <button className="cw-fab" onClick={() => setOpen(true)} aria-label={t('askAssistant')}>
        <span className="cw-ico">🤖</span>{t('askAssistant')}
      </button>
    );
  }

  return (
    <div className="cw-panel" role="dialog" aria-label={t('chatTitle')}>
      <div className="cw-head">
        <span className="cw-hico">🤖</span>
        <div><b>{t('chatTitle')}</b><small>{t('chatSub')}</small></div>
        <button className="cw-x" onClick={() => setOpen(false)} aria-label={t('close')}>✕</button>
      </div>

      <div className="cw-strip">
        <Link href="/posts" onClick={() => setOpen(false)}>📝 {t('posts')}</Link>{' · '}
        <Link href="/videos" onClick={() => setOpen(false)}>🎬 {t('videos')}</Link>{' · '}
        <Link href="/games" onClick={() => setOpen(false)}>🎮 {t('games')}</Link>
      </div>

      <div className="cw-msgs">
        <div className="cw-b">
          {who('hello', t('hello'))}
          {t('hello')}
          <span className="cw-note">{t('chatNote')}</span>
        </div>
        {msgs.map((m, i) =>
          m.role === 'user'
            ? <div key={i} className="cw-u">{m.text}</div>
            : <div key={i} className="cw-b">{who(i, m.text)}<Linkify text={m.text} /></div>
        )}
        {busy && <div className="cw-b">{t('thinking')}</div>}
        <div ref={end} />
      </div>

      <div className="cw-chips">
        {CHIPS.map((k) => <button key={k} className="cw-chip" onClick={() => send(t(k))}>{t(k)}</button>)}
      </div>

      <div className="cw-row">
        <input
          ref={input}
          value={text}
          maxLength={500}
          placeholder={t('askPh')}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
        />
        <button className="btn" onClick={() => send()}>{t('send')}</button>
      </div>
    </div>
  );
}
