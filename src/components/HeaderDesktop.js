"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import CartHeaderLink from "./CartHeaderLink";
import AccountMenu from "./AccountMenu";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";

const UserIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20c.7-3.2 3-5 6.5-5s5.8 1.8 6.5 5" />
    </svg>
);

const CartIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3.5 4h2l1.8 10.2a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 1.9-1.5L20.5 8H6.2" />
        <circle cx="9.5" cy="19" r="1.2" />
        <circle cx="17" cy="19" r="1.2" />
    </svg>
);

const HeaderDesktop = ({ searchQuery = "" }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const closeMenuOnDesktop = () => {
            if (window.innerWidth > 760) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", closeMenuOnDesktop);
        return () => window.removeEventListener("resize", closeMenuOnDesktop);
    }, []);

    return (
        <header className="header-desktop">
            <div className="container">
                <div className="header-meta">
                    <span>{t("Welcome to your marketplace")}</span>
                    <Link href="/search">{t("Discover today's deals")}</Link>
                </div>
                <div className="header-row">
                    <Link className="logo" href="/" aria-label="Market home">
                        <span className="logo-word" aria-label="Market">
                            <span>m</span>arket
                        </span>
                    </Link>
                    <button
                        className="header__mobile-menu-btn"
                        type="button"
                        aria-label={t("Open navigation menu")}
                        aria-expanded={isMenuOpen}
                        aria-controls="header-navigation"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <span className="mobile-menu-btn__open">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M4 18H20M4 6H20H4ZM4 12H20H4Z" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </button>
                    <div className="header-search-group">
                        <SearchForm key={searchQuery} initialQuery={searchQuery} />
                        <LanguageSwitcher className="language-switcher--desktop" />
                    </div>
                    <div className="account_and_cart">
                        <AccountMenu>
                            <UserIcon />
                        </AccountMenu>
                        <CartHeaderLink>
                            <CartIcon />
                        </CartHeaderLink>
                    </div>
                </div>
                <DesktopMenu />
                <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            </div>
        </header>
    )
}

export default HeaderDesktop;