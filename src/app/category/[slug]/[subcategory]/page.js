import { notFound } from 'next/navigation';
import HeaderDesktop from '../../../../components/HeaderDesktop';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import LocalizedIntro from '../../../../components/LocalizedIntro';
import SearchResults from '../../../../components/SearchResults';
import categories from '../../../../data/categories';
import { toCategorySlug } from '../../../../lib/categorySlug';
import { nfc } from '../../../../lib/text';

export default async function SubcategoryPage({ params }) {
	const { slug: rawCategorySlug, subcategory: rawSubcategorySlug } = await params;
	const categorySlug = nfc(rawCategorySlug);
	const subcategorySlug = nfc(rawSubcategorySlug);
	const category = categories.find((item) => item.slug === categorySlug);
	const subcategory = category?.subcategories?.find(
		(item) => toCategorySlug(item) === subcategorySlug,
	);

	if (!category || !subcategory) {
		notFound();
	}

	return (
		<>
			<HeaderDesktop />
			<main className="container home-content">
				<Breadcrumbs items={[
					{ label: 'Home', href: '/' },
					{ label: category.title, href: `/category/${category.slug}` },
					{ label: subcategory },
				]} />
				<LocalizedIntro
					eyebrow="Explore collection"
					title={subcategory}
					description={`Browse products in the ${subcategory} collection.`}
				/>
				<SearchResults
					initialCategory={category.slug}
					initialSubcategory={subcategory}
				/>
			</main>
		</>
	);
}
