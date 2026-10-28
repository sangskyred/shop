export const USD_TO_VND_RATE = 25000;

export const formatCurrency = (amount, language) => {
	const isVietnamese = language === 'vi';
	const value = isVietnamese ? amount * USD_TO_VND_RATE : amount;

	return new Intl.NumberFormat(isVietnamese ? 'vi-VN' : 'en-US', {
		style: 'currency',
		currency: isVietnamese ? 'VND' : 'USD',
	}).format(value);
};
