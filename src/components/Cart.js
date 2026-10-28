'use client';

import Link from 'next/link';
import { getProductHref } from '../lib/productSlug';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, decreaseQuantity, removeFromCart, selectCartItems, selectCartTotal, setQuantity } from '../lib/features/cart/cartSlice';
import { formatCurrency } from '../lib/currency';
import Loading from './Loading';
import useHydrated from '../lib/useHydrated';
import { useLanguage } from './LanguageProvider';

const Cart = () => {
	const dispatch = useDispatch();
	const items = useSelector(selectCartItems);
	const total = useSelector(selectCartTotal);
	const hasMounted = useHydrated();
	const { language, t } = useLanguage();

	if (!hasMounted) {
		return <main className="container cart-page"><Loading message={t('Loading your cart...')} /></main>;
	}

	if (items.length === 0) {
		return (
			<main className="container cart-page">
				<div className="cart-empty">
					<p className="eyebrow">{t('Your bag')}</p>
					<h1>{t('Your cart is empty')}</h1>
					<p>{t('Browse the collection and add something you love.')}</p>
					<Link href="/search" className="product-cart-button">{t('Continue shopping')}</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="container cart-page">
			<div className="cart-page-heading">
				<div>
					<p className="eyebrow">{t('Your bag')}</p>
					<h1>{t('Shopping cart')}</h1>
				</div>
				<button className="cart-clear-button" type="button" onClick={() => dispatch(clearCart())}>{t('Clear cart')}</button>
			</div>
			<div className="cart-layout">
				<section className="cart-items" aria-label={t('Items in your cart')}>
					{items.map((item) => (
						<article className="cart-item" key={item.id}>
							<Link className="cart-item-image-link" href={getProductHref(item)} aria-label={`${t('View')} ${t(item.title)}`}>
								<img src={item.image} alt={t(item.title)} />
							</Link>
							<div className="cart-item-info">
								<p className="product-brand">{t(item.brand)}</p>
								<h2><Link href={getProductHref(item)}>{t(item.title)}</Link></h2>
								<p>{formatCurrency(item.price, language)} {t('each')}</p>
								<div className="cart-item-actions">
									<button type="button" onClick={() => dispatch(decreaseQuantity(item.id))} aria-label={`${t('Decrease quantity of')} ${t(item.title)}`}>−</button>
									<input
										className="cart-quantity-input"
										type="number"
										min="1"
										step="1"
										value={item.quantity}
										aria-label={`${t('Quantity of')} ${t(item.title)}`}
										onChange={(event) => {
											const quantity = Number(event.target.value);
											if (Number.isInteger(quantity) && quantity > 0) {
												dispatch(setQuantity({ id: item.id, quantity }));
											}
										}}
									/>
									<button type="button" onClick={() => dispatch(addToCart({ product: item }))} aria-label={`${t('Increase quantity of')} ${t(item.title)}`}>+</button>
									<button className="cart-remove-button" type="button" onClick={() => dispatch(removeFromCart(item.id))}>{t('Remove')}</button>
								</div>
							</div>
							<strong className="cart-item-subtotal">{formatCurrency(item.price * item.quantity, language)}</strong>
						</article>
					))}
				</section>
				<aside className="cart-summary">
					<h2>{t('Order summary')}</h2>
					<div><span>{t('Items')} ({items.reduce((count, item) => count + item.quantity, 0)})</span><span>{formatCurrency(total, language)}</span></div>
					<div><span>{t('Delivery')}</span><span>{t('Free')}</span></div>
					<div className="cart-total"><strong>{t('Total')}</strong><strong>{formatCurrency(total, language)}</strong></div>
					<Link className="product-cart-button cart-checkout-button" href="/checkout">{t('Continue to checkout')}</Link>
				</aside>
			</div>
		</main>
	);
};

export default Cart;
