import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { getOrder } from '@/app/order.slice.ts';
import { Flex, Typography } from 'antd';
import { ModalOrderDetails } from '@/components/UI/Modal/ModalOrderDetails.tsx';

import { ModalOrderPerformers } from '@/components/UI/Modal/ModalOrderPerformers/ModalOrderPerformers';
import { EOrderStatus } from '@/enum/order.enum';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { CountUpComponent, CountdownComponent } from './Timers/Timers';
import ExitButton from './Buttons/ExitButton';
import NonPerformerButton from './Buttons/NonPerformerButton';
import { orderDetailsRow, ordersContainerFlexWrapStyle } from './OrderDetailsStyle.config';
import { ERole } from '@/enum/role.enum';

export const OrderDetails = () => {
    const { sideBarLeftPosition } = useAppSelector(state => state.app);
    const { orderDetails, performerAdded, modalOrderPerformers } = useAppSelector(state => state.order);
    const { user } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const screens = useBreakpoint();
    const orderStartTime = useMemo(() => {
        return orderDetails.details ? new Date(orderDetails.details.orderData).getTime() : Date.now();
    }, [orderDetails.details]);
    const deadline = useMemo(() => {
        return orderStartTime;
    }, [orderStartTime]);

    const responseId = useMemo(() => orderDetails.details?.responses.find(response => response.performerId === user?.id), [orderDetails.details, user?.id]);

    useEffect(() => {
        if (id) {
            dispatch(getOrder(id));
        }
    }, [id, performerAdded, modalOrderPerformers, dispatch]);

    const checkStatusOrder = useCallback((status: EOrderStatus) => {
        return orderDetails.details?.status === status;
    }, [orderDetails.details]);


    const shouldShowButton = useCallback(() => {
        if (!orderDetails.details) {
            return false;
        }
        const currentTime = Date.now();
        return (orderStartTime - currentTime) > 3600000 && checkStatusOrder(EOrderStatus.SEARCHING);
    }, [orderStartTime, checkStatusOrder, orderDetails.details]);



    return (
        <Flex gap='middle' vertical style={{ ...ordersContainerFlexWrapStyle, width: screens.lg ? `calc(100% - ${sideBarLeftPosition}px - 330px)` : '100%' }}>
            {orderDetails.details ? <>
                <Flex style={orderDetailsRow}>
                    <Typography.Title level={5}>Адрес:&nbsp;</Typography.Title>
                    <Typography>{orderDetails.details.address}</Typography>
                </Flex>
                <Flex style={{
                    ...orderDetailsRow,
                    flexDirection: 'column',
                    paddingBottom: '10px'
                }}>
                    <Typography.Title level={5}>
                        Описание работы:&nbsp;
                    </Typography.Title>
                    <Typography>
                        {orderDetails.details.description || 'Отсутствует'}
                    </Typography>
                </Flex>
                <Flex style={orderDetailsRow}>
                    <Typography.Title level={5}>
                        Количество часов:&nbsp;
                    </Typography.Title>
                    <Typography>
                        {orderDetails.details.timeWorked || 'Неизвестно'}
                    </Typography>
                </Flex>
                <Flex style={orderDetailsRow}>
                    <Typography.Title level={5}>
                        Заказчик:&nbsp;
                    </Typography.Title>
                    <Typography>
                        {orderDetails.details.customer && orderDetails.details.customer.displayName || 'Неизвестно'}
                    </Typography>
                </Flex>
                <Flex style={orderDetailsRow}>
                    <Typography.Title level={5}>
                        Менеджер:&nbsp;
                    </Typography.Title>
                    <Typography>
                        {orderDetails.details.manager && orderDetails.details.manager.displayName || 'Неизвестно'}
                    </Typography>
                </Flex>
            </> : ''}

            {user && (checkStatusOrder(EOrderStatus.SEARCHING) || checkStatusOrder(EOrderStatus.WAITING) || checkStatusOrder(EOrderStatus.ON_MANAGER)) && <CountdownComponent deadline={deadline} orderDetails={orderDetails} />}
            {user && responseId && <CountUpComponent responseId={responseId} />}
            <a href={`tel:+7${orderDetails.details && (user && user.role === ERole.manager ?
                orderDetails.details.customer?.phone : orderDetails.details.manager?.phone)}`}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '75px',
                    height: '82px',
                    color: '#22C67F',
                    borderRadius: '50%',
                    boxShadow: '0 3px 5px 0 rgba(0, 0, 0, 0.25)'
                }}>
                <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.1446 21.475L23.4803 22.1975C23.4803 22.1975 21.9016 23.9152 17.5922 19.2269C13.2828 14.5387 14.8616 12.8212 14.8616 12.8212L15.2798 12.3661C16.3103 11.2452 16.4074 9.44544 15.5084 8.13158L13.6695 5.44397C12.5568 3.81782 10.4068 3.603 9.13144 4.99043L6.84244 7.48065C6.21008 8.1686 5.78632 9.06039 5.83771 10.0497C5.96918 12.5806 7.01578 18.0262 12.8559 24.3796C19.0491 31.1172 24.8601 31.3849 27.2364 31.1425C27.9881 31.066 28.6417 30.6471 29.1684 30.074L31.2401 27.8204C32.6385 26.299 32.2442 23.6908 30.455 22.6267L27.6688 20.9696C26.494 20.2708 25.0628 20.476 24.1446 21.475Z" fill="#22C67F" />
                </svg>
            </a>
            <Typography.Title level={5}>Позвонить {orderDetails.details && (user && user.role === ERole.manager ?
                'клиенту' : 'менеджеру')}</Typography.Title>
            {user && shouldShowButton() && checkStatusOrder(EOrderStatus.SEARCHING) && responseId && <ExitButton response={{
                id: responseId.id
            }} />}

            {user && <NonPerformerButton deadline={deadline} idParams={id} />}
            {user && checkStatusOrder(EOrderStatus.CANCELED)}

            <ModalOrderPerformers />
            <ModalOrderDetails />
        </Flex>
    );
};
export default OrderDetails
