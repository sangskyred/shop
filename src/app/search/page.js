import HeaderDesktop from "../../components/HeaderDesktop";
import Breadcrumbs from "../../components/Breadcrumbs";
import LocalizedIntro from "../../components/LocalizedIntro";
import SearchResults from "../../components/SearchResults";
import categories from "../../data/categories";
import { nfc } from "../../lib/text";

export default async function SearchPage({ searchParams }) {
	const params = await searchParams;
	const categorySlug = typeof params.category === 'string' ? nfc(params.category) : '';
	const category = categorySlug
		? categories.find((item) => item.slug === categorySlug)
		: undefined;

	return (
		<>
			<HeaderDesktop />
			<main className="container home-content">
				<Breadcrumbs items={[
					{ label: 'Home', href: '/' },
					...(category
						? [{ label: category.title, href: `/collections/${category.slug}` }]
						: [{ label: 'Search results' }]),
				]} />
				<LocalizedIntro
					eyebrow={category ? 'Search results' : undefined}
					title={category ? `${category.title} products` : 'Find your next favorite.'}
					description="Filter the collection by category, price, or brand."
				/>
				<SearchResults initialCategory={categorySlug} />
			</main>
		</>
	);
}
