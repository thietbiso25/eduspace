'use client';
import { useEffect, useState } from 'react';
import { GAMES } from '@/lib/games';
import { useLang } from '@/lib/i18n';
import Cover from '@/components/Cover';

export default function Games() {
  const { t } = useLang();
  const [g, setG] = useState(null);
  const [qi, setQi] = useState(0);
  const [sc, setSc] = useState(0);
  const [pick, setPick] = useState(null);

  const start = (i) => { setG(i); setQi(0); setSc(0); setPick(null); };
  useEffect(() => {
    const i = parseInt(location.hash.slice(1), 10);
    if (GAMES[i]) start(i);
  }, []);

  const G = g == null ? null : GAMES[g];
  const choose = (i) => {
    if (pick !== null) return;
    setPick(i);
    if (i === G.q[qi].a) setSc((s) => s + 1);
    setTimeout(() => { setQi((q) => q + 1); setPick(null); }, 900);
  };

  if (!G) {
    return (
      <>
        <h2>{t('featGames')}</h2>
        <p className="sub">{t('chooseGame')}</p>
        <div className="grid">
          {GAMES.map((x, i) => (
            <div key={x.n} className="card hv" onClick={() => start(i)}>
              <Cover title={x.n} emoji={x.e} tag={t('games')} />
              <b>{x.n}</b><br /><span className="meta">{x.d}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (qi >= G.q.length) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="num">🏆 {sc}/{G.q.length}</div>
        <button className="btn" onClick={() => start(g)}>{t('again')}</button>{' '}
        <button className="btn alt" onClick={() => setG(null)}>{t('back')}</button>
      </div>
    );
  }

  const q = G.q[qi];
  return (
    <div className="card">
      <button className="lnk" onClick={() => setG(null)}>{t('back')}</button>
      <div className="prog"><i style={{ width: `${(qi / G.q.length) * 100}%` }} /></div>
      <div className="meta">{t('question')} {qi + 1}/{G.q.length} · {t('score')}: {sc}</div>
      <h3>{q.q}</h3>
      {q.o.map((o, i) => (
        <button
          key={i}
          className={'opt' + (pick !== null && i === q.a ? ' ok' : '') + (pick === i && i !== q.a ? ' no' : '')}
          disabled={pick !== null}
          onClick={() => choose(i)}
        >{o}</button>
      ))}
    </div>
  );
}
