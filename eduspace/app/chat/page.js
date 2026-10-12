'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';

// Biến địa chỉ http(s) trong câu trả lời thành liên kết bấm được
function Linkify({ text }) {
  return text.split(/(https?:\/\/[^\s)]*[^\s).,;!?])/g).map((p, i) =>
    /^https?:\/\//.test(p)
      ? <a key={i} href={p} target="_blank" rel="noopener noreferrer">{p}</a>
      : <span key={i}>{p}</span>
  );
}

export default function Chat() {
  const { t, lang } = useLang();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);

  const send = async (override) => {
    const q = (override ?? text).trim();
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

  return (
    <>
      <h2>🤖 {t('chat')}</h2>
      <div className="card chat">
        <div className="msgs">
          <div className="m b">{t('hello')}</div>
          {msgs.length === 0 && (
            <div className="chips">
              {['sug1', 'sug2', 'sug3'].map((k) => (
                <button key={k} className="chip" onClick={() => send(t(k))}>{t(k)}</button>
              ))}
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={'m ' + (m.role === 'user' ? 'u' : 'b')}>
              {m.role === 'user' ? m.text : <Linkify text={m.text} />}
            </div>
          ))}
          {busy && <div className="m b">{t('thinking')}</div>}
          <div ref={end} />
        </div>
        <div className="row">
          <input value={text} maxLength={500} placeholder={t('typeQ')}
            onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
          <button className="btn" onClick={() => send()}>{t('send')}</button>
        </div>
      </div>
    </>
  );
}
