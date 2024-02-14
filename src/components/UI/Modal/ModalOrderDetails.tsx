import { ConfigProvider, Flex, Modal, Typography } from 'antd';

import { formatDate } from '@/config/main.config.ts';
import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import { setIsModalDetailsClose } from '@/app/order.slice.ts';
import { modalOrderContainer, orderDetailsModalStyle } from '@/containers/Orders/OrderDetails/OrderDetailsStyle.config';

export const ModalOrderDetails = () => {
	const { orderDetails, modalOrderDetails } = useAppSelector(
		(store) => store.order
	);
	const dispatch = useAppDispatch();
	if (!orderDetails || orderDetails.details === null) {
		return null;
	}

	const { address, description, timeWorked, tax, customer, manager } =
		orderDetails.details;
	return (
		<>
			<ConfigProvider {...orderDetailsModalStyle}>
				<Flex className="orderDetails" style={modalOrderContainer}>
					<Modal
						title={formatDate(orderDetails.details.orderData)}
						open={modalOrderDetails}
						footer={null}
						onCancel={() => dispatch(setIsModalDetailsClose())}
						cancelButtonProps={{ style: { display: 'none' } }}
					>
						<Flex>
							<Typography.Title level={5}>Куда:</Typography.Title>
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
					</Modal>
				</Flex>
			</ConfigProvider>
		</>
	);
};
