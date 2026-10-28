import HeaderDesktop from '../../components/HeaderDesktop';
import Breadcrumbs from '../../components/Breadcrumbs';
import LocalizedIntro from '../../components/LocalizedIntro';
import SearchResults from '../../components/SearchResults';
import categories from '../../data/categories';
import { nfc } from '../../lib/text';

export default async function ProductSearchPage({ searchParams }) {
	const params = await searchParams;
	const query = typeof params.k === 'string' ? nfc(params.k) : '';
	const requestedCategory = typeof params.category === 'string'
		? categories.find((category) => category.slug === nfc(params.category))
		: undefined;
	const requestedSubcategory = typeof params.subcategory === 'string'
		? nfc(params.subcategory)
		: '';
	const menuSubcategory = requestedCategory?.subcategories?.includes(requestedSubcategory)
		? requestedCategory
		: undefined;
	const menuCategory = menuSubcategory || (!requestedSubcategory ? requestedCategory : undefined);
	const title = query
		? `Results for “${query}”`
		: menuSubcategory
			? requestedSubcategory
			: menuCategory
				? menuCategory.title
			: 'Find your next favorite.';

	return (
		<>
			<HeaderDesktop searchQuery={query} />
			<main className="container home-content">
				<Breadcrumbs items={[
					{ label: 'Home', href: '/' },
					...(menuSubcategory
						? [
							{ label: menuCategory.title, href: `/s?category=${menuCategory.slug}` },
							{ label: requestedSubcategory },
						]
						: menuCategory
							? [{ label: menuCategory.title }]
						: [{ label: 'Search results' }]),
				]} />
				<LocalizedIntro
					title={title}
					description="Products matching your search."
				/>
				<SearchResults
					initialCategory={menuCategory?.slug}
					initialQuery={query}
					initialSubcategory={menuSubcategory ? requestedSubcategory : ''}
				/>
			</main>
		</>
	);
}
