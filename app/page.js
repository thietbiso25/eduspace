'use client';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import GameCards from '@/components/GameCards';
import Items from '@/components/Items';
import Stats from '@/components/Stats';
import HeroArt from '@/components/HeroArt';

export default function Home() {
  const { t } = useLang();
  return (
    <>
      <div className="hero">
        <HeroArt />
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroText')}</p>
        <Link className="btn" href="/games">{t('playNow')}</Link>{' '}
        <button className="btn" onClick={() => window.dispatchEvent(new Event('open-chat'))}>{t('askBot')}</button>
      </div>
      <Stats />

      <div className="sec"><h2>{t('featPosts')}</h2><Link className="btn alt" href="/posts">{t('more')}</Link></div>
      <Items type="posts" limit={4} />

      <div className="sec"><h2>{t('featVideos')}</h2><Link className="btn alt" href="/videos">{t('more')}</Link></div>
      <Items type="videos" limit={4} />

      <div className="sec"><h2>{t('featGames')}</h2><Link className="btn alt" href="/games">{t('more')}</Link></div>
      <GameCards limit={4} />
    </>
  );
}
