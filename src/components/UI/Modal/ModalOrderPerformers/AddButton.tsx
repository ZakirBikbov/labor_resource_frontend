
import { Button, Col } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { EOrderStatus, EResponseStatus } from '@/enum/order.enum';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { ERole } from '@/enum/role.enum';
import { confirmArrivalForAll, confirmCompletionForAll, setIsModalSearchOpen } from '@/app/order.slice';

interface AddButtonProps {
    setSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddButton: React.FC<AddButtonProps> = ({
    setSearchModalOpen
}) => {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.user)
    const { orderDetails } = useAppSelector(
        (store) => store.order
    );
    const checkUsersStatusInOrder = (status: EResponseStatus) => {
        return orderDetails.details?.responses.some(response =>
            response.status === status
        );
    };
    const handleConfirmCompletionForAll = (orderId: number) => {
        dispatch(confirmCompletionForAll({ orderId }));
    };
    const handleNotifyArrivalOrderForAll = (orderId: number) => {
        dispatch(confirmArrivalForAll({ orderId }));
    };
    const checkStatusOrder = (status: EOrderStatus) => {
        return orderDetails.details?.status === status
    };
    const openSearchModal = () => {
        setSearchModalOpen(true);
        dispatch(setIsModalSearchOpen());
    };
    const buttonStyle = {
        marginLeft: 'auto',
        marginRight: '30px',
        marginTop: '-8px',
        border: 'none',
        boxShadow: 'none'
    };

    if (user?.role === ERole.manager) {
        return (<>
            {checkUsersStatusInOrder(EResponseStatus.AWAITING_CONFIRMATION_ARRIVAL) && (
                <Col>
                    <Button
                        className='modalResponseListAcceptBtn'
                        icon={<CheckOutlined />}
                        onClick={() => {
                            if (orderDetails.details?.id) {
                                handleNotifyArrivalOrderForAll(orderDetails.details.id);
                            } else {
                                console.error('Order ID is not available.');
                            }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}

                    />
                </Col>
            )
            }
            {checkUsersStatusInOrder(EResponseStatus.AWAITING_CONFIRMATION_COMPLETION) && (
                <Col>
                    <Button
                        className='modalResponseListAcceptBtn'
                        icon={<CheckOutlined />}

                        onClick={() => {
                            if (orderDetails.details?.id) {
                                handleConfirmCompletionForAll(orderDetails.details.id);
                            } else {
                                console.error('Order ID is not available.');
                            }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                    />
                </Col>
            )
            }
            {checkStatusOrder(EOrderStatus.SEARCHING) && (

                <Button
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={openSearchModal}
                    style={{ ...buttonStyle, backgroundColor: 'transparent' }}
                />
            )
            }

        </>
        );
    } else if (user?.role === ERole.customer && checkUsersStatusInOrder(EResponseStatus.AWAITING_CONFIRMATION_COMPLETION)) {

        return (
            <>
                {checkUsersStatusInOrder(EResponseStatus.AWAITING_CONFIRMATION_ARRIVAL) && (
                    <Col>
                        <Button
                            className='modalResponseListAcceptBtn'
                            icon={<CheckOutlined />}
                            onClick={() => {
                                if (orderDetails.details?.id) {
                                    handleNotifyArrivalOrderForAll(orderDetails.details.id);
                                } else {
                                    console.error('Order ID is not available.');
                                }
                            }}
                            style={{ ...buttonStyle, backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}

                        />
                    </Col>
                )
                }
                {checkUsersStatusInOrder(EResponseStatus.AWAITING_CONFIRMATION_COMPLETION) && (
                    <Col>
                        <Button
                            className='modalResponseListAcceptBtn'
                            icon={<CheckOutlined />}
                            onClick={() => {
                                if (orderDetails.details?.id) {
                                    handleConfirmCompletionForAll(orderDetails.details.id);
                                } else {
                                    console.error('Order ID is not available.');
                                }
                            }}
                            style={{ ...buttonStyle, backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                        />
                    </Col>
                )
                }
            </>
        );
    }

    return null;
};

export default AddButton;