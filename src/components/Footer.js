'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

const Footer = () => {
	const { t } = useLanguage();

	return (
		<footer className="site-footer">
			<div className="container site-footer__inner">
				<span>© {new Date().getFullYear()} Market</span>
				<nav aria-label={t('Footer navigation')}>
					<Link href="/all-categories">{t('All categories')}</Link>
				</nav>
			</div>
		</footer>
	);
};

export default Footer;
