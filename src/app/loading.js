import Loading from '../components/Loading';

export default function LoadingPage() {
	return (
		<main className="route-loading" aria-busy="true">
			<Loading message="Loading page..." />
		</main>
	);
}