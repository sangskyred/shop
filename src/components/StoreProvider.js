'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../lib/store';
import { restoreCart } from '../lib/features/cart/cartSlice';
import { LanguageProvider } from './LanguageProvider';

const StoreProvider = ({ children }) => {
	const [store] = useState(makeStore);

	useEffect(() => {
		try {
			const savedCart = window.localStorage.getItem('shopping-cart');
			const items = savedCart ? JSON.parse(savedCart) : [];
			const validItems = Array.isArray(items)
				? items.filter((item) => item && Number.isFinite(item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
				: [];

			store.dispatch(restoreCart(validItems));
		} catch {
			store.dispatch(restoreCart([]));
		}

		const unsubscribe = store.subscribe(() => {
			try {
				window.localStorage.setItem('shopping-cart', JSON.stringify(store.getState().cart.items));
			} catch {
				// Storage can be unavailable in private browsing or restricted environments.
			}
		});

		return unsubscribe;
	}, [store]);

	return (
		<Provider store={store}>
			<LanguageProvider>{children}</LanguageProvider>
		</Provider>
	);
};

export default StoreProvider;