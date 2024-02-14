import {  Modal} from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import {
	setIsModalSearchClose,
} from '@/app/order.slice.ts';
import './ModalSearchUsers.scss';
import { IUser } from '@/interfaces/user.interface';
import { ERole } from '@/enum/role.enum';
import { getTitleByRole } from './getTitleByRole';
import { useSearchHandler } from './useSeatchHandler';
import { SearchInput } from './SearchInput';
import { UserList } from './UserList';

interface ModalSearchUsersProps {
    onSelect: (customer: IUser) => void;
    selectedPerformerIds?: Set<number>;
    role: ERole;
}

export const ModalSearchUsers: React.FC<ModalSearchUsersProps> = ({
    onSelect,
    role,
    selectedPerformerIds
}) => {
    const dispatch = useAppDispatch();
    const { modalTitle } = getTitleByRole(role);
    const { modalSearchOrder } = useAppSelector((store) => store.order);
    const {
        stateInput,
        setStateInput,
        filterOrder,
        lastCustomerElementRef
    } = useSearchHandler(role);

    const handleCancel = () => {
        dispatch(setIsModalSearchClose());
    };

    return (
        <Modal
            zIndex={101}
            open={modalSearchOrder}
            footer={null}
            title={modalTitle}
            width={'100%'}
            onCancel={handleCancel}
        >
            <SearchInput stateInput={stateInput} setStateInput={setStateInput} />
            <UserList
                users={filterOrder.listCustomer.users} 
                onSelect={(user) => onSelect(user as IUser)} 
                selectedPerformerIds={selectedPerformerIds}
                lastCustomerElementRef={lastCustomerElementRef}
            />
        </Modal>
    );
};
