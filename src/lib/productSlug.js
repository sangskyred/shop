const createSlug = (value) => value
	.normalize('NFD')
	.replace(/[\u0300-\u036f]/g, '')
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-|-$/g, '');

export const getProductSlug = (product) => createSlug(product.title || product.name);

export const getProductHref = (product) => `/products/${getProductSlug(product)}`;
