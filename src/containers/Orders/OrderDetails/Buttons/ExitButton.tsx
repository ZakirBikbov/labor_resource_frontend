import { deleteOrder } from "@/app/order.slice";
import { useAppDispatch } from "@/app/store";
import { CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { orderDetailsButton } from "../OrderDetailsStyle.config";




interface ExitButtonProps {
    response: { id: number };
}


const ExitButton: React.FC<ExitButtonProps> = ({ response }) => {
    const dispatch = useAppDispatch();
    const handleDeleteOrder = (orderId: number) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите уволиться с заказа?',
            icon: <ExclamationCircleOutlined />,
            content: 'Уйти с заказа можно только более чем за час до начала.',
            onOk: () => dispatch(deleteOrder({ orderId })),
            onCancel() {
                console.log('Отмена');
            },
        });
    };
    const red = '#D53032'
    return (
        <>
            <Button
                className='modalResponseListAcceptBtn'
                style={{ ...orderDetailsButton, backgroundColor: red }}
                type={'primary'}
                icon={<CheckOutlined />}
                onClick={() => {
                    console.log(`responseId.id`, response);
                    handleDeleteOrder(response.id);
                }}
            >
                Уволиться с заказа
            </Button>
        </>
    );
};

export default ExitButton;