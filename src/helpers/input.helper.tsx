export const formatPhoneNumber = (valueInput: string) => {
	const prefixNumber = '7 (';

	const value = valueInput.replace(/\D+/g, '');
	const numberLength = 11;

	let result = '+';

	for (let i = 0; i < value.length && i < numberLength; i++) {
		switch (i) {
			case 0:
				result += prefixNumber;
				continue;
			case 4:
				result += ') ';
				break;
			case 7:
				result += '-';
				break;
			case 9:
				result += '-';
				break;
			default:
				break;
		}
		result += value[i];
	}

	return result;
};
