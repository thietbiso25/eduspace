'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import ChatWidget from './ChatWidget';

const YT = process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@giaoducvasangtao';
const TT = process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@hong..nhunn';
const NAV = [['/', 'home'], ['/posts', 'posts'], ['/videos', 'videos'], ['/games', 'games'], ['/chat', 'chat']];

function Logo() {
  return (
    <Link href="/" className="logo"><span className="ico">🎓</span><span className="lt">EduSpace</span></Link>
  );
}

export default function Shell({ children }) {
  const { t, lang, setLang } = useLang();
  const path = usePathname();
  return (
    <>
      <header>
        <div className="bar">
          <Logo />
          <nav>
            {NAV.map(([href, k]) =>
              href === '/chat' ? (
                <button key={href} className="nbtn" onClick={() => window.dispatchEvent(new Event('open-chat'))}>{t(k)}</button>
              ) : (
                <Link key={href} href={href} className={path === href ? 'on' : ''}>{t(k)}</Link>
              )
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div className="fw">
          <div><Logo /><p>{t('footDesc')}</p></div>
          <div>
            <b>{t('links')}</b>
            <ul>
              <li><Link href="/">{t('home')}</Link></li>
              <li><Link href="/about">{t('about')}</Link></li>
              <li><Link href="/terms">{t('terms')}</Link></li>
            </ul>
          </div>
          <div>
            <b>{t('follow')}</b>
            <div className="soc">
              <a href={YT} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" /></svg>
              </a>
              <a href={TT} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <b>{t('language')}</b>
            <div className="soc">
              <button className={'lgb' + (lang === 'vi' ? ' on' : '')} onClick={() => setLang('vi')}>Tiếng Việt</button>
              <button className={'lgb' + (lang === 'en' ? ' on' : '')} onClick={() => setLang('en')}>English</button>
            </div>
          </div>
        </div>
        <div className="cp">{t('rights')}</div>
      </footer>
      <ChatWidget />
    </>
  );
}
