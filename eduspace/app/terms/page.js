'use client';
import { useLang } from '@/lib/i18n';

export default function Terms() {
  const { t } = useLang();
  return (
    <>
      <h2>{t('terms')}</h2>
      <div className="card"><ul>{t('termsList').map((x, i) => <li key={i}>{x}</li>)}</ul></div>
    </>
  );
}
