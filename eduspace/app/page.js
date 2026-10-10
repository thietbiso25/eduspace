'use client';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { GAMES } from '@/lib/games';
import Items from '@/components/Items';
import Visits from '@/components/Visits';
import Cover from '@/components/Cover';

export default function Home() {
  const { t } = useLang();
  return (
    <>
      <div className="hero">
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroText')}</p>
        <Link className="btn" href="/games">{t('playNow')}</Link>{' '}
        <Link className="btn" href="/chat">{t('askBot')}</Link>
      </div>
      <div className="stat"><Visits /></div>

      <div className="sec"><h2>{t('featPosts')}</h2><Link className="btn alt" href="/posts">{t('more')}</Link></div>
      <Items type="posts" limit={4} />

      <div className="sec"><h2>{t('featVideos')}</h2><Link className="btn alt" href="/videos">{t('more')}</Link></div>
      <Items type="videos" limit={4} />

      <div className="sec"><h2>{t('featGames')}</h2><Link className="btn alt" href="/games">{t('more')}</Link></div>
      <div className="grid">
        {GAMES.map((g, i) => (
          <Link key={g.n} href={`/games#${i}`} className="card hv">
            <Cover title={g.n} emoji={g.e} tag={t('games')} />
            <b>{g.n}</b><br /><span className="meta">{g.d}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
