'use client';

import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

const LanguageSwitcher = ({ className = '' }) => {
	const { language, setLanguage, t } = useLanguage();

	return (
		<label className={`language-switcher ${className}`.trim()}>
			<Image
				className="icp-nav-flag"
				src={language === 'en' ? '/flags/gb.svg' : '/flags/vn.svg'}
				alt=""
				aria-hidden="true"
				width={60}
				height={40}
				loading="eager"
			/>
			<span className="sr-only">{t('Language')}</span>
			<select
				value={language}
				onChange={(event) => setLanguage(event.target.value)}
				aria-label={t('Language')}
			>
				<option value="en">EN</option>
				<option value="vi">VI</option>
			</select>
		</label>
	);
};

export default LanguageSwitcher;
