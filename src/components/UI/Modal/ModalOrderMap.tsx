import { Button, ConfigProvider, Flex, Modal, Typography } from 'antd';
import {
	modalOrderContainer,
	orderDetailsModalStyle,
} from '@/containers/Orders/OrderDetails/OrderDetailsStyle.config.ts';
import { formatDate } from '@/config/main.config.ts';
import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import { setIsModalOrderMap } from '@/app/order.slice.ts';
import FormItem from 'antd/es/form/FormItem';
import { useNavigate } from 'react-router-dom';
import { ERole } from '@/enum/role.enum';

export const ModalOrderMap = () => {
	const { user } = useAppSelector(
		store => store.user
	);
	const { orderDetails, modalOrderMap } = useAppSelector(
		store => store.order
	);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	if (!orderDetails || orderDetails.details === null) {
		return null;
	}

	const { id, address, description, timeWorked, tax, customer, manager } =
		orderDetails.details;

	const goToOrderPage = () => {
		dispatch(setIsModalOrderMap(false));
		navigate(`/order/details/${id}`);
	}

	return (
		<>
			<ConfigProvider {...orderDetailsModalStyle}>
				<Flex className="orderDetails" style={modalOrderContainer}>
					<Modal
						title={formatDate(orderDetails.details.orderData)}
						open={modalOrderMap}
						footer={null}
						onCancel={() => dispatch(setIsModalOrderMap(false))}
						cancelButtonProps={{ style: { display: 'none' } }}
					>
						<Flex>
							<Typography.Title level={5}>Адрес:</Typography.Title>
							<Typography>{address}</Typography>
						</Flex>
						<Flex>
							<Typography.Title level={5}>
								Описание работы:
							</Typography.Title>
							<Typography>
								{description || 'Описания нет'}
							</Typography>
						</Flex>
						{user && user.role === ERole.manager && <>

							<Flex>
								<Typography.Title level={5}>
									Количество часов
								</Typography.Title>
								<Typography>
									{timeWorked || 'Неизвестно'}
								</Typography>
							</Flex>
							<Flex>
								<Typography.Title level={5}>
									Стоимость часа
								</Typography.Title>
								<Typography>{tax || 'Неизвестно'}</Typography>
							</Flex>
							<Flex>
								<Typography.Title level={5}>
									Заказчик
								</Typography.Title>
								<Typography>
									{customer?.displayName || 'Неизвестно'}
								</Typography>
							</Flex>
							<Flex>
								<Typography.Title level={5}>
									Менеджер
								</Typography.Title>
								<Typography>
									{manager?.displayName || 'Неизвестно'}
								</Typography>
							</Flex>
						</>}
						<FormItem>
							<Button
								type="primary"
								htmlType="submit"
								style={{ width: '100%' }}
								onClick={() => goToOrderPage()}
							>
								Перейти к заказу
							</Button>
						</FormItem>
					</Modal>
				</Flex>
			</ConfigProvider>
		</>
	);
};
