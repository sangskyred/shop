'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import products from '../data/products';
import todayDeals from '../data/todayDeals';
import { getProductHref } from '../lib/productSlug';
import { getProductSearchText, matchesSearchText, normalizeSearchText } from '../lib/searchText';
import { nfc } from '../lib/text';
import { formatCurrency } from '../lib/currency';
import { useLanguage } from './LanguageProvider';

const priceOptions = [
	['0-100', 0, 100],
	['100-300', 100, 300],
	['300-700', 300, 700],
	['700-plus', 700, Infinity],
];

const SearchResults = ({ initialCategory, initialQuery = '', initialSubcategory = '' }) => {
	const selectedCategory = initialCategory || '';
	const normalizedQuery = normalizeSearchText(nfc(initialQuery).trim());
	const normalizedSubcategory = normalizeSearchText(nfc(initialSubcategory).trim());
	const { language, t } = useLanguage();
	const [selectedBrands, setSelectedBrands] = useState([]);
	const [selectedPrice, setSelectedPrice] = useState('');
	const [selectedSort, setSelectedSort] = useState('featured');

	const catalogProducts = useMemo(
		() => [
			...products,
			...todayDeals.map((deal) => ({
				...deal,
				title: deal.name,
			})),
		],
		[],
	);
	const categoryProducts = useMemo(
		() => catalogProducts.filter((product) => !selectedCategory || product.category === selectedCategory),
		[catalogProducts, selectedCategory],
	);
	const brandOptions = useMemo(
		() => [...new Set(categoryProducts.map((product) => product.brand))],
		[categoryProducts],
	);

	const filteredProducts = useMemo(() => {
		const priceRange = priceOptions.find(([value]) => value === selectedPrice);

		return categoryProducts.filter((product) => {
			const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
			const matchesPrice = !priceRange || (product.price >= priceRange[1] && product.price < priceRange[2]);
			const matchesQuery = !normalizedQuery || matchesSearchText(getProductSearchText(product, t), normalizedQuery);
			const matchesSubcategory = !normalizedSubcategory
				|| matchesSearchText(getProductSearchText(product, t), normalizedSubcategory);
			return matchesBrand && matchesPrice && matchesQuery && matchesSubcategory;
		});
	}, [categoryProducts, normalizedQuery, normalizedSubcategory, selectedBrands, selectedPrice, t]);
	const sortedProducts = useMemo(() => {
		if (selectedSort === 'price-low-to-high') {
			return [...filteredProducts].sort((left, right) => left.price - right.price);
		}
		if (selectedSort === 'price-high-to-low') {
			return [...filteredProducts].sort((left, right) => right.price - left.price);
		}
		return filteredProducts;
	}, [filteredProducts, selectedSort]);

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			console.info('[search diagnostic]', {
				query: initialQuery,
				subcategory: initialSubcategory,
				requestUrl: window.location.href,
				catalogCount: categoryProducts.length,
				resultCount: filteredProducts.length,
			});
		}
	}, [initialQuery, initialSubcategory, categoryProducts.length, filteredProducts.length]);

	const clearFilters = () => {
		setSelectedBrands([]);
		setSelectedPrice('');
	};

	const toggleBrand = (brand) => {
		setSelectedBrands((currentBrands) => (
			currentBrands.includes(brand)
				? currentBrands.filter((currentBrand) => currentBrand !== brand)
				: [...currentBrands, brand]
		));
	};

	return (
		<section className="search-results" aria-label={t('Product search results')}>
			<aside className="filter-sidebar">
				<div className="filter-heading">
					<h2>{t('Filter')}</h2>
					<button type="button" onClick={clearFilters}>{t('Clear all')}</button>
				</div>
				<fieldset className="filter-group">
					<legend>{t('Price')}</legend>
					{priceOptions.map(([value, minimum, maximum]) => {
						const label = minimum === 0
							? `${t('Under')} ${formatCurrency(maximum, language)}`
							: maximum === Infinity
								? `${t('From')} ${formatCurrency(minimum, language)}`
								: `${formatCurrency(minimum, language)} – ${formatCurrency(maximum, language)}`;

						return (
						<label className="filter-option" key={value}>
							<input type="radio" name="price" value={value} checked={selectedPrice === value} onChange={() => setSelectedPrice(value)} />
							<span>{t(label)}</span>
						</label>
						);
					})}
				</fieldset>
				<fieldset className="filter-group">
					<legend>{t('Brand')}</legend>
					{brandOptions.map((brand) => (
						<label className="filter-option" key={brand}>
							<input type="checkbox" name="brand" value={brand} checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
							<span>{t(brand)}</span>
						</label>
					))}
				</fieldset>
			</aside>
			<div className="product-results">
				<div className="results-toolbar">
					<div>
						<p className="eyebrow">{t('Shop the collection')}</p>
						<h2>{t('Results')}</h2>
					</div>
					<div className="results-toolbar__controls">
						<label className="results-sort">
							<span>{t('Sort by')}:</span>
							<select
								value={selectedSort}
								onChange={(event) => setSelectedSort(event.target.value)}
								aria-label={t('Sort by')}
							>
								<option value="featured">{t('Featured')}</option>
								<option value="price-low-to-high">{t('Price: low to high')}</option>
								<option value="price-high-to-low">{t('Price: high to low')}</option>
							</select>
						</label>
						<span>{filteredProducts.length} {t('products')}</span>
					</div>
				</div>
				<div className="product-list">
					{sortedProducts.map((product) => (
						<article className="product-card" key={product.id}>
							<Link className="product-image-wrap" href={getProductHref(product)} aria-label={`${t('View')} ${t(product.title)}`}>
								<img src={product.image} alt={t(product.title)} loading="lazy" />
							</Link>
							<div className="product-details">
								<p className="product-brand">{t(product.brand)}</p>
								<h3><Link href={getProductHref(product)}>{t(product.title)}</Link></h3>
								{product.rating && (
									<p className="product-rating">
										★ {product.rating}
										{product.reviewCount && <span> ({product.reviewCount} {t('reviews')})</span>}
									</p>
								)}
								<p className="product-price">{formatCurrency(product.price, language)}</p>
								<p className="product-delivery">{t('Free delivery available')}</p>
							</div>
						</article>
					))}
					{sortedProducts.length === 0 && (
						<div className="empty-results">
							<h3>{t('No products found')}</h3>
							<p>{t('Try clearing a filter or choosing another option.')}</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default SearchResults;