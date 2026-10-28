import categories from '../data/categories';
import { nfc } from './text';
import { translate } from './translations';

export const normalizeSearchText = (value) => nfc(value)
	.normalize('NFD')
	.replace(/[\u0300-\u036f]/g, '')
	.toLocaleLowerCase();

export const matchesSearchText = (searchText, query) => {
	const words = normalizeSearchText(searchText).split(/\s+/);
	const queryWords = normalizeSearchText(query).split(/\s+/).filter(Boolean);

	return queryWords.every((queryWord) => words.some((word) => word.startsWith(queryWord)));
};

export const getProductSearchText = (product, t) => {
	const category = categories.find((item) => item.slug === product.category);
	const categoryNames = category
		? [category.title, t(category.title), translate(category.title, 'vi')]
		: [product.category];
	const title = product.title || product.name;

	return normalizeSearchText([
		title,
		t(title),
		translate(title, 'vi'),
		product.brand,
		product.category,
		...(product.searchTerms || []),
		...categoryNames,
	].join(' '));
};
