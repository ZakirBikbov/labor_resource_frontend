import { ConfigProvider, Flex, Modal, Spin, Typography } from 'antd';
import { formatDate } from '@/config/main.config.ts';
import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import { addPerformerToOrder, clearErrorMessage, clearSuccessMessage, setIsModalDetailsClose} from '@/app/order.slice.ts';
import { CloseOutlined } from '@ant-design/icons';
import './modalResponse.scss';
import { useEffect, useState } from 'react';
import { ModalSearchUsers } from '../ModalSearchUsers/ModalSearchUsers';
import { IUser } from '@/interfaces/user.interface';
import { ERole } from '@/enum/role.enum';
import { message } from 'antd';
import AddButton from './AddButton';
import PerformerRow from './ResonseRow';
import { modalOrderContainer, orderDetailsModalStyle } from '@/containers/Orders/OrderDetails/OrderDetailsStyle.config';
export const ModalOrderPerformers = () => {
    const { user } = useAppSelector(state => state.user)
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [selectedPerformers, setSelectedPerformers] = useState<IUser[]>([]);
    const { orderDetails, modalOrderPerformers, loading, errorMessage, successMessage } = useAppSelector(
        (store) => store.order
    );
   const dispatch = useAppDispatch()
    useEffect(() => {
        if (orderDetails.details) {
            setSelectedPerformers(orderDetails.details.responses.map(response => response.performer));
        }
        
    }, [orderDetails.details]);
    
    useEffect(() => {
        if (successMessage) {
            message.success(successMessage);
            dispatch(clearSuccessMessage());
        }
        if (errorMessage) {
            message.error(errorMessage);
            dispatch(clearErrorMessage());
        }
    }, [successMessage, errorMessage, dispatch]);
 
    if (!orderDetails || orderDetails.details === null) {
        return null;
    }

    const selectedPerformerIds = orderDetails.details ? orderDetails.details.responses.map(response => response.performer.id) : [];

    const handleAddPerformer = async (performer: IUser) => {
        if (selectedPerformers.some(p => p.id === performer.id)) {
            console.log('Исполнитель уже добавлен');
            return;
        }
        setSelectedPerformers(currentSelectedPerformers => [...currentSelectedPerformers, performer]);
        if (orderDetails.details) {
            await dispatch(addPerformerToOrder({
                orderId: orderDetails.details.id,
                performerId: performer.id
            }));
        }
        

        setSearchModalOpen(false);
    };
    

    const { responses } = orderDetails.details;
    return (
        <>
            <Spin spinning={loading}>
                <ConfigProvider {...orderDetailsModalStyle}>
                    <Flex className="orderPerformers" style={modalOrderContainer}>
                        <Modal
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{formatDate(orderDetails.details.orderData)}</span>
                                    <AddButton setSearchModalOpen={setSearchModalOpen}></AddButton>
                                </div>
                            }
                            open={modalOrderPerformers}
                            zIndex={100}
                            footer={null}
                            onCancel={() => dispatch(setIsModalDetailsClose())}
                            cancelButtonProps={{ style: { display: 'none' } }}
                            closeIcon={<CloseOutlined />}
                        >
                            {searchModalOpen && (
                                <ModalSearchUsers selectedPerformerIds={new Set(selectedPerformerIds)} onSelect={handleAddPerformer} role={ERole.performer} />
                            )}

                            {responses && responses.length > 0 ? (
                                responses.map(response =>
                                    user?.role ? (
                                        <PerformerRow
                                            key={response.id}
                                            response={response}
                                            role={user.role}
                                            setSelectedPerformers={setSelectedPerformers}
                                        />
                                    ) : null
                                )
                            ) : (
                                <Typography.Text>На данном заказе еще нет исполнителей</Typography.Text>
                            )}
                        </Modal>
                    </Flex>
                </ConfigProvider>
            </Spin>
        </>
    );
};

