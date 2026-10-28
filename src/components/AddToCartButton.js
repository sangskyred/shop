'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../lib/features/cart/cartSlice';
import { useLanguage } from './LanguageProvider';

const AddToCartButton = ({ product, quantity = 1 }) => {
	const dispatch = useDispatch();
	const { t } = useLanguage();
	const [isAdded, setIsAdded] = useState(false);

	useEffect(() => {
		if (!isAdded) return undefined;

		const timeoutId = window.setTimeout(() => setIsAdded(false), 1600);
		return () => window.clearTimeout(timeoutId);
	}, [isAdded]);

	const handleAddToCart = () => {
		dispatch(addToCart({ product, quantity }));
		setIsAdded(true);
	};

	return (
		<button
			type="button"
			className={`product-cart-button${isAdded ? ' is-added' : ''}`}
			onClick={handleAddToCart}
			aria-live="polite"
		>
			{t(isAdded ? 'Added to cart' : 'Add to cart')}
		</button>
	);
};

export default AddToCartButton;