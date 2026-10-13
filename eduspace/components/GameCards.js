'use client';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { useGames } from '@/lib/useGames';
import Cover from './Cover';

// Lưới thẻ trò chơi. onPick: nếu có, bấm thẻ quiz sẽ gọi hàm này thay vì chuyển trang
export function GameGrid({ games, limit, onPick }) {
  const { t } = useLang();
  if (!games.length) return <p className="meta">{t('noGames')}</p>;
  return (
    <div className="grid">
      {games.slice(0, limit || games.length).map((g) => {
        const inner = (
          <>
            <Cover title={g.title} emoji={g.emoji} tag={t('games')} />
            <b>{g.title}</b><br />
            <span className="meta">{g.description}</span>
            {g.kind === 'link' && <div className="meta">{t('openGame')}</div>}
          </>
        );
        if (g.kind === 'link' && /^https?:\/\//.test(g.url || '')) {
          return <a key={g.id} className="card hv" href={g.url} target="_blank" rel="noopener noreferrer">{inner}</a>;
        }
        if (onPick) return <div key={g.id} className="card hv" onClick={() => onPick(g.id)}>{inner}</div>;
        return <Link key={g.id} className="card hv" href={`/games#${g.id}`}>{inner}</Link>;
      })}
    </div>
  );
}

export default function GameCards({ limit }) {
  const games = useGames();
  if (!games) return <p className="meta">…</p>;
  return <GameGrid games={games} limit={limit} />;
}
