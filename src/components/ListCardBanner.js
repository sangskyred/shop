"use client";

import { useEffect, useState } from 'react';
import CardBanner from './CardBanner';
import Loading from './Loading';
import { useLanguage } from './LanguageProvider';

const getBannersFromApi = async () => {
	return [
		{
			id: 1,
			imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=85',
			mobileImageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=85',
			title: 'Good finds. Great prices.',
			description: 'From everyday essentials to one-of-a-kind treasures, find more of what you love.',
			actionLabel: "Shop today's deals",
			actionHref: '/search',
			note: 'New discoveries are just a click away.',
		},
		{
			id: 2,
			imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85',
			mobileImageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=85',
			title: 'Make every day a little better',
			description: 'Explore useful upgrades and thoughtful finds for your home and routine.',
			actionLabel: 'Explore home and garden',
			actionHref: '/collections/home-and-garden',
			note: 'Find something that fits your life.',
		},
		{
			id: 3,
			imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=85',
			mobileImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85',
			title: 'A little something special',
			description: 'Discover standout accessories, collectibles, and pieces worth keeping.',
			actionLabel: 'Explore unique finds',
			actionHref: '/collections/luxury',
			note: 'Your next favorite could be here.',
		},
		{
			id: 4,
			imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85',
			mobileImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85',
			title: 'Step into something new',
			description: 'Find the styles and everyday favorites you have been looking for.',
			actionLabel: 'Browse fashion finds',
			actionHref: '/search',
			note: 'Great picks, ready to discover.',
		},
	];
};

const ListCardBanner = () => {
	const [banners, setBanners] = useState([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const { t } = useLanguage();

	useEffect(() => {
		getBannersFromApi()
			.then(setBanners)
			.catch(() => setLoadError(true));
	}, []);

	useEffect(() => {
		if (isPaused || banners.length < 2) {
			return undefined;
		}

		const intervalId = window.setInterval(() => {
			setActiveIndex((currentIndex) => (currentIndex + 1) % banners.length);
		}, 5000);

		return () => window.clearInterval(intervalId);
	}, [banners.length, isPaused]);

	const showPrevious = () => {
		setActiveIndex((currentIndex) => (currentIndex - 1 + banners.length) % banners.length);
	};

	const showNext = () => {
		setActiveIndex((currentIndex) => (currentIndex + 1) % banners.length);
	};

	if (banners.length === 0) {
		if (loadError) {
			return <div className="card-banner-slideshow card-banner-slideshow--loading" role="alert">{t('Unable to load banners.')}</div>;
		}

		return <Loading className="card-banner-slideshow card-banner-slideshow--loading" message={t('Loading banners...')} />;
	}

	return (
		<div className="card-banner-slideshow">
			<div className="card-banner-slideshow__viewport" aria-live="polite">
				<div
					className="card-banner-slideshow__track"
					style={{ transform: `translateX(-${activeIndex * 100}%)` }}
				>
					{banners.map((banner, index) => (
						<div
							className="card-banner-slideshow__slide"
							key={banner.id}
							aria-hidden={index !== activeIndex}
							inert={index !== activeIndex}
						>
							<CardBanner {...banner} isActive={index === activeIndex} />
						</div>
					))}
				</div>
			</div>
			<div className="carousel__controls">
				<button
					type="button"
					className="carousel__control carousel__control--prev"
					onClick={showPrevious}
					aria-label={t('Previous slide')}
				>
					<span className="carousel__arrow carousel__arrow--previous" aria-hidden="true" />
				</button>
				<button
					type="button"
					className="carousel__control carousel__control--next"
					onClick={showNext}
					aria-label={t('Next slide')}
				>
					<span className="carousel__arrow carousel__arrow--next" aria-hidden="true" />
				</button>
				<button
					type="button"
					className="carousel__playback"
					onClick={() => setIsPaused((currentState) => !currentState)}
					aria-label={t(isPaused ? 'Play slideshow' : 'Pause slideshow')}
					aria-pressed={isPaused}
				>
					<span className={`carousel__pause-icon${isPaused ? ' is-playing' : ''}`} aria-hidden="true" />
				</button>
			</div>
			<div className="card-banner-slideshow__dots" role="tablist" aria-label={t('Choose a banner')}>
				{banners.map((banner, index) => (
					<button
						key={banner.id}
						type="button"
						className={`card-banner-slideshow__dot${index === activeIndex ? ' is-active' : ''}`}
						aria-label={`${t('Show banner')} ${index + 1}`}
						aria-selected={index === activeIndex}
						role="tab"
						onClick={() => setActiveIndex(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default ListCardBanner;
