import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';

export const makeStore = () => configureStore({
	reducer: {
		cart: cartReducer,
	},
});