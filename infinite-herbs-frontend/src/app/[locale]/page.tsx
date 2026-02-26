'use client'

import { useTranslations } from 'next-intl';

export default function Page() {
    const t = useTranslations('home')

    return (
        <div>
            <h1 className='font-bold'>{t('title')}</h1>
        </div>
    )
}
