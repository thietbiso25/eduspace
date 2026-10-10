'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';

export default function Chat() {
  const { t, lang } = useLang();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);

  const send = async () => {
    const q = text.trim();
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
          {msgs.map((m, i) => <div key={i} className={'m ' + (m.role === 'user' ? 'u' : 'b')}>{m.text}</div>)}
          {busy && <div className="m b">{t('thinking')}</div>}
          <div ref={end} />
        </div>
        <div className="row">
          <input value={text} maxLength={500} placeholder={t('typeQ')}
            onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
          <button className="btn" onClick={send}>{t('send')}</button>
        </div>
      </div>
    </>
  );
}
