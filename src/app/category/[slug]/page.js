import { notFound } from 'next/navigation';
import HeaderDesktop from '../../../components/HeaderDesktop';
import Breadcrumbs from '../../../components/Breadcrumbs';
import LocalizedIntro from '../../../components/LocalizedIntro';
import SearchResults from '../../../components/SearchResults';
import categories from '../../../data/categories';
import { nfc } from '../../../lib/text';

export default async function CategoryPage({ params }) {
	const { slug: rawSlug } = await params;
	const slug = nfc(rawSlug);
	const category = categories.find((item) => item.slug === slug);

	if (!category) {
		notFound();
	}

	return (
		<>
			<HeaderDesktop />
			<main className="container home-content">
				<Breadcrumbs items={[
					{ label: 'Home', href: '/' },
					{ label: category.title },
				]} />
				<LocalizedIntro
					eyebrow="Explore collection"
					title={category.title}
					description={`Browse products in the ${category.title} collection.`}
				/>
				<SearchResults initialCategory={category.slug} />
			</main>
		</>
	);
}
