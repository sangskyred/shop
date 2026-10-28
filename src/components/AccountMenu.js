'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { nfc } from '../lib/text';
import { useLanguage } from './LanguageProvider';

const AccountMenu = ({ children, user = null, onLogout }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useLanguage();
	const menuRef = useRef(null);
	const displayName = nfc(user?.name || user?.email || '');
	const initial = displayName.trim().charAt(0).toUpperCase();

	useEffect(() => {
		if (!isOpen) return undefined;

		const closeOnOutsideClick = (event) => {
			if (!menuRef.current?.contains(event.target)) setIsOpen(false);
		};
		const closeOnEscape = (event) => {
			if (event.key === 'Escape') setIsOpen(false);
		};

		document.addEventListener('pointerdown', closeOnOutsideClick);
		document.addEventListener('keydown', closeOnEscape);
		return () => {
			document.removeEventListener('pointerdown', closeOnOutsideClick);
			document.removeEventListener('keydown', closeOnEscape);
		};
	}, [isOpen]);

	const closeMenu = () => setIsOpen(false);

	return (
		<div className="account-menu" ref={menuRef}>
			<button
				className={`icon-button account-menu-trigger${user ? ' account-menu-trigger--signed-in' : ''}`}
				type="button"
				aria-label={user ? `${t('Account menu for')} ${displayName}` : t('Open account menu')}
				aria-haspopup="menu"
				aria-expanded={isOpen}
				title={user ? displayName : t('Account')}
				onClick={() => setIsOpen((open) => !open)}
			>
				{user?.avatar ? <img className="account-avatar" src={user.avatar} alt="" /> : user ? <span className="account-initial">{initial}</span> : children}
				{user && <span className="account-user-name">{displayName}</span>}
			</button>
			{isOpen && (
				<div className="account-dropdown" role="menu">
					{user ? (
						<>
							<div className="account-dropdown-greeting">{t('Hello,')} <strong>{displayName}</strong></div>
							<div className="account-dropdown-links">
								<Link href="/account" role="menuitem" onClick={closeMenu}>{t('Account information')}</Link>
								<Link href="/account/orders" role="menuitem" onClick={closeMenu}>{t('My orders')}</Link>
								<Link href="/account/addresses" role="menuitem" onClick={closeMenu}>{t('Shipping addresses')}</Link>
								<Link href="/account/password" role="menuitem" onClick={closeMenu}>{t('Change password')}</Link>
							</div>
							<button className="account-logout" type="button" role="menuitem" onClick={() => { onLogout?.(); closeMenu(); }}>{t('Log out')}</button>
						</>
					) : (
						<>
							<div className="account-dropdown-greeting">{t('Welcome')}</div>
							<div className="account-dropdown-links">
								<Link href="/login" role="menuitem" onClick={closeMenu}>{t('Log in')}</Link>
								<Link href="/register" role="menuitem" onClick={closeMenu}>{t('Create account')}</Link>
								<Link href="/forgot-password" role="menuitem" onClick={closeMenu}>{t('Forgot password?')}</Link>
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default AccountMenu;