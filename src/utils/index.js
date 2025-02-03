export function shortenString(str, maxLength) {
    if (typeof str !== 'string') {
        throw new TypeError('Input must be a string');
    }
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength - 3) + '...';
}
