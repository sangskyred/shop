import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
	name: 'cart',
	initialState: { items: [] },
	reducers: {
		addToCart(state, action) {
			const { product, quantity = 1 } = action.payload;
			const existingItem = state.items.find((item) => item.id === product.id);

			if (existingItem) {
				existingItem.quantity += quantity;
			} else {
				state.items.push({ ...product, quantity });
			}
		},
		removeFromCart(state, action) {
			state.items = state.items.filter((item) => item.id !== action.payload);
		},
		decreaseQuantity(state, action) {
			const item = state.items.find((product) => product.id === action.payload);

			if (item && item.quantity > 1) {
				item.quantity -= 1;
			} else {
				state.items = state.items.filter((product) => product.id !== action.payload);
			}
		},
		setQuantity(state, action) {
			const { id, quantity } = action.payload;
			const item = state.items.find((product) => product.id === id);

			if (item && Number.isInteger(quantity) && quantity > 0) {
				item.quantity = quantity;
			}
		},
		clearCart(state) {
			state.items = [];
		},
		restoreCart(state, action) {
			state.items = action.payload;
		},
	},
});

export const { addToCart, removeFromCart, decreaseQuantity, setQuantity, clearCart, restoreCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;