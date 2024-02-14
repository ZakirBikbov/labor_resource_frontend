import { blockOrder, confirmArrival, confirmCompletion, deleteOrder } from "@/app/order.slice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { EOrderStatus, EResponseStatus } from "@/enum/order.enum";
import { ERole } from "@/enum/role.enum";
import { IResponse } from "@/interfaces/response.interface";
import { IUser } from "@/interfaces/user.interface";
import { CheckOutlined, DeleteOutlined, ExclamationCircleOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Col, Modal } from "antd";

interface RoleButtonsProps {
    role?: ERole;
    response: IResponse;
    setSelectedPerformers: React.Dispatch<React.SetStateAction<IUser[]>>;
}
const RoleButtons: React.FC<RoleButtonsProps> = ({
    role,
    response,
    setSelectedPerformers
}) => {
    

    const { orderDetails } = useAppSelector(state => state.order);
    const dispatch = useAppDispatch()
    const handleСonfirmArrival = (orderId: number) => {
        dispatch(confirmArrival({ orderId }));
    };
    const handleСonfirmCompletion = (orderId: number) => {
        dispatch(confirmCompletion({ orderId }));
    };

    const handleBlockOrder = (orderId: number) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите заблокировать этого исполнителя?',
            icon: <ExclamationCircleOutlined />,
            content: 'Данный исполнитель не сможет принять этот заказ.',
            onOk: () => dispatch(blockOrder({ orderId })),
            onCancel() {
                console.log('Отмена');
            },
        });
       
    };
    const handleDeleteOrder =  (orderId: number, performerId: number) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите удалить этого исполнителя?',
            icon: <ExclamationCircleOutlined />,
            content: 'Этот исполнитель будет удалён с заказа.',
            onOk: () => {
                dispatch(deleteOrder({ orderId }));
                setSelectedPerformers(prevPerformers => prevPerformers.filter(p => p.id !== performerId));
},
            onCancel() {
                console.log('Отмена');
            },
        });
    };
  
    const checkStatusOrder = (status: EOrderStatus) => {
        return orderDetails.details?.status === status
    };
    
    switch (role) {
        case ERole.manager || ERole.admin:
            return (
                <>
                    {response.status === EResponseStatus.AWAITING_CONFIRMATION_ARRIVAL && (
                        <Col>
                            <Button
                                className='modalResponseListAcceptBtn'
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                icon={<CheckOutlined />}
                                onClick={() => handleСonfirmArrival(response.id)}
                            />
                        </Col>
                    )}
                    {response.status === EResponseStatus.AWAITING_CONFIRMATION_COMPLETION && (
                        <Col>
                            <Button
                                className='modalResponseListAcceptBtn'
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                icon={<CheckOutlined />}
                                onClick={() => handleСonfirmCompletion(response.id)}
                            />
                        </Col>
                    )}
                    {response.status !== EResponseStatus.BANNED && (
                        <Col>
                            <Button
                                className='modalResponseListDeclineBtn'
                                style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: '#fff' }}
                                icon={<StopOutlined />}
                                onClick={() => handleBlockOrder(response.id)}
                            />
                        </Col>
                    )}
                    {(checkStatusOrder(EOrderStatus.SEARCHING) || checkStatusOrder(EOrderStatus.WAITING) || checkStatusOrder(EOrderStatus.ON_MANAGER)) && (
                    <Col>
                        <Button
                            className='modalResponseListDeleteBtn'
                            style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteOrder(response.id, response.performer.id)}
                        />
                    </Col>
                    )}
                </>
            );

        case ERole.customer:
            return (<>
                {response.status === EResponseStatus.AWAITING_CONFIRMATION_ARRIVAL && (
                    <Col>
                        <Button
                            className='modalResponseListAcceptBtn'
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                            icon={<CheckOutlined />}
                            onClick={() => handleСonfirmArrival(response.id)}
                        />
                    </Col>
                )}
                {response.status === EResponseStatus.AWAITING_CONFIRMATION_COMPLETION && (
                    <Col>
                        <Button
                            className='modalResponseListAcceptBtn'
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                            icon={<CheckOutlined />}
                            onClick={() => handleСonfirmCompletion(response.id)}
                        />
                    </Col>
                )}

            </>
            );

        default:

            return null;
    }
};

export default RoleButtons;