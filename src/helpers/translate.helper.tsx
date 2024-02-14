import { EOrderStatus, EResponseStatus } from "@/enum/order.enum";
import { ERole } from "@/enum/role.enum";
import { ESearchFields, EUserStatus, EUserSubject } from "@/enum/user.enum";

const translateValue = <T extends string | number,>(value: T, dictionary: { [key in T]?: string }): string => {
    return dictionary[value] || value.toString();
};

export const statusDictionary: { [key in EUserStatus]?: string } = {
    [EUserStatus.ACTIVE]: 'Активен',
    [EUserStatus.BLOCKED]: 'Заблокирован',
    [EUserStatus.DISABLED]: 'Отключен',
    [EUserStatus.AWAITING]: 'Не активирован'
};

export const roleDictionary: { [key in ERole]?: string } = {
    [ERole.admin]: 'Администратор',
    [ERole.manager]: 'Менеджер',
    [ERole.customer]: 'Клиент',
    [ERole.performer]: 'Исполнитель',

};

export const searchFieldsDictionary: { [key in ESearchFields]?: string } = {
    [ESearchFields.DisplayName]: 'Имя',
    [ESearchFields.Email]: 'Электронная почта',
    [ESearchFields.Phone]: 'Телефон',
    [ESearchFields.IdentifyingNumber]: 'Паспорт',

};

export const subjectDictionary: { [key in EUserSubject]?: string } = {
    [EUserSubject.INDIVIDUAL]: 'ИП',
    [EUserSubject.LEGAL]: 'Юр. лицо',
};
export const orderStatusDictionary: { [key in EOrderStatus]?: string } = {
    [EOrderStatus.SEARCHING]: 'Поиск исполнителя',
    [EOrderStatus.ON_MANAGER]: 'На рассмотрении менеджера',
    [EOrderStatus.WAITING]: 'Ожидание',
    [EOrderStatus.IN_PROGRESS]: 'В процессе',
    [EOrderStatus.CANCELED]: 'Отменён',
    [EOrderStatus.REQUIRES_PAYMENT]: 'Требует оплаты',
    [EOrderStatus.DONE]: 'Выполнен',
};

export const responseStatusDictionary: { [key in EResponseStatus]?: string } = {
    [EResponseStatus.WAITING]: 'Ожидание',
    [EResponseStatus.IN_PATH]: 'В пути',
    [EResponseStatus.AWAITING_CONFIRMATION_ARRIVAL]: 'Ожидает подтверждения прибытия',
    [EResponseStatus.IN_PROGRESS]: 'В процессе',
    [EResponseStatus.AWAITING_CONFIRMATION_COMPLETION]: 'Ожидает подтверждения выполнения',
    [EResponseStatus.BANNED]: 'Забанен',
    [EResponseStatus.DONE]: 'Выполнен',
};

export default translateValue
