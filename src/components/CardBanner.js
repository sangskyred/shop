'use client';

import { useLanguage } from './LanguageProvider';

const CardBanner = ({
    imageUrl,
    mobileImageUrl,
    imageFit = 'cover',
    title,
    description,
    actionLabel = 'Shop now',
    actionHref = '#',
    note,
    isActive = false,
}) => {
    const { t } = useLanguage();
    return (
        <section className={`card-banner${imageFit === 'contain' ? ' card-banner--contain-image' : ''}`} aria-label={t(title)}>
            <div className="card-banner__content">
                <div className="card-banner__spacer" aria-hidden="true" />
                <h2>{t(title)}</h2>
                <p className="card-banner__description">{t(description)}</p>
                <a className="card-banner__action" href={actionHref}>
                    {t(actionLabel)}
                </a>
                <div className="card-banner__spacer" aria-hidden="true" />
                {note && <p className="card-banner__note">{t(note)}</p>}
            </div>
            <div className="card-banner__image-wrap">
                <picture>
                    {mobileImageUrl && <source media="(max-width: 760px)" srcSet={mobileImageUrl} />}
                    <img
                        className="card-banner__image"
                        src={imageUrl}
                        alt=""
                        loading={isActive ? 'eager' : 'lazy'}
                        fetchPriority={isActive ? 'high' : 'low'}
                    />
                </picture>
            </div>
        </section>
    );
};

export default CardBanner;