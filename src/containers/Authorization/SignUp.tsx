import {
	Button,
	DatePicker,
	Flex,
	Form,
	Input,
	message,
	Radio,
	Space,
	Typography,
} from 'antd';
import { ERole } from '@/enum/role.enum.ts';
import { ChangeEvent, useState } from 'react';
import {
	IAxiosErrorPayload,
	IUserSignUpRequest,
	IUserStateForm,
} from '@/interfaces/user.interface.ts';
import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import { EUserSubject } from '@/enum/user.enum.ts';
import './authorization.scss';
import { formatPhoneNumber } from '@/helpers/input.helper.tsx';
import { signIn, signUp } from '@/app/user.slice.ts';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
	const dispatch = useAppDispatch();
	const [form] = Form.useForm<IUserStateForm>();
	const [messageApi, contextHolder] = message.useMessage();
	const navigate = useNavigate();
	const { isNewOrder } = useAppSelector(state => state.app)

	const [stateValueForm, setStateValueForm] = useState<IUserStateForm>({
		firstName: '',
		lastName: '',
		phone: '',
		birthday: null,
		password: '',
		passwordConfirm: '',
		role: isNewOrder ? ERole.customer : ERole.performer,
		subject: null,
		identifyingNumber: null,
	});
	const handleValueForm = (e: ChangeEvent<HTMLInputElement>) => {
		const mask = formatPhoneNumber(e.target.value);
		form.setFieldsValue({ phone: mask });
	};
	const onChangeRoleRadioGroup = ({ role }: { role: ERole }) => {
		if (role === ERole.customer) {
			setStateValueForm({
				...stateValueForm,
				subject: EUserSubject.INDIVIDUAL,
			});
			form.setFieldsValue({ subject: EUserSubject.INDIVIDUAL });
		} else {
			setStateValueForm({
				...stateValueForm,
				subject: null,
			});
			form.setFieldsValue({ subject: null });
		}
		form.setFieldsValue({ role });
		setStateValueForm({
			firstName: '',
			lastName: '',
			phone: '',
			birthday: null,
			password: '',
			passwordConfirm: '',
			role: role,
			subject: null,
			identifyingNumber: null,
		});
	};
	const onChangeSubjectRadioGroup = ({
		subject,
	}: {
		subject: EUserSubject;
	}) => {
		form.setFieldsValue({ subject });
		setStateValueForm({
			...stateValueForm,
			subject,
		});
	};
	const onFinish = async (values: IUserStateForm) => {
		setStateValueForm({
			...values,
			phone: values.phone.replace(/[\s()+_-]/g, '').substring(1),
		});
		const user: IUserSignUpRequest = {
			phone: values.phone.replace(/[\s()+_-]/g, '').substring(1),
			displayName: `${values.firstName} ${values.lastName}`,
			password: values.password,
			role: values.role,
			subject: null,
			identifyingNumber: null,
			...(values.birthday && { birthday: `${values.birthday}` }),
		};
		const data = await dispatch(signUp(user));
		const response = data.payload as IAxiosErrorPayload;
		if (!response || typeof response !== 'object') {
			await dispatch(
				signIn({
					phone: values.phone.replace(/[\s()+_-]/g, '').substring(1),
					password: values.password,
					role: ERole.customer,
				})
			);
			navigate('/');
		} else {
			warning(response.response?.data.message || 'Ошибка');
		}
	};
	const warning = (text: string) => {
		messageApi.open({
			type: 'error',
			content: text,
		});
	};

	const handleSignInRedirect = () => {
		navigate('/signIn');
	};

	return (
		<>
			{contextHolder}
			<Space
				className={'space'}
				direction="vertical"
				size="middle"
				style={{ display: 'flex' }}
			>
				<Flex vertical justify={'center'} align={'center'}>
					<Typography.Title level={2}>Регистрация</Typography.Title>
					<Form
						form={form}
						initialValues={{
							firstName: '',
							lastName: '',
							phone: '+7 (',
							birthday: null,
							password: '',
							passwordConfirm: '',
							role: isNewOrder ? ERole.customer : ERole.performer,
							subject: null,
							identifyingNumber: null,
						}}
						onFinish={onFinish}
						onValuesChange={(changedValues, _) => {
							if ('role' in changedValues) {
								onChangeRoleRadioGroup(changedValues);
							} else if ('subject' in changedValues) {
								onChangeSubjectRadioGroup(changedValues);
							}
						}}
					>
						<Form.Item name="role" validateTrigger={['onBlur']}>
							<Radio.Group className="radio-custom" size="large">
								{!isNewOrder && <Radio.Button value={ERole.performer}>
									Исполнитель
								</Radio.Button>}
								<Radio.Button value={ERole.customer}>
									Заказчик
								</Radio.Button>
							</Radio.Group>
						</Form.Item>

						<Form.Item
							rules={[
								{
									required: true,
									message: 'Пожалуйста, введите свое Имя!',
									validator: (_, value) => {
										if (value && value.trim().length >= 3) {
											return Promise.resolve();
										} else {
											return Promise.reject();
										}
									},
								},
							]}
							name="firstName"
							validateTrigger={['onBlur']}
						>
							<Input placeholder="Имя" />
						</Form.Item>

						<Form.Item
							rules={[
								{
									required: true,
									message:
										'Пожалуйста, введите свою Фамилию!',
									validator: (_, value) => {
										if (value && value.trim().length >= 3) {
											return Promise.resolve();
										} else {
											return Promise.reject();
										}
									},
								},
							]}
							name="lastName"
							validateTrigger={['onBlur']}
						>
							<Input placeholder="Фамилия" />
						</Form.Item>

						<Form.Item
							validateTrigger={['onBlur']}
							name="phone"
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

						{stateValueForm.role === ERole.performer ? (
							<>
								<Form.Item
									name="birthday"
									rules={[
										{
											required: true,
											message:
												'Пожалуйста, введите свою дату рождения!',
											validator: (_, value) => {
												if (
													value &&
													value.format('DD/MM/YYYY')
														.length == 10
												) {
													return Promise.resolve();
												} else {
													return Promise.reject();
												}
											},
										},
									]}
									validateTrigger={['onBlur']}
								>
									<DatePicker
										format={'DD/MM/YYYY'}
										placeholder={'ДД/ММ/ГГГГ'}
									/>
								</Form.Item>
							</>
						) : (
							<>
								<Form.Item
									name={'subject'}
									validateTrigger={['onBlur']}
								>
									<Radio.Group className="radio-custom">
										<Radio.Button
											value={EUserSubject.INDIVIDUAL}
										>
											Физ. лицо
										</Radio.Button>
										<Radio.Button
											value={EUserSubject.LEGAL}
										>
											Юр. лицо
										</Radio.Button>
									</Radio.Group>
								</Form.Item>
								{stateValueForm.subject ===
									EUserSubject.LEGAL ? (
									<>
										<Form.Item
											name="identifyingNumber"
											rules={[
												{
													required: true,
													message:
														'Пожалуйста, введите свой БИН',
													validator: (_, value) => {
														if (
															value &&
															value.trim()
																.length == 12
														) {
															return Promise.resolve();
														} else {
															return Promise.reject();
														}
													},
												},
											]}
											validateTrigger={['onBlur']}
										>
											<Input placeholder="БИН" />
										</Form.Item>
									</>
								) : (
									<></>
								)}
							</>
						)}
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

						<Form.Item
							name="passwordConfirm"
							rules={[
								{
									required: true,
									message: 'Пожалуйста, подтвердите пароль!',
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (
											value.length <= 8 ||
											getFieldValue('password').length <=
											8
										) {
											return Promise.reject(
												new Error(
													'Пароли должны быть больше 8 символов'
												)
											);
										}
										if (
											!value ||
											getFieldValue('password') === value
										) {
											return Promise.resolve();
										}
										return Promise.reject(
											new Error('Пароли не совпадают')
										);
									},
								}),
							]}
							validateTrigger={['onBlur']}
						>
							<Input.Password placeholder="Подтвердите пароль" />
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								style={{ width: '100%' }}
							>
								Регистрация
							</Button>
						</Form.Item>

						<Form.Item>
							<Typography.Text>
								У вас уже есть аккаунт?
								<Typography.Link onClick={handleSignInRedirect}>
									Войти
								</Typography.Link>
							</Typography.Text>
						</Form.Item>
					</Form>
				</Flex>
			</Space>
		</>
	);
};
export default SignUp
