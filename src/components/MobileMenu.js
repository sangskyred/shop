'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';
import categories from '../data/categories';
import { toCategorySlug } from '../lib/categorySlug';

const MobileMenu = ({ isOpen, onClose }) => {
	const { t } = useLanguage();
	const pathname = usePathname();
	const [openCategory, setOpenCategory] = useState(null);
	const triggerRefs = useRef({});

	if (!isOpen) {
		return null;
	}

	return (
		<>
			<button
				className="mobile-menu-backdrop"
				type="button"
				aria-label={t('Close navigation menu')}
				onClick={onClose}
			/>
			<nav
				className="mobile-menu-panel"
				id="header-navigation"
				aria-label={t('Main navigation')}
				onKeyDown={(event) => {
					if (event.key === 'Escape' && openCategory) {
						triggerRefs.current[openCategory]?.focus();
						setOpenCategory(null);
					}
				}}
			>
				<div className="mobile-menu-header">
					<Link className="logo mobile-menu-logo" href="/" onClick={onClose} aria-label="Market home">
						<span className="logo-word" aria-label="Market">
							<span>m</span>arket
						</span>
					</Link>
					<button
						className="mobile-menu-close"
						type="button"
						aria-label={t('Close navigation menu')}
						onClick={onClose}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M6 6L18 18M6 18L18 6L6 18Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>
				<ul className="mobile-menu-nav-list">
					<li>
						<Link
							href="/search"
							onClick={onClose}
							aria-current={pathname === '/search' || pathname === '/s' ? 'page' : undefined}
						>
							{t("Today's deals")}
						</Link>
					</li>
					{categories.map((category) => {
						const isCategoryActive = pathname === `/category/${category.slug}`
							|| pathname.startsWith(`/category/${category.slug}/`)
							|| pathname === `/collections/${category.slug}`
							|| pathname.startsWith(`/collections/${category.slug}/`);

						if (!category.subcategories) {
							return (
								<li key={category.slug}>
									<Link
										href={`/category/${category.slug}`}
										onClick={onClose}
										aria-current={isCategoryActive ? 'page' : undefined}
									>
										{t(category.title)}
									</Link>
								</li>
							);
						}

						const isOpen = openCategory === category.slug;
						const submenuId = `mobile-category-${category.slug}`;

						return (
							<li className="mobile-menu-category" key={category.slug}>
								<button
									className="mobile-menu-category__trigger"
									ref={(element) => {
										triggerRefs.current[category.slug] = element;
									}}
									type="button"
									aria-expanded={isOpen}
									aria-controls={submenuId}
									aria-current={isCategoryActive ? 'page' : undefined}
									onClick={() => setOpenCategory(isOpen ? null : category.slug)}
								>
									{t(category.title)}
									<span className="nav-category-chevron" aria-hidden="true" />
								</button>
								<ul className="mobile-menu-sub-list" id={submenuId} hidden={!isOpen}>
									<li>
										<Link
											href={`/category/${category.slug}`}
											onClick={onClose}
											aria-current={isCategoryActive ? 'page' : undefined}
										>
											{t(category.title)}
										</Link>
									</li>
									{category.subcategories.map((subcategory) => (
										<li key={subcategory}>
											<Link
												href={`/category/${category.slug}/${toCategorySlug(subcategory)}`}
												onClick={onClose}
											>
												{t(subcategory)}
											</Link>
										</li>
									))}
								</ul>
							</li>
						);
					})}
					<li>
						<Link
							href="/all-categories"
							onClick={onClose}
							aria-current={pathname === '/all-categories' ? 'page' : undefined}
						>
							{t('All categories')}
						</Link>
					</li>
				</ul>
				<div className="mobile-menu-language">
					<span>{t('Language')}</span>
					<LanguageSwitcher className="language-switcher--mobile" />
				</div>
			</nav>
		</>
	);
};

export default MobileMenu;
