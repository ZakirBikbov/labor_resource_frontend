export const getCurrentDate = (isoDate?: string): string => {
    let currentDate: Date;

    if (isoDate) {
        currentDate = new Date(isoDate);
    } else {
        currentDate = new Date();
    }

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return isoDate ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` : `${year}-${month}-${day}_${hours}-${minutes}`;
}