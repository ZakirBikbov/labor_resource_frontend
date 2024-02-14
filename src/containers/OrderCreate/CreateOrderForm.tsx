import { useState, useEffect, useRef } from 'react';
import { Input, Select, Button, Card } from 'antd';
import { fetchManagers, fetchUserByPhone } from '@/app/user.slice';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import { clearErrorMessage, createOrder, resetCreateOrderForm, updateCreateOrderFormField } from '@/app/order.slice';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CreateOrderFormProps } from '@/interfaces/createOrderFormProps.interface';
import { ICreateOrderForm } from '@/interfaces/order.interface';
import { setIsNewOrder } from '@/app/app.slice';
import { notification } from 'antd';
const { Option } = Select;
const backButtonStyle: React.CSSProperties = {
    marginRight: '8px',
};
const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
};
const cardStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    width: '100%',
    zIndex: 2
};
const CreateOrderForm = ({ serviceType, onBack }: CreateOrderFormProps) => {
    const dispatch = useAppDispatch();
    const managers = useAppSelector((state: RootState) => state.user.managers);
    const user = useAppSelector((state: RootState) => state.user.user);
    const { errorMessage, successMessage } = useAppSelector((state: RootState) => state.order);
    const userRole = user ? user.role : 'customer';
    const isUserAuthenticated = user !== null;
    const navigate = useNavigate()
    const createOrderFormData = useAppSelector((state) => state.order.createOrderForm);
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const phoneError = useAppSelector((state) => state.order.createOrderForm.phoneError);
    const todayDate = new Date().toISOString().split('T')[0];
    useEffect(() => {
        if (errorMessage) {
            notification.error({
                message: 'Произошла ошибка',
                description: errorMessage,
                duration: null,
                onClose: () => {
                    {
                        dispatch(clearErrorMessage())
                    }
                },
            });
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            notification.success({
                message: 'Поздравляем',
                description: successMessage,
                duration: null,
                onClose: () => {
                    {
                        dispatch(clearErrorMessage())
                    }
                },
            });
        }
    }, [successMessage]);
    useEffect(() => {
        if (userRole === 'manager') {
            dispatch(fetchManagers());
        }
    }, [dispatch, userRole]);

    useEffect(() => {
        const handlePhoneChange = async (phoneValue: string) => {
            if (phoneValue.length === 10) {
                dispatch(updateCreateOrderFormField({ field: 'phoneError', value: '' }));

                dispatch(fetchUserByPhone(phoneValue)).then((userResponse) => {
                    if (userResponse.payload && userResponse.payload.users && userResponse.payload.users.length > 0) {
                        const user = userResponse.payload.users[0];
                        if (user.displayName && !createOrderFormData.isDisplayNameManuallyChanged) {
                            dispatch(updateCreateOrderFormField({ field: 'displayName', value: user.displayName }));
                        }
                    }
                });
            } else {
                dispatch(updateCreateOrderFormField({ field: 'phoneError', value: 'Неверный формат номера телефона' }));
            }
        };

        if (createOrderFormData.phone.length && userRole === 'manager') {
            handlePhoneChange(createOrderFormData.phone);
        }
    }, [createOrderFormData.phone, userRole, dispatch, createOrderFormData.isDisplayNameManuallyChanged]);


    const handleSubmit = async () => {
        const { date, time, address, description, quantity, phone, displayName, managerId, lat, lng } = createOrderFormData;

        if (!isFormValid(createOrderFormData) || phoneError) {
            return;
        }

        const orderData = {
            serviceId: serviceType === 'loader' ? 1 : 2,
            orderData: `${date} ${time}`,
            address,
            description,
            performersQuantity: parseInt(quantity),
            phone,
            displayName,
            managerId: parseInt(managerId),
            lat,
            lng
        };

        try {
            await dispatch(createOrder(orderData));
            dispatch(resetCreateOrderForm());
            setIsExpanded(false)
        } catch (error) {
            console.log(error);
        }
    };


    const handleFocus = () => {
        setIsExpanded(true);
    };

    const handleEvent = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        const datePickerPopup = document.querySelector('.ant-picker-dropdown');
        const selectDropdown = document.querySelector('.ant-select-dropdown');

        if (formRef.current && !formRef.current.contains(target) &&
            (!datePickerPopup || !datePickerPopup.contains(target)) &&
            (!selectDropdown || !selectDropdown.contains(target))) {
            setIsExpanded(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleEvent);
        document.addEventListener("touchstart", handleEvent);

        return () => {
            document.removeEventListener("mousedown", handleEvent);
            document.removeEventListener("touchstart", handleEvent);
        };
    }, []);

    const isFormValid = (formData: ICreateOrderForm) => {
        const { date, address, quantity, description, displayName, phone, managerId } = formData;

        if (userRole === 'customer') {
            return date && address && quantity && description;
        }
        return date && address && quantity && displayName && phone && description && managerId;
    };

    const handleSignUpRedirect = () => {
        dispatch(setIsNewOrder(true))
        navigate('/signUp');
    };

    const cardExpandedStyle: React.CSSProperties = {
        ...cardStyle,
        maxHeight: isExpanded ? '500px' : '80px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out',
    };

    const handleInputChange = (field: string, value: string) => {
        if (field === 'quantity') {
            const intValue = parseInt(value, 10);
            if (intValue > 20) {
                value = '20';
            }
        }
        dispatch(updateCreateOrderFormField({ field, value }));
    };

    return (
        <>
            <Card
                ref={formRef}
                style={cardExpandedStyle}
            >
                <div style={inputGroupStyle}>
                    <Button onClick={onBack} type="default" icon={<LeftOutlined />} style={backButtonStyle} />
                    <Input
                        value={createOrderFormData.address}
                        onFocus={handleFocus}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Адрес"
                        style={{ flexGrow: 1 }}
                    />
                </div>

                <div>
                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                        <Input
                            value={createOrderFormData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            style={{ marginRight: '8px', flex: 1 }}
                            placeholder="Дата (YYYY-MM-DD)"
                            type="date"
                            min={todayDate}
                        />
                        <Input
                            value={createOrderFormData.time}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            style={{ flex: 1 }}
                            placeholder="Время (HH:mm)"
                            type="time"
                        />
                    </div>

                    <Input
                        value={createOrderFormData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        style={{ marginBottom: '16px' }}
                        type="number"
                        min="1"
                        max="20"
                        placeholder="Количество грузчиков"
                    />

                    <Input
                        value={createOrderFormData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        style={{ marginBottom: '16px' }}
                        placeholder="Краткое описание"
                    />

                    {userRole === 'manager' && (
                        <>

                            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '8px' }}>Менеджер:</span>
                                <Select value={createOrderFormData.managerId}
                                    onChange={(value) => handleInputChange('managerId', value)} style={{ flex: 1 }} placeholder="Выберите менеджера">
                                    {managers.map((manager) => (
                                        <Option key={manager.id} value={manager.displayName}>
                                            {manager.displayName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            <Input
                                value={createOrderFormData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Номер телефона"
                                style={{ marginBottom: '16px' }}
                            />
                            {phoneError && <div style={{ color: 'red' }}>{phoneError}</div>}

                            <Input
                                value={createOrderFormData.displayName}
                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                style={{ marginBottom: '16px' }}
                                placeholder="Имя Фамилия"
                            />
                        </>
                    )}

                    <div style={{ textAlign: 'center' }}>
                        {isUserAuthenticated ? (
                            <Button onClick={handleSubmit} type="primary" disabled={!isFormValid(createOrderFormData)}>
                                Сохранить
                            </Button>
                        ) : (
                            <Button onClick={handleSignUpRedirect} type="primary">
                                Зарегистрироваться
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </>
    );
};

export default CreateOrderForm;