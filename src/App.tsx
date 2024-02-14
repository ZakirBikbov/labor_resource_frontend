import './assets/styles/normalize.scss';
import './assets/styles/reset.scss';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CustomLayout } from '@/containers/Layout/CustomLayout';
import { SignUp } from '@/containers/Authorization/SignUp.tsx';
import { SignIn } from '@/containers/Authorization/SignIn.tsx';
import { ErrorPage } from '@/containers/ErrorPage/ErrorPage.tsx';
import { Orders } from '@/containers/Orders/Orders.tsx';
import { OrderDetails } from '@/containers/Orders/OrderDetails/OrderDetails';
import UsersPageContainer from './containers/Users/UsersPage';
import UserDetail from './components/UserList/UserDetail';
import CreateUserForm from './containers/Users/CreateUserForm/CreateUserForm';
import { useAppDispatch } from './app/store';
import { useEffect } from 'react';
import { fetchUserProfile } from './app/user.slice';


export const App = () => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(fetchUserProfile());
	}, []);
	return (
		<>
			<HashRouter>
				<Routes>
					<Route path={''} element={<CustomLayout />}>
						<Route path={'signUp'} element={<SignUp />}></Route>
						<Route path={'signIn'} element={<SignIn />}></Route>
						<Route path={'order'} element={<Orders />}></Route>
                        <Route path="/my-orders" element={<Orders onlyMyOrders />} />   
						<Route
							path={'order/:filter'}
							element={<Orders />}
						></Route>
						<Route
							path={'/order/details/:id'}
							element={<OrderDetails />}
						></Route>
						<Route path={'/*'} element={<ErrorPage />}></Route>

						<Route path={'user'} element={<UsersPageContainer />}></Route>
						<Route path={'user/:id'} element={<UserDetail />}></Route>
						<Route path={'createUserForm'} element={<CreateUserForm />}></Route>
					</Route>
				</Routes>
			</HashRouter>
		</>
	);
};
