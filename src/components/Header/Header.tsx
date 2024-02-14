import { NavLink } from 'react-router-dom';

export const Header = () => {
	return (
		<>
			<NavLink to={'/order'}>Order</NavLink>
			<NavLink to={'/order/done'}>done</NavLink>
			<NavLink to={'/order/in_progress'}>in_progress</NavLink>
		</>
	);
};
