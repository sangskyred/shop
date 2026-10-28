import HeaderDesktop from '../../components/HeaderDesktop';
import Breadcrumbs from '../../components/Breadcrumbs';
import LocalizedIntro from '../../components/LocalizedIntro';
import Category from '../../components/Category';
import { nfc } from '../../lib/text';

export const metadata = {
	title: nfc('All categories'),
};

export default function AllCategoriesPage() {
	return (
		<>
			<HeaderDesktop />
			<main className="container home-content">
				<Breadcrumbs items={[
					{ label: 'Home', href: '/' },
					{ label: 'All categories' },
				]} />
				<LocalizedIntro
					eyebrow="Browse categories"
					title="All categories"
					description="Explore every category and find products that match your interests."
				/>
				<Category title="Explore categories" variant="directory" showViewAll={false} />
			</main>
		</>
	);
}
