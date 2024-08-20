function formatPrice(num = '') {
    if (num >= 1000000) {
        return (
            Math.floor(num / 1000000) +
            '.' +
            num.toString().slice(-6, -3).padStart(3, '0') +
            '.' +
            num.toString().slice(-3).padStart(3, '0') +
            '₫'
        );
    } else if (num >= 1000) {
        return Math.floor(num / 1000) + '.' + num.toString().slice(-3).padStart(3, '0') + '₫';
    } else {
        return num.toString() + '₫';
    }
}

function convertPriceToNumber(priceStr) {
    priceStr = priceStr.replace('₫', '');
    const parts = priceStr.split('.');

    if (parts.length === 1) {
        return parseInt(parts[0], 10);
    } else if (parts.length === 2) {
        return parseInt(parts[0], 10) * 1000 + parseInt(parts[1], 10);
    } else if (parts.length === 3) {
        return parseInt(parts[0], 10) * 1000000 + parseInt(parts[1], 10) * 1000 + parseInt(parts[2], 10);
    } else {
        return null;
    }
}

export { formatPrice, convertPriceToNumber };
