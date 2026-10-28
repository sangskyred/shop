'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, selectCartItems, selectCartTotal } from '../lib/features/cart/cartSlice';
import { formatCurrency } from '../lib/currency';
import useHydrated from '../lib/useHydrated';
import Loading from './Loading';
import { nfc } from '../lib/text';
import { useLanguage } from './LanguageProvider';

const Checkout = () => {
	const dispatch = useDispatch();
	const items = useSelector(selectCartItems);
	const subtotal = useSelector(selectCartTotal);
	const hasMounted = useHydrated();
	const { language, t } = useLanguage();
	const [deliveryMethod, setDeliveryMethod] = useState('standard');
	const [paymentMethod, setPaymentMethod] = useState('card');
	const [country, setCountry] = useState('Vietnam');
	const [promoInput, setPromoInput] = useState('');
	const [promoApplied, setPromoApplied] = useState(false);
	const [promoMessage, setPromoMessage] = useState('');
	const [orderPlaced, setOrderPlaced] = useState(false);

	if (!hasMounted) {
		return <main className="container checkout-page"><Loading message={t('Loading checkout...')} /></main>;
	}

	if (orderPlaced) {
		return (
			<main className="container checkout-page">
				<section className="checkout-confirmation">
					<span className="checkout-confirmation-mark" aria-hidden="true">&#10003;</span>
					<p className="eyebrow">{t('Order received')}</p>
					<h1>{t('Thank you for your order.')}</h1>
					<p>{t('Your demo order has been placed. No payment was processed.')}</p>
					<Link className="product-cart-button" href="/search">{t('Continue shopping')}</Link>
				</section>
			</main>
		);
	}

	if (items.length === 0) {
		return (
			<main className="container checkout-page">
				<section className="checkout-empty">
					<p className="eyebrow">{t('Checkout')}</p>
					<h1>{t('Your cart is empty')}</h1>
					<Link href="/search" className="product-cart-button">{t('Browse products')}</Link>
				</section>
			</main>
		);
	}

	const shipping = deliveryMethod === 'express' ? 15.99 : 0;
	const discount = promoApplied ? subtotal * 0.1 : 0;
	const taxableSubtotal = Math.max(0, subtotal + shipping - discount);
	const taxRate = country === 'Vietnam' ? 0.1 : country === 'United States' ? 0.08 : 0;
	const tax = taxableSubtotal * taxRate;
	const total = taxableSubtotal + tax;
	const itemCount = items.reduce((count, item) => count + item.quantity, 0);
	const money = (amount) => formatCurrency(amount, language);

	const applyPromo = (event) => {
		if (promoInput.trim().toUpperCase() === 'WELCOME10') {
			setPromoApplied(true);
			setPromoMessage('WELCOME10 applied: 10% off.');
		} else {
			setPromoApplied(false);
			setPromoMessage('That promo code is not valid.');
		}
	};

	const placeOrder = (event) => {
		event.preventDefault();
		dispatch(clearCart());
		setOrderPlaced(true);
	};

	return (
		<main className="container checkout-page">
			<div className="checkout-heading">
				<div>
					<p className="eyebrow">{t('Secure checkout')}</p>
					<h1>{t('Complete your order')}</h1>
				</div>
				<Link href="/cart" className="checkout-back-link">{t('Back to cart')}</Link>
			</div>
			<form
				className="checkout-layout"
				onSubmit={placeOrder}
				onBlur={(event) => {
					const input = event.target;
					if (input instanceof HTMLInputElement && ['text', 'email', 'tel'].includes(input.type)) {
						input.value = nfc(input.value);
					}
				}}
			>
				<div className="checkout-main-column">
					<section className="checkout-section">
						<div className="checkout-section-heading"><span>01</span><h2>{t('Shipping address')}</h2></div>
						<div className="checkout-fields">
							<label className="checkout-field checkout-field--wide">{t('Full name')}<input name="fullName" autoComplete="name" required /></label>
							<label className="checkout-field">{t('Email address')}<input name="email" type="email" autoComplete="email" required /></label>
							<label className="checkout-field">{t('Phone number')}<input name="phone" type="tel" autoComplete="tel" required /></label>
							<label className="checkout-field checkout-field--wide">{t('Street address')}<input name="address" autoComplete="street-address" required /></label>
							<label className="checkout-field">{t('City')}<input name="city" autoComplete="address-level2" required /></label>
							<label className="checkout-field">{t('Postal code')}<input name="postalCode" autoComplete="postal-code" required /></label>
							<label className="checkout-field checkout-field--wide">{t('Country')}
								<select name="country" value={country} onChange={(event) => setCountry(event.target.value)}>
									<option value="Vietnam">{t('Vietnam')}</option>
									<option value="United States">{t('United States')}</option>
									<option value="Other">{t('Other')}</option>
								</select>
							</label>
						</div>
					</section>

					<section className="checkout-section">
						<div className="checkout-section-heading"><span>02</span><h2>{t('Delivery method')}</h2></div>
						<div className="checkout-choice-list">
							<label className={`checkout-choice${deliveryMethod === 'standard' ? ' is-selected' : ''}`}>
								<input type="radio" name="delivery" value="standard" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} />
								<span><strong>{t('Standard delivery')}</strong><small>{t('Arrives in 5-7 business days')}</small></span><b>{t('Free')}</b>
							</label>
							<label className={`checkout-choice${deliveryMethod === 'express' ? ' is-selected' : ''}`}>
								<input type="radio" name="delivery" value="express" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} />
								<span><strong>{t('Express delivery')}</strong><small>{t('Arrives in 1-2 business days')}</small></span><b>{money(15.99)}</b>
							</label>
						</div>
					</section>

					<section className="checkout-section">
						<div className="checkout-section-heading"><span>03</span><h2>{t('Payment method')}</h2></div>
						<div className="checkout-choice-list">
							<label className={`checkout-choice${paymentMethod === 'card' ? ' is-selected' : ''}`}>
								<input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
								<span><strong>{t('Credit or debit card')}</strong><small>{t('Visa, Mastercard, American Express')}</small></span><b aria-hidden="true">VISA</b>
							</label>
							{paymentMethod === 'card' && (
								<div className="checkout-card-fields">
									<label className="checkout-field checkout-field--wide">{t('Name on card')}<input name="cardName" autoComplete="cc-name" required /></label>
									<label className="checkout-field checkout-field--wide">{t('Card number')}<input name="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" minLength="12" required /></label>
									<label className="checkout-field">{t('Expiry date')}<input name="cardExpiry" autoComplete="cc-exp" placeholder="MM / YY" required /></label>
									<label className="checkout-field">{t('Security code')}<input name="cardCvc" inputMode="numeric" autoComplete="cc-csc" placeholder="CVV" minLength="3" required /></label>
								</div>
							)}
							<label className={`checkout-choice${paymentMethod === 'wallet' ? ' is-selected' : ''}`}>
								<input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
								<span><strong>{t('Digital wallet')}</strong><small>{t('Pay with your preferred wallet')}</small></span><b aria-hidden="true">WALLET</b>
							</label>
							<label className={`checkout-choice${paymentMethod === 'delivery' ? ' is-selected' : ''}`}>
								<input type="radio" name="payment" value="delivery" checked={paymentMethod === 'delivery'} onChange={() => setPaymentMethod('delivery')} />
								<span><strong>{t('Cash on delivery')}</strong><small>{t('Pay when your order arrives')}</small></span>
							</label>
						</div>
					</section>
				</div>

				<aside className="checkout-summary">
					<h2>{t('Order summary')} <span>{itemCount} {t('items')}</span></h2>
					<div className="checkout-order-items">
						{items.map((item) => (
							<div className="checkout-order-item" key={item.id}>
								<img src={item.image} alt="" />
								<div><strong>{t(item.title)}</strong><small>{t(item.brand)} · {t('Qty')} {item.quantity}</small></div>
								<b>{money(item.price * item.quantity)}</b>
							</div>
						))}
					</div>
					<div className="checkout-promo">
						<label htmlFor="promo-code">{t('Promo code')}</label>
						<div><input id="promo-code" value={promoInput} onChange={(event) => setPromoInput(nfc(event.target.value))} placeholder={t('Enter code')} disabled={promoApplied} /><button type="button" onClick={applyPromo} disabled={promoApplied}>{t('Apply')}</button></div>
						{promoMessage && <p className={promoApplied ? 'promo-success' : 'promo-error'} role="status">{t(promoMessage)}</p>}
					</div>
					<div className="checkout-cost-lines">
						<div><span>{t('Subtotal')}</span><b>{money(subtotal)}</b></div>
						<div><span>{t('Delivery')}</span><b>{shipping === 0 ? t('Free') : money(shipping)}</b></div>
						{promoApplied && <div><span>{t('Discount')}</span><b>-{money(discount)}</b></div>}
						<div><span>{t('Estimated tax')} ({Math.round(taxRate * 100)}%)</span><b>{money(tax)}</b></div>
					</div>
					<div className="checkout-total"><strong>{t('Total')}</strong><strong>{money(total)}</strong></div>
					<button className="checkout-place-order" type="submit">{t('Place order')} · {money(total)}</button>
					<p className="checkout-demo-note">{t('Demo checkout only. No payment will be processed.')}</p>
				</aside>
			</form>
		</main>
	);
};

export default Checkout;