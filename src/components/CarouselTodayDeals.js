'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import todayDeals from '../data/todayDeals';
import { formatCurrency } from '../lib/currency';
import { getProductHref } from '../lib/productSlug';
import { useLanguage } from './LanguageProvider';

const CarouselTodayDeals = () => {
  const { language, t } = useLanguage();
  const viewportRef = useRef(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const updateScrollButtons = () => {
      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
      setCanScrollPrevious(viewport.scrollLeft > 1);
      setCanScrollNext(viewport.scrollLeft < maxScrollLeft - 1);
    };

    updateScrollButtons();
    viewport.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(viewport);
    if (viewport.firstElementChild) {
      resizeObserver.observe(viewport.firstElementChild);
    }

    return () => {
      viewport.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
      resizeObserver.disconnect();
    };
  }, []);

  const showPrevious = () => {
    viewportRef.current?.scrollBy({ left: -viewportRef.current.clientWidth, behavior: 'smooth' });
  };

  const showNext = () => {
    viewportRef.current?.scrollBy({ left: viewportRef.current.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="today-deals" aria-labelledby="today-deals-title">
      <div className="today-deals__header">
        <div>
          <p className="eyebrow">{t('Deals of the day')}</p>
          <h2 id="today-deals-title">{t("Today's deals")}</h2>
        </div>
        <Link className="today-deals__view-all" href="/search">
          {t('See all deals')}
        </Link>
      </div>

      <div className="today-deals__carousel">
        <button
          type="button"
          className="today-deals__control today-deals__control--prev"
          onClick={showPrevious}
          disabled={!canScrollPrevious}
          aria-label={t('Previous deal')}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="today-deals__viewport" ref={viewportRef}>
          <div className="today-deals__track">
            {todayDeals.map((deal) => (
              <article key={deal.id} className="today-deal-card">
                <Link href={getProductHref(deal)} className="today-deal-card__link">
                  <div className="today-deal-card__image-wrap">
                    <img src={deal.image} alt={t(deal.name)} loading="lazy" />
                    <span className="today-deal-card__badge">-{deal.discount}%</span>
                  </div>

                  <div className="today-deal-card__body">
                    <p className="today-deal-card__brand">{t(deal.brand)}</p>
                    <h3>{t(deal.name)}</h3>
                    <div className="today-deal-card__pricing">
                      <span className="today-deal-card__price">{formatCurrency(deal.price, language)}</span>
                      <span className="today-deal-card__old-price">{formatCurrency(deal.previousPrice, language)}</span>
                    </div>
                    <p className="today-deal-card__delivery">{t(deal.delivery)}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="today-deals__control today-deals__control--next"
          onClick={showNext}
          disabled={!canScrollNext}
          aria-label={t('Next deal')}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

    </section>
  );
};

export default CarouselTodayDeals;
