import React from 'react';

import { ERole } from '@/enum/role.enum';
import { EOrderStatus, EResponseStatus } from '@/enum/order.enum';
import { addPerformerToOrder, cancelOrder, closeOrder, confirmCompletionForAllForced, notifyArrivalOrder, notifyCompletionOrder, setIsModalOrderPerformers, startOrder } from '@/app/order.slice';
import { useAppDispatch, useAppSelector } from '@/app/store';
import translateValue, { responseStatusDictionary } from '@/helpers/translate.helper';
import { Button, Modal } from 'antd';
import { CheckOutlined, ExclamationCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { orderDetailsButton } from '../OrderDetailsStyle.config';
import { EUserStatus } from '@/enum/user.enum';
interface NonPerformerButtonProps {
    deadline: number;
    idParams: string | undefined
}

const NonPerformerButton: React.FC<NonPerformerButtonProps> = ({
    deadline,
    idParams
}) => {
    const red = '#D53032'
    const green = '#006633'
    const { user } = useAppSelector(state => state.user);
    const { orderDetails } = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    const handleRespondToOrder = () => {
        if (user && idParams) {
            dispatch(addPerformerToOrder({
                orderId: Number(idParams),
                performerId: user.id
            }));
        }
    };

    const handleNotifyArrivalOrder = (orderId: number) => {
        dispatch(notifyArrivalOrder({ orderId }));
    };
    const handleNotifyCompletionOrder = (orderId: number) => {
        dispatch(notifyCompletionOrder({ orderId }));
    };


    const handleStartOrder = (orderId: number) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите начать работу с теми кто пришел?',
            icon: <ExclamationCircleOutlined />,
            content: 'Таймер будет запущен у тех исполнителей кто ожидает подтверждения о приходе.',
            onOk: () => dispatch(startOrder({ orderId })),
            onCancel() {
                console.log('Отмена');
            },
        });
    };

    const handleCloseOrder = (orderId: number) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите закрыть заказ?',
            icon: <ExclamationCircleOutlined />,
            content: 'Заказ будет отмечен как оплаченный.',
            onOk: () => dispatch(closeOrder({ orderId })),
            onCancel() {
                console.log('Отмена');
            },
        });
    };

    const handleCancelOrder = (orderId: number) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите отменить заказ?',
            icon: <ExclamationCircleOutlined />,
            content: 'Заказ возможно отменить только до начала работ.',
            onOk: () => dispatch(cancelOrder({ orderId })),
            onCancel() {
                console.log('Отмена');
            },
        });
    };

    const endOrder = (orderId: number) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите завершить заказ?',
            icon: <ExclamationCircleOutlined />,
            content: 'Заказ будет отменен.',
            onOk: () => dispatch(confirmCompletionForAllForced({ orderId })),
            onCancel() {
                console.log('Отмена');
            },
        });
    };
    const checkUserResponseStatus = (statuses: EResponseStatus[]) => {
        return orderDetails.details?.responses.some(response =>
            response.performerId === user?.id && statuses.includes(response.status)
        );
    };
    const checkUsersStatusInOrder = (status: EResponseStatus) => {
        return orderDetails.details?.responses.some(response =>
            response.status === status
        );
    };
    const checkStatusOrder = (status: EOrderStatus) => {
        return orderDetails.details?.status === status
    };
    const checkUserRole = (role: ERole) => {
        return user?.role === role
    };
    const checkCustomerInOrder = () => {
        return user?.id === orderDetails.details?.customerId
    };

    const shouldShowButton = () => {
        if (!orderDetails.details) {
            return false;
        }
        const currentTime = Date.now();

        return (deadline - currentTime) > 3600000;
    };

    const renderNonPerformerButton = () => {
        if (user?.role === ERole.performer) {
            if (orderDetails.details) {
                const response = orderDetails.details.responses.find(response => response.performerId === user.id);
                const isAlreadyResponded = orderDetails.details.responses.some(response => response.performerId === user.id);

                const performerResponse = orderDetails.details.responses.find(response => response.performerId === user.id);

                const performerStatusInOrder = performerResponse ? translateValue(performerResponse.status, responseStatusDictionary) : 'Статус не найден';


                const idResponse = response?.id;
                return (
                    <>{!isAlreadyResponded && !(user.status === EUserStatus.AWAITING) && (<Button
                        style={orderDetailsButton}
                        type={'primary'}
                        onClick={handleRespondToOrder}
                    >
                        Откликнуться на заказ
                    </Button>)}
                        {isAlreadyResponded && `Статус: ${performerStatusInOrder}`}
                        {

                            checkUserResponseStatus([EResponseStatus.WAITING]) && idResponse && (

                                <Button
                                    style={{ ...orderDetailsButton, backgroundColor: '#52c41a' }}
                                    icon={<CheckOutlined />}
                                    type={'primary'}
                                    onClick={() => handleNotifyArrivalOrder(idResponse)}
                                >
                                    Отправить запрос на прибытие
                                </Button >
                            )
                        }
                        {
                            checkUserResponseStatus([EResponseStatus.IN_PROGRESS]) && idResponse && (
                                <Button
                                    style={{ ...orderDetailsButton, backgroundColor: '#52c41a' }}
                                    icon={<CheckOutlined />}
                                    type={'primary'}
                                    onClick={() => handleNotifyCompletionOrder(idResponse)}
                                >
                                    Отправить запрос на завершение
                                </Button>
                            )
                        }

                    </>)
            }

        }



        return (<>
            <Button
                style={orderDetailsButton}
                type={'primary'}
                onClick={() => {
                    dispatch(setIsModalOrderPerformers());
                }}
            >
                Показать исполнителей
            </Button>

            {
                checkUsersStatusInOrder(EResponseStatus.AWAITING_CONFIRMATION_ARRIVAL) && (checkStatusOrder(EOrderStatus.WAITING) || checkStatusOrder(EOrderStatus.IN_PROGRESS)) && checkUserRole(ERole.manager) && (
                    <Button
                        style={{ ...orderDetailsButton, backgroundColor: '#52c41a' }}
                        icon={<ThunderboltOutlined />}
                        type={'primary'}
                        onClick={() => handleStartOrder(Number(idParams))}
                    >
                        Принудительно начать заказ
                    </Button >
                )
            }
            {
                checkUsersStatusInOrder(EResponseStatus.AWAITING_CONFIRMATION_COMPLETION) && checkStatusOrder(EOrderStatus.IN_PROGRESS) && checkUserRole(ERole.manager) && (
                    <Button
                        style={{ ...orderDetailsButton, backgroundColor: green }}
                        icon={<ThunderboltOutlined />}
                        type={'primary'}
                        onClick={() => handleStartOrder(Number(idParams))}
                    >
                        Принудительно закончить заказ
                    </Button >
                )
            }
            {
                checkUsersStatusInOrder(EResponseStatus.IN_PROGRESS) && checkStatusOrder(EOrderStatus.IN_PROGRESS) && checkUserRole(ERole.manager) && (
                    <Button
                        style={{ ...orderDetailsButton, backgroundColor: green }}
                        type={'primary'}
                        icon={<CheckOutlined />}
                        onClick={() => endOrder(Number(idParams))}
                    >
                        Завершить заказ
                    </Button >
                )
            }
            {
                checkStatusOrder(EOrderStatus.REQUIRES_PAYMENT) && checkUserRole(ERole.manager) && (
                    <Button
                        style={{
                            ...orderDetailsButton, backgroundColor: green
                        }}
                        type={'primary'}
                        icon={<CheckOutlined />}
                        onClick={() => handleCloseOrder(Number(idParams))}
                    >
                        Закрыть заказ
                    </Button >
                )
            }
            {
                shouldShowButton() && !checkStatusOrder(EOrderStatus.CANCELED) && checkCustomerInOrder() && (
                    <Button
                        style={{ ...orderDetailsButton, backgroundColor: red }}
                        type={'primary'}
                        icon={<CheckOutlined />}
                        onClick={() => handleCancelOrder(Number(idParams))}
                    >
                        Отменить заказ
                    </Button >
                )
            }


        </>

        );
    };


    return <>{renderNonPerformerButton()}</>;
};

export default NonPerformerButton;