import { IOrder } from '@/interfaces/order.interface.ts';
import { FC } from 'react';
import { Card, Col, Row } from 'antd';
import { NavLink } from 'react-router-dom';
import { formatDate } from '@/config/main.config.ts';
import translateValue, { orderStatusDictionary } from '@/helpers/translate.helper';
export const Order: FC<IOrder> = ({
    orderData,
    address,
    id,
    status,
    responsesCount,
    performersQuantity,
}) => {
    const displayStatus = status ? translateValue(status, orderStatusDictionary) : 'Статус не задан';
    const calculateTimeLeft = (): string => {
        const startDate = new Date(orderData); 
        const now = new Date();
        const timeLeftMilliseconds = startDate.getTime() - now.getTime();

        if (timeLeftMilliseconds < 0) {
            return '';
        }

        const seconds = Math.floor(timeLeftMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const remainingHours = hours;
        const remainingMinutes = minutes % 60;

        return `До начала : ${remainingHours} ч. ${remainingMinutes} мин.`;
    };
    const timeLeft = calculateTimeLeft();

    return (
        <NavLink to={`/order/details/${id}`}>
            <Card title={`${formatDate(orderData)}`} style={{ width: '100%' }}>
                <Row>
                    <Col span={18}>
                        <p>Адрес: {address}</p>
                        <p>Статус: {displayStatus}</p>
                        <p>{timeLeft}</p> 
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <p>{`${responsesCount}/${performersQuantity}`}</p>
                    </Col>
                </Row>
            </Card>
        </NavLink>
    );
};
