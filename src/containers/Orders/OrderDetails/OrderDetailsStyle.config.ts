import { ConfigProviderProps } from 'antd/es/config-provider';
import { CSSProperties } from 'react';

export const orderDetailsButton: CSSProperties = {
	minWidth: '300px',
	height: '54px',
	marginTop: '20px'
};

export const orderDetailsModalStyle: ConfigProviderProps = {
	flex: {
		style: {
			display: 'flex',
			borderBottom: '1px solid #D9D9D9',
			padding: 20,
			justifyContent: 'space-between',
			gap: '0 10px',
		},
	},
};
export const ordersModalFilterButtonStyle = {
	padding: '10px 20px',
	background: 'white',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};
export const ordersContainerFlexStyle: CSSProperties = {
	width: '100%',
	justifyContent: 'center',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '40px',
};
export const ordersContainerFlexWrapStyle: CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	zIndex: 100,
	backgroundColor: '#f5f5f5',
	paddingLeft: '40px',
	paddingRight: '40px',
	paddingBottom: '10px',
};

export const ordersRowStyle = {
	width: '100%',
	marginTop: '48px'
};
export const modalOrderContainer: CSSProperties = {
	borderBottom: 'none',
	padding: 0,
};

export const modalOrderFilterContainer: CSSProperties = {
	width: '100%',
	justifyContent: 'center',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '20px',
};
export const modalOrderFilterFormContainer: CSSProperties = {
	width: '100%',
	flexDirection: 'column',
	gap: '10px',
};

export const orderDetailsRow: CSSProperties = {
	justifyContent: 'space-between',
	width: '100%',
	borderBottom: '1px solid #ccc'
}
