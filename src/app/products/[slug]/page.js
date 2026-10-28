import { notFound, redirect } from 'next/navigation';
import HeaderDesktop from '../../../components/HeaderDesktop';
import ProductDetails from '../../../components/ProductDetails';
import products from '../../../data/products';
import todayDeals from '../../../data/todayDeals';
import { getProductHref, getProductSlug } from '../../../lib/productSlug';
import { nfc } from '../../../lib/text';

export default async function ProductDetailsPage({ params }) {
	const { slug: rawSlug } = await params;
	const slug = nfc(rawSlug);
	const allProducts = [...products, ...todayDeals];
	const productBySlug = allProducts.find((item) => getProductSlug(item) === slug);
	const productByLegacyId = /^\d+$/.test(slug)
		? allProducts.find((item) => item.id === Number(slug))
		: undefined;
	if (productByLegacyId) {
		redirect(getProductHref(productByLegacyId));
	}

	const product = productBySlug && products.find((item) => item.id === productBySlug.id);
	const deal = productBySlug && todayDeals.find((item) => item.id === productBySlug.id);
	const productDetails = product || (deal && {
		...deal,
		title: deal.name,
	});

	if (!productDetails) {
		notFound();
	}

	return (
		<>
			<HeaderDesktop />
			<ProductDetails product={productDetails} />
		</>
	);
}