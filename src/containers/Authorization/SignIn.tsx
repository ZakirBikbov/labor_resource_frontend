import {
	Button,
	Flex,
	Form,
	Input,
	message,
	Space,
	Typography,
} from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';
import {
	IUser,
	IUserSignInRequest,
} from '@/interfaces/user.interface.ts';
import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import { signIn, signInConfirmRole } from '@/app/user.slice.ts';
import './authorization.scss';
import { useNavigate } from 'react-router-dom';
import { ERole } from '@/enum/role.enum.ts';
import { ModalConfirm } from '@/components/UI/Modal/Modal.tsx';
import { showModal } from '@/app/app.slice.ts';
import { formatPhoneNumber } from '@/helpers/input.helper.tsx';
import { AxiosError } from 'axios';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { roleDictionary } from '@/helpers/translate.helper';

export const SignIn = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const screens = useBreakpoint();
	const { signUpUsers } = useAppSelector((store) => store.user);
	const [form] = Form.useForm<IUserSignInRequest>();
	const [stateValueForm, setStateValueForm] = useState<IUserSignInRequest>({
		phone: '',
		password: '',
		role: null,
	});
	const [messageApi, contextHolder] = message.useMessage();
	const warning = (text: string) => {
		messageApi.open({
			type: 'error',
			content: text,
		});
	};
	const onFinish = async (values: IUserSignInRequest) => {
		setStateValueForm({
			...stateValueForm,
			...values,
			phone: values.phone.replace(/[\s()+_-]/g, '').substring(1),
		});
		const user: IUserSignInRequest = {
			phone: values.phone.replace(/[\s()+_-]/g, '').substring(1),
			password: values.password,
			role: null,
		};
		const data = await dispatch(signIn(user));
		const response = data.payload
		if (response instanceof AxiosError) {
			warning(response.response?.data.message!);
		} else {
			if (!Array.isArray(response)) {
				navigate('/');
			}
		}
	};
	const handleValueForm = (e: ChangeEvent<HTMLInputElement>) => {
		const mask = formatPhoneNumber(e.target.value);
		form.setFieldsValue({ phone: mask });
	};
	const onChooseRole = async (role: ERole) => {
		dispatch(showModal(true));
		await dispatch(
			signInConfirmRole({
				...stateValueForm,
				phone: stateValueForm.phone.replace(/[\s()+_-]/g, ''),
				role,
			})
		);
		navigate('/');
	};
	useEffect(() => {
		if (Array.isArray(signUpUsers)) {
			dispatch(showModal(true));
		} else {
			dispatch(showModal(false));
		}
	}, [signUpUsers]);
	const generateRadioButton = (user: IUser[]) => {
		return user.map((item, index) =>
			<Button
				key={index}
				type="primary"
				style={{
					marginTop: '10px',
					marginBottom: '10px'
				}}
				onClick={() => onChooseRole(item.role)}
			>
				{roleDictionary[item.role]}
			</Button>
		);
	};
	return (
		<>
			{contextHolder}
			<ModalConfirm title="Выберите под какой ролью войти:">
				<div
					style={{
						display: 'flex',
						flexDirection: screens.xs ? 'column' : 'row',
						justifyContent: 'space-between'
					}}
				>
					{Array.isArray(signUpUsers) && generateRadioButton(signUpUsers)}
				</div>
			</ModalConfirm>
			<Space
				className={'space'}
				direction="vertical"
				size="middle"
				style={{ display: 'flex' }}
			>
				<Flex vertical justify={'center'} align={'center'}>
					<Typography.Title level={2}>Вход</Typography.Title>
					<Form
						form={form}
						initialValues={{
							phone: '+7 (',
							password: '',
							role: null,
						}}
						onFinish={onFinish}
					>
						<Form.Item
							name="phone"
							validateTrigger={['onBlur']}
							rules={[
								{
									required: true,
									message:
										'Пожалуйста, введите свой номер телефона!',
									validator: (_, value) => {
										if (
											value
												.replace(/[\s()+_-]/g, '')
												.substring(1).length == 10
										) {
											return Promise.resolve();
										} else {
											return Promise.reject();
										}
									},
								},
							]}
						>
							<Input
								placeholder="Номер"
								onChange={handleValueForm}
							/>
						</Form.Item>

						<Form.Item
							name="password"
							rules={[
								{
									required: true,
									message: 'Пожалуйста, введите пароль!',
								},
							]}
						>
							<Input.Password placeholder="Пароль" />
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								style={{ width: '100%' }}
							>
								Войти
							</Button>
						</Form.Item>
					</Form>
				</Flex>
			</Space>
		</>
	);
};
export default SignIn