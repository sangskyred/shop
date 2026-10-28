'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

const Breadcrumbs = ({ items }) => {
	const { t } = useLanguage();

	return (
		<nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
			<ol className="breadcrumbs__list">
				{items.map((item, index) => {
					const isCurrentPage = index === items.length - 1;

					return (
						<li className="breadcrumbs__item" key={`${item.label}-${index}`}>
							{index > 0 && <span className="breadcrumbs__separator" aria-hidden="true">/</span>}
							{isCurrentPage ? (
								<span aria-current="page">{t(item.label)}</span>
							) : (
								<Link href={item.href}>{t(item.label)}</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
