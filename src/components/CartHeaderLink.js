'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../lib/features/cart/cartSlice';
import useHydrated from '../lib/useHydrated';
import { useLanguage } from './LanguageProvider';

const CartHeaderLink = ({ children }) => {
	const itemCount = useSelector(selectCartItemCount);
	const hasMounted = useHydrated();
	const { t } = useLanguage();

	const visibleCount = hasMounted ? itemCount : 0;

	return (
		<Link className="icon-button cart-button" href="/cart" aria-label={`${t('View cart')}, ${visibleCount} ${t('items')}`} title={t('View cart')}>
			{children}
			<span className="cart-count">{visibleCount}</span>
		</Link>
	);
};

export default CartHeaderLink;