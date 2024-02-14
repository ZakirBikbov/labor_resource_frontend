export const formatDate = (originalDate: string) => {
	const months = [
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря',
	];

	const date = new Date(originalDate);
	const day = date.getDate().toString().padStart(2, '0');
	const monthIndex = date.getMonth();
	const month = months[monthIndex];
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${day} ${month}, ${year} в ${hours}:${minutes}`;
};
