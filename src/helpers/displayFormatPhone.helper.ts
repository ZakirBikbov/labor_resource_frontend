export const displayFormatPhone = (number: string) => {
    const cleaned = ('' + number).replace(/\D/g, '');

    if (cleaned.length !== 10) {
        throw new Error('String length should be 10 characters.');
    }

    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);


    if (match) {
        return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }

    return number;
}