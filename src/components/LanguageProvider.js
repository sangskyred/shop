'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from '../lib/translations';

const LANGUAGE_STORAGE_KEY = 'store-language';
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
	const [language, setLanguage] = useState('vi');
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			try {
				const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
				if (savedLanguage === 'en' || savedLanguage === 'vi') {
					setLanguage(savedLanguage);
				}
			} catch {
				// Keep English when browser storage is unavailable.
			}
			setIsReady(true);
		}, 0);
		return () => window.clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		document.documentElement.lang = language;
		if (!isReady) {
			return;
		}

		try {
			window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
		} catch {
			// The selected language remains available for the current page.
		}
	}, [language, isReady]);

	const value = useMemo(() => ({
		language,
		setLanguage,
		t: (text) => translate(text, language),
	}), [language]);

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};
