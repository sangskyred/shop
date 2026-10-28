'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import categories from '../data/categories';
import { toCategorySlug } from '../lib/categorySlug';

const DesktopMenu = () => {
	const { t } = useLanguage();
	const pathname = usePathname();
	const [openCategory, setOpenCategory] = useState(null);
	const triggerRefs = useRef({});
	const isDealsActive = pathname === '/search' || pathname === '/s';

	return (
		<nav
			className="desktop-menu header-navigation"
			aria-label={t('Main navigation')}
			onKeyDown={(event) => {
				if (event.key === 'Escape' && openCategory) {
					triggerRefs.current[openCategory]?.focus();
					setOpenCategory(null);
				}
			}}
		>
			<ul className="nav-list">
				<li>
					<Link href="/search" aria-current={isDealsActive ? 'page' : undefined}>
						{t("Today's deals")}
					</Link>
				</li>
				{categories.map((category) => {
					const hasSubcategories = Boolean(category.subcategories);
					const isOpen = openCategory === category.slug;
					const isCategoryActive = pathname === `/category/${category.slug}`
						|| pathname.startsWith(`/category/${category.slug}/`)
						|| pathname === `/collections/${category.slug}`
						|| pathname.startsWith(`/collections/${category.slug}/`);
					const menuId = `desktop-category-${category.slug}`;

					return (
						<li
							className={isOpen ? 'nav-item--has-menu is-open' : hasSubcategories ? 'nav-item--has-menu' : undefined}
							key={category.slug}
							onPointerEnter={() => hasSubcategories && setOpenCategory(category.slug)}
							onPointerLeave={(event) => {
								if (hasSubcategories && !event.currentTarget.matches(':focus-within')) {
									setOpenCategory(null);
								}
							}}
							onBlur={(event) => {
								if (hasSubcategories && !event.currentTarget.contains(event.relatedTarget)) {
									setOpenCategory(null);
								}
							}}
						>
							{hasSubcategories ? (
								<>
									<button
										className="nav-category-trigger"
										ref={(element) => {
											triggerRefs.current[category.slug] = element;
										}}
										type="button"
										aria-expanded={isOpen}
										aria-controls={menuId}
										aria-current={isCategoryActive ? 'page' : undefined}
										onFocus={() => setOpenCategory(category.slug)}
										onClick={() => setOpenCategory(isOpen ? null : category.slug)}
									>
										{t(category.title)}
										<span className="nav-category-chevron" aria-hidden="true" />
									</button>
									<div className="mega-menu" id={menuId} hidden={!isOpen}>
										<ul className="mega-menu__links">
											{category.subcategories.map((subcategory) => (
												<li key={subcategory}>
													<Link href={`/category/${category.slug}/${toCategorySlug(subcategory)}`}>
														{t(subcategory)}
													</Link>
												</li>
											))}
										</ul>
										<Link className="mega-menu__feature" href={`/category/${category.slug}`}>
											<img src={category.image} alt="" />
											<span className="mega-menu__feature-content">
												<strong>{t(category.title)}</strong>
												<span>{t('Shop now')}</span>
											</span>
										</Link>
									</div>
								</>
							) : (
								<Link
									href={`/category/${category.slug}`}
									aria-current={isCategoryActive ? 'page' : undefined}
								>
									{t(category.title)}
								</Link>
							)}
						</li>
					);
				})}
				<li>
					<Link href="/all-categories" aria-current={pathname === '/all-categories' ? 'page' : undefined}>
						{t('All categories')}
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default DesktopMenu;
