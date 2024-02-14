import { ERole } from "@/enum/role.enum";


export interface IModalTitle {
    modalTitle: string;
}

export const getTitleByRole = (role: ERole): IModalTitle => {
    switch (role) {
        case ERole.customer:
            return {
                modalTitle: 'Поиск заказчиков',
            };
        case ERole.performer:
            return {
                modalTitle: 'Поиск исполнителей',
            };
        default:
            return {
                modalTitle: 'Поиск',
            };
    }
};