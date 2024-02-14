import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Navbar } from '@/components/Navbar/Navbar';
import CreateOrderForm from '../OrderCreate/CreateOrderForm';
import ServiceSelection from '../OrderCreate/ServiceSelection';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { YMaps } from 'react-yandex-maps';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import AddressMap from '../AdressMap/AdressMap';
import { getFilterOrders, getOrders } from '@/app/order.slice';
import { ERole } from '@/enum/role.enum';
import { useParams } from 'react-router-dom';
import { showSideBar } from '@/app/app.slice';
import { useEffect } from 'react';
declare global {
	interface Window {
		ymaps: any;
	}
}

export type ServiceType = 'loader' | 'transport' | null;

export const CustomLayout = () => {
	const dispatch = useAppDispatch();
	const params = useParams();
	const idParams: string | undefined = params.filter;
	const { sideBarLeftPosition } = useAppSelector(store => store.app)
	const location = useLocation();
	const screens = useBreakpoint();
	const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(null);
	const { user } = useAppSelector(store => store.user);
	useEffect(() => {
		if (location.pathname === "/" || location.pathname === "/order") {
			if (user) {
				if (user.role === ERole.customer) {
					dispatch(getFilterOrders(`customer=${user.id}`));
				} else if (user.role === ERole.performer) {
					dispatch(getFilterOrders('status=SEARCHING'));
				} else if (user.role === ERole.manager || user.role === ERole.admin) {
					if (!idParams) dispatch(getOrders());
					else if (idParams === 'in_progress' || idParams === 'done') {
						dispatch(getFilterOrders(`status=${idParams.toUpperCase()}`));
					}
				}
			}
		}
		dispatch(showSideBar(-330));
	}, [user, idParams, location.pathname]);
	const handleServiceSelect = (serviceType: ServiceType) => {
		setSelectedServiceType(serviceType);
	};

	const handleBack = () => {
		setSelectedServiceType(null);
	};

	return (
		<Layout style={{ height: '100vh' }}>
			<Sidebar />
			<Navbar />
			<Layout>
				<div style={{ position: 'relative' }}>
					<YMaps query={{
						apikey: "9ffda89e-931d-4be4-91bc-dfd4b4f0aaae",
						lang: "ru_RU",
						load: "Map,Placemark,geocode,geolocation"
					}}>
						{location.pathname === '/' && (
							<AddressMap />

						)}
					</YMaps>
					<div style={{
						marginTop: location.pathname === '/' ? 0 : '94px',
						display: 'flex',
						marginLeft: screens.lg ? `${330 + sideBarLeftPosition}px` : 0
					}}>
						<Outlet />
					</div>
					{location.pathname === '/' && !selectedServiceType && (
						<ServiceSelection onSelectService={handleServiceSelect} />
					)}
					{location.pathname === '/' && selectedServiceType && !(user?.role === ERole.performer) && (
						<div key={selectedServiceType}>
							<CreateOrderForm serviceType={selectedServiceType} onBack={handleBack} />
						</div>
					)}
				</div>
			</Layout>
		</Layout>
	);
};


