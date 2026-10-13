'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { useGames } from '@/lib/useGames';
import { GameGrid } from '@/components/GameCards';

export default function Games() {
  const { t } = useLang();
  const games = useGames();
  const [gid, setGid] = useState(null);
  const [qi, setQi] = useState(0);
  const [sc, setSc] = useState(0);
  const [pick, setPick] = useState(null);

  const start = (id) => { setGid(id); setQi(0); setSc(0); setPick(null); };

  // Mở thẳng trò chơi khi vào từ liên kết dạng /games#mã-trò-chơi
  useEffect(() => {
    if (!games) return;
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && games.some((g) => g.id === id && g.kind !== 'link')) start(id);
  }, [games]);

  if (!games) return <p className="meta">…</p>;
  const G = games.find((g) => g.id === gid);
  const qs = (G && G.questions) || [];

  const choose = (i) => {
    if (pick !== null) return;
    setPick(i);
    if (i === qs[qi].a) setSc((s) => s + 1);
    setTimeout(() => { setQi((q) => q + 1); setPick(null); }, 900);
  };

  if (!G || !qs.length) {
    return (
      <>
        <h2>{t('featGames')}</h2>
        <p className="sub">{t('chooseGame')}</p>
        <GameGrid games={games} onPick={start} />
      </>
    );
  }

  if (qi >= qs.length) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="num">🏆 {sc}/{qs.length}</div>
        <button className="btn" onClick={() => start(gid)}>{t('again')}</button>{' '}
        <button className="btn alt" onClick={() => setGid(null)}>{t('back')}</button>
      </div>
    );
  }

  const q = qs[qi];
  return (
    <div className="card">
      <button className="lnk" onClick={() => setGid(null)}>{t('back')}</button>
      <div className="prog"><i style={{ width: `${(qi / qs.length) * 100}%` }} /></div>
      <div className="meta">{t('question')} {qi + 1}/{qs.length} · {t('score')}: {sc}</div>
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
