import { showSideBar } from "@/app/app.slice"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { MenuOutlined } from "@ant-design/icons"
import { Button, Typography } from "antd"
import { useLocation } from "react-router-dom"
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint"
import "./Navbar.scss"

export const Navbar = () => {
    const { sideBarLeftPosition } = useAppSelector(store => store.app)
    const dispatch = useAppDispatch();
    const location = useLocation();
    const screens = useBreakpoint();
    const pathname = location.pathname;

    let title = '';

    if (pathname === '/user') {
        title = 'Список пользователей';
    } else if (pathname === '/order') {
        title = 'Список заказов';
    } else if (pathname.startsWith("/order/details/")) {
        title = 'Информация о заказе';
    } else if (pathname === '/createUserForm') {
        title = 'Добавление пользователя';
    }

    return (
        <>
            <div style={{
                display: 'flex',
                width: screens.lg ? `calc(100% - ${sideBarLeftPosition} - 350px)` : '100%',
                justifyContent: 'flex-start',
                position: 'fixed',
                zIndex: 3,
                background: `${pathname === '/' ? 'none' : '#f5f5f5'}`,
                padding: '10px',
                marginLeft: screens.lg ? `${330 + sideBarLeftPosition}px` : 0
            }}>
                <Button className={pathname === '/' ? 'sidebar-switcher-main' : 'sidebar-switcher'}
                    type="primary"
                    style={{
                        background: pathname === '/' ? '#006698' : 'none',
                        boxShadow: pathname === '/' ? '0 2px 0 rgba(5, 80, 97, 0.24)' : 'none'
                    }}
                    onClick={() => dispatch(showSideBar(sideBarLeftPosition === 0 ? -330 : 0))}>
                    <MenuOutlined />
                </Button>
                {pathname === '/' ? '' :
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: screens.lg ? 'fixed' : 'relative',
                        width: screens.lg ? `calc(100% - ${350 + sideBarLeftPosition}px)` : '100%',
                        height: '74px',
                        marginLeft: screens.lg ? 0 : `-64px`,
                    }}>
                        <Typography.Title
                            level={4}
                            style={{
                                whiteSpace: screens.lg ? 'nowrap' : 'break-spaces',
                                textAlign: 'center',

                                marginBottom: '4px'
                            }}>
                            {title}
                        </Typography.Title>
                    </div>
                }
            </div >
        </>
    )
}