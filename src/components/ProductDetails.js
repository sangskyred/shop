'use client';

import { useEffect, useRef, useState } from 'react';
import AddToCartButton from './AddToCartButton';
import Breadcrumbs from './Breadcrumbs';
import categories from '../data/categories';
import { formatCurrency } from '../lib/currency';
import { useLanguage } from './LanguageProvider';

const ProductDetails = ({ product }) => {
	const images = product.images?.length ? product.images : [product.image];
	const category = categories.find((item) => item.slug === product.category);
	const { language, t } = useLanguage();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const selectedThumbnailRef = useRef(null);
	const selectedImage = images[selectedImageIndex] || images[0];
	const formattedPrice = formatCurrency(product.price, language);
	const description = product.description?.[language];

	useEffect(() => {
		selectedThumbnailRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	}, [selectedImageIndex]);

	return (
		<main className="container product-detail-page">
			<Breadcrumbs items={[
				{ label: 'Home', href: '/' },
				...(category ? [{ label: category.title, href: `/collections/${category.slug}` }] : []),
				{ label: t(product.title) },
			]} />
			<article className="product-detail">
				<div className="product-gallery">
					<div className="product-detail-image">
						<img src={selectedImage} alt={t(product.title)} />
						<span className="product-image-count" aria-live="polite">
							{selectedImageIndex + 1} / {images.length}
						</span>
					</div>
					<div className="product-thumbnails" aria-label={t('Product images')}>
						{images.map((image, index) => (
							<button
								className={`product-thumbnail${selectedImageIndex === index ? ' is-selected' : ''}`}
								type="button"
								key={`${image}-${index}`}
								ref={selectedImageIndex === index ? selectedThumbnailRef : null}
								onClick={() => setSelectedImageIndex(index)}
								aria-label={`${t('Show product image')} ${index + 1}`}
								aria-pressed={selectedImageIndex === index}
							>
								<img src={image} alt="" />
							</button>
						))}
					</div>
				</div>
				<div className="product-detail-info">
					<p className="eyebrow">{t(product.brand)}</p>
					<h1>{t(product.title)}</h1>
					{product.rating && (
						<p className="product-detail-rating">
							★ {product.rating}
							{product.reviewCount && <span> ({product.reviewCount} {t('reviews')})</span>}
						</p>
					)}
					<p className="product-detail-price">{formattedPrice}</p>
					{description && <p className="product-detail-description">{description}</p>}
					<p className="product-delivery">
						<svg className="product-delivery__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
							<circle cx="7.5" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.7" />
							<circle cx="17.5" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.7" />
						</svg>
						{t('Free delivery available')}
					</p>
					<div className="product-purchase-row">
						<label className="product-quantity-label" htmlFor="product-quantity">{t('Quantity')}</label>
						<input
							id="product-quantity"
							className="product-quantity-input"
							type="number"
							min="1"
							step="1"
							value={quantity}
							onChange={(event) => {
								const nextQuantity = Number(event.target.value);
								if (Number.isInteger(nextQuantity) && nextQuantity > 0) setQuantity(nextQuantity);
							}}
						/>
					</div>
					<AddToCartButton product={product} quantity={quantity} />
				</div>
			</article>
		</main>
	);
};

export default ProductDetails;