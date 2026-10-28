'use client';

import { useLanguage } from './LanguageProvider';

const LocalizedIntro = ({ eyebrow, title, description }) => {
	const { t } = useLanguage();

	return (
		<section className="search-intro">
			{eyebrow && <p className="eyebrow">{t(eyebrow)}</p>}
			<h1>{t(title)}</h1>
			{description && <p className="home-description">{t(description)}</p>}
		</section>
	);
};

export default LocalizedIntro;
