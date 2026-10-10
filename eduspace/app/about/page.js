'use client';
import { useLang } from '@/lib/i18n';

export default function About() {
  const { t } = useLang();
  return (<><h2>{t('about')}</h2><div className="card"><p>{t('aboutText')}</p></div></>);
}
