'use client';

import Link from 'next/link';
import { useRef } from 'react';
import categories from '../data/categories';
import { useLanguage } from './LanguageProvider';

const Category = ({ title = 'Explore categories', variant = 'default', showViewAll = true }) => {
	const { t } = useLanguage();
	const categoryListRef = useRef(null);
	const isCarousel = variant === 'carousel';

	const scrollCategories = (direction) => {
		const categoryList = categoryListRef.current;
		if (categoryList) {
			categoryList.scrollBy({ left: direction * categoryList.clientWidth * 0.8, behavior: 'smooth' });
		}
	};

	return (
		<section
			className={`category-section${variant === 'directory' ? ' category-section--directory' : ''}${variant === 'carousel' ? ' category-section--carousel' : ''}`}
			aria-labelledby="category-title"
		>
			<div className="category-heading">
				<div>
					<p className="eyebrow">{t(variant === 'directory' ? 'Browse categories' : 'Shop by interest')}</p>
					<h2 id="category-title">{t(title)}</h2>
				</div>
				{showViewAll && (
					<Link className="category-view-all" href="/all-categories">{t('View all')}</Link>
				)}
				{variant === 'directory' && (
					<span className="category-count">
						{categories.length} {t('categories')}
					</span>
				)}
			</div>
			<div className={isCarousel ? 'category-carousel' : undefined}>
				<div
					className={`category-grid${variant === 'directory' ? ' category-grid--directory' : ''}${isCarousel ? ' category-grid--carousel' : ''}`}
					ref={isCarousel ? categoryListRef : undefined}
				>
					{categories.map((category) => (
						<Link
							className="category-card"
							href={`/collections/${category.slug}`}
							key={category.slug}
							aria-label={t(category.title)}
						>
							<img src={category.image} alt={t(category.title)} loading="lazy" />
							<span>{t(category.title)}</span>
						</Link>
					))}
				</div>
				{isCarousel && (
					<>
						<button
							className="category-carousel__control category-carousel__control--prev"
							type="button"
							aria-label={t('Previous categories')}
							onClick={() => scrollCategories(-1)}
						>
							<span aria-hidden="true">‹</span>
						</button>
						<button
							className="category-carousel__control category-carousel__control--next"
							type="button"
							aria-label={t('Next categories')}
							onClick={() => scrollCategories(1)}
						>
							<span aria-hidden="true">›</span>
						</button>
					</>
				)}
			</div>
		</section>
	);
};

export default Category;
