'use client';
import { useLang } from '@/lib/i18n';
import Items from '@/components/Items';

export default function Page() {
  const { t } = useLang();
  return (
    <>
      <h2>{t('posts')}</h2>
      <Items type="posts" />
    </>
  );
}
