import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DownloadOutlined, HomeOutlined, OrderedListOutlined, TeamOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { exportOrderListToCSV } from '@/app/order.slice';
import { exportUserListToCSV, signOut } from '@/app/user.slice';
import { showSideBar } from '@/app/app.slice';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { ERole } from '@/enum/role.enum';
import './Sidebar.scss'

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar = () => {
    const { sideBarLeftPosition } = useAppSelector(store => store.app)
    const { user } = useAppSelector(store => store.user)
    const dispatch = useAppDispatch();
    const screens = useBreakpoint();

    const navigate = useNavigate();
    const isAuthenticated = Boolean(localStorage.getItem('token'));
    const userRole = user?.role;

    const handleExportOrderList = () => dispatch(exportOrderListToCSV());
    const handleExportUserList = () => dispatch(exportUserListToCSV());
    const handleSignOut = () => dispatch(signOut());

    const items: MenuItem[] = [
        {
            label: <Link to="/">Главная</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        (userRole === ERole.admin || userRole === ERole.manager) && {
            label: <Link to="/user">Список пользователей</Link>,
            key: 'user',
            icon: <TeamOutlined />,
        },
        (userRole === ERole.performer) && {
            label: <Link to="/my-orders">Мои заказы</Link>,
            key: 'my-orders',
            icon: <UserOutlined />,
        },
        isAuthenticated && {
            label: <Link to="/order">Список заказов</Link>,
            key: 'order',
            icon: <OrderedListOutlined />,
        },
        (userRole === ERole.admin || userRole === ERole.manager) && {
            label: 'Экспорт',
            key: 'exports',
            icon: <DownloadOutlined />,
            children: [
                {
                    label: <span onClick={handleExportOrderList}>Заказы</span>,
                    key: 'order/export-csv',
                },
                {
                    label: <span onClick={handleExportUserList}>Пользователи</span>,
                    key: 'user/export-csv',
                },
            ],
        },
        isAuthenticated && {
            label: <span onClick={handleSignOut}>Выход</span>,
            key: 'signout',
            icon: <UserOutlined />,
        },
        !isAuthenticated && {
            label: <Link to="/signin">Вход</Link>,
            key: 'signin',
            icon: <UserOutlined />,
        },
        !isAuthenticated && {
            label: <Link to="/signup">Регистрация</Link>,
            key: 'signup',
            icon: <UserAddOutlined />,
        },
    ].filter(Boolean) as MenuItem[];

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    const handleTouchStart = (e: any) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const [lastMoveTime, setLastMoveTime] = useState(0);
    const debounceTime = 10;

    const handleTouchMove = (e: any) => {
        if (!isDragging) return;

        const now = Date.now();
        if (now - lastMoveTime < debounceTime) return;

        setLastMoveTime(now);

        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;

        dispatch(showSideBar(Math.min(0, diffX)))
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        if (sideBarLeftPosition < -80) {
            dispatch(showSideBar(-330));
        } else {
            dispatch(showSideBar(0));
        }
    }

    useEffect(() => {
        const pathName = window.location.pathname;
        const hasToken = !!localStorage.getItem('token');
        if ((hasToken && (pathName === '/signup' || pathName === '/signin')) || (!hasToken && pathName !== '/signup' && pathName !== '/signin')) {
            navigate('/');
        }

    }, [user]);

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                overflow: "hidden",
                height: "100vh",
                position: `${screens.lg ? 'fixed' : 'fixed'}`,
                top: 0,
                left: `${sideBarLeftPosition}px`,
                zIndex: 1000,
                userSelect: 'none',
                transition: isDragging ? 'all 0s' : 'all 0.3s'
            }}
        >
            <Sider
                trigger={null}
                theme='light'
                width={330}
                style={{
                    overflow: "auto",
                    height: "100vh",
                    zIndex: 1000,
                    userSelect: 'none',
                    borderRight: '1px solid rgba(5, 5, 5, 0.06)'
                }}
            >
                <div className="logo" />
                <Menu
                    style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        borderRight: 'none'
                    }}
                    defaultSelectedKeys={['1']}
                    theme='light'
                    mode="inline"
                    onClick={() => dispatch(showSideBar(-330))}
                    items={items} />
            </Sider >
            {sideBarLeftPosition !== -330 && !screens.lg &&
                <div
                    className="overlay"
                    style={{
                        opacity: 1 - sideBarLeftPosition * -1 / 330,
                        zIndex: sideBarLeftPosition === -330 ? -1 : 500,
                        transition: isDragging ? 'all 0s' : 'all 0.9s'
                    }}
                    onClick={() => dispatch(showSideBar(-330))}
                ></div>}
        </div>

    )
};
export default Sidebar;