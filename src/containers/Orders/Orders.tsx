import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import {
	getFilterOrders,
	getPageData,
	getUserList,
	setIsModalFilterOpen,
} from '@/app/order.slice.ts';
import { Order } from '@/components/Order/Order.tsx';
import { Button, Col, Flex, Row, Space, Spin, Typography } from 'antd';
import { ModalOrderFilter } from '@/components/UI/Modal/ModalOrderFilter.tsx';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useParams } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';

import useInfiniteScroll from '@/components/UI/scrolling/useInfiniteScroll';
import { ordersContainerFlexStyle, ordersContainerFlexWrapStyle, ordersModalFilterButtonStyle, ordersRowStyle } from './OrderDetails/OrderDetailsStyle.config';
import { useEffect } from 'react';
import { ERole } from '@/enum/role.enum';

export const Orders = ({ onlyMyOrders = false }) => {
	const dispatch = useAppDispatch();
	const screens = useBreakpoint();
	const params = useParams();
	const idParams: string | undefined = params.filter;
	const { sideBarLeftPosition } = useAppSelector((store) => store.app);
	const { orderData, loading } = useAppSelector((store) => store.order);
	const { user } = useAppSelector(store => store.user);
	useEffect(() => {
		if (user && onlyMyOrders && user.role === ERole.performer) {
			dispatch(getFilterOrders(`performer=${user.id}`));
		}
	}, [onlyMyOrders, user])

	const loadMoreOrders = () => {
		if (orderData.links.next && !loading) {
			dispatch(getPageData(orderData.links.next));
		}
	};

	useInfiniteScroll(loadMoreOrders, loading);

	const showModal = async () => {
		await dispatch(getUserList({ role: 'manager' }));
		await dispatch(
			getUserList({
				role: 'customer',
				nextPage: `/user?role=customer&offset=0&limit=100`,
			})
		);
		dispatch(setIsModalFilterOpen());
	};


	return (
		<>
			{!idParams && <ModalOrderFilter />}
			<Flex style={{ ...ordersContainerFlexWrapStyle, position: 'fixed', width: screens.lg ? `calc(100% - ${330 + sideBarLeftPosition}px)` : '100%' }}>
				{!idParams && (
					<>
						<Typography.Title level={4}>Фильтры</Typography.Title>
						<Button
							onClick={showModal}
							style={ordersModalFilterButtonStyle}
							icon={<FilterOutlined />}
						/>
					</>
				)}
			</Flex >
			<Space direction="vertical" size="middle">
				<Flex style={ordersContainerFlexStyle}>
					<Flex
						vertical
						justify="center"
						align="center"
						gap="20px"
						style={{ width: '100%' }}
					>
						{orderData && orderData.orders && orderData.orders.length > 0 ? (
							<>
								{screens.lg ? (
									<Row gutter={[16, 16]} style={ordersRowStyle}>
										{orderData.orders.map((item, index) => (
											<Col span={12} key={index}>
												<Order {...item} />
											</Col>
										))}
									</Row>
								) : (
									<Row gutter={[8, 8]} style={ordersRowStyle}>
										{orderData.orders.map((item, index) => (
											<Col span={24} key={index}>
												<Order {...item} />
											</Col>
										))}
									</Row>
								)}
							</>
						) : (
							<Typography.Title level={3}>
								Нет доступных заказов...
							</Typography.Title>
						)}
					</Flex>
					{
						loading ?
							<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
								<Spin />
							</div>
							: orderData.orders.length !== 0 ?
								<Flex style={ordersContainerFlexStyle}>
									{''}
								</Flex>
								: <div>
									У заказчика нет заказов.
								</div>
					}
				</Flex>
				<div id="infinite-scroll-sentinel" />
			</Space>
		</>
	);

};
export default Orders