import { useState, useEffect } from 'react';
import { Button, Input, Form, Radio, RadioChangeEvent, Modal, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ERole } from '@/enum/role.enum';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import { fetchUsers, signUpGhost } from '@/app/userList.slice';
import './CreateUserForm.scss';
import translateValue, { roleDictionary } from '@/helpers/translate.helper';



const CreateUserForm = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [role, setRole] = useState<ERole | null>(null);
    const loading = useAppSelector((state: RootState) => state.users.loading);
    const [phoneError, setPhoneError] = useState(false);
    const [disabledRoles, setDisabledRoles] = useState<ERole[]>([]);
    const users = useAppSelector((state) => state.users.userList);
    useEffect(() => {
        const takenRoles = users.map(user => user.role);
        setDisabledRoles(takenRoles);
    }, [users]);

    useEffect(() => {
        if (users && users.length > 0) {
            const [user] = users;
            const nameParts = user.displayName.split(' ');
            setFirstName(nameParts[0]);
            setLastName(nameParts.slice(1).join(' '));
            setIsReadOnly(true); 
        } else {
            setFirstName('');
            setLastName('');
            setIsReadOnly(false); 
        }
    }, [users]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (phone.length === 17) {
                const formattedPhone = phone.replace(/[^\d]/g, '').slice(1);
                dispatch(fetchUsers({ phone: formattedPhone }));
                setRole(null);
            }
        }, 1000);

        if (phone.length < 10) {
            setRole(null); 
        }

        return () => clearTimeout(delayDebounceFn);
    }, [phone, dispatch]);

    useEffect(() => {
        setFirstName('');
        setLastName('');
    }, []);
    const formatPhoneNumber = (value: string) => {
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength === 0) return '+7';
        if (phoneNumberLength <= 3) return `+7(${phoneNumber}`;
        if (phoneNumberLength <= 6) return `+7(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        if (phoneNumberLength <= 8) return `+7(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
        return `+7(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8, 10)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const justNumbers = input.replace(/[^\d]/g, '');
        const isPrefixPresent = input.startsWith('+7');
        const withoutPrefix = isPrefixPresent ? justNumbers.slice(1) : justNumbers;
        const formattedPhoneNumber = formatPhoneNumber(withoutPrefix);

        setPhone(formattedPhoneNumber);

        setPhoneError(formattedPhoneNumber.length !== 18);
    };

    const handleRoleChange = (e: RadioChangeEvent) => {
        const newRole = e.target.value as ERole;
        if (newRole === ERole.manager) {
            setIsModalVisible(true);
        } else {
            setRole(newRole);
        }
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handleSubmit = async () => {
        if (phone && firstName && lastName && role !== null) {
            const displayName = `${firstName} ${lastName}`;
            const phoneNumber = phone.replace(/[^\d]/g, '').slice(1); 
            try {
                await dispatch(signUpGhost({
                    phone: phoneNumber, 
                    displayName,
                    role
                })).unwrap();

                message.success('Пользователь успешно создан', 2.5);
                navigate('/user');
            } catch (error) {
                message.error('Произошла ошибка при создании пользователя', 2.5);
            }
        } else {
            message.error('Не все поля формы заполнены', 2.5);
        }
    };
    const confirmRoleChange = () => {
        setRole(ERole.manager);
        setIsModalVisible(false);
    };

    const cancelRoleChange = () => {
        setIsModalVisible(false);
    };
    
  



    return (
        <div style={{ width: '100%', padding: '20px' }}>

            <Spin spinning={loading} >
                <Form.Item
                    validateStatus={phoneError ? 'error' : ''}
                    help={phoneError ? 'Введите корректный номер телефона' : ''}
                >
                    <Input
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="+7 (___) ___-__-__"
                    />
                </Form.Item>
                <Input
                    value={firstName}
                    onChange={handleFirstNameChange}
                    placeholder="Имя"
                    style={{ marginBottom: '16px' }}
                    readOnly={isReadOnly} 
                />
                <Input
                    value={lastName}
                    onChange={handleLastNameChange}
                    placeholder="Фамилия"
                    style={{ marginBottom: '16px' }}
                    readOnly={isReadOnly} 
                />
                <Form.Item>
                    <Radio.Group
                        onChange={handleRoleChange}
                        className="radio-group-custom separated-radio-button"
                        value={role}
                    >
                        {Object.values(ERole).filter(r => r !== ERole.admin).map((roleValue) => (
                            <Radio.Button
                                key={roleValue}
                                value={roleValue}
                                className="radio-button-custom"
                                disabled={disabledRoles.includes(roleValue)}
                            >
                                {translateValue(roleValue, roleDictionary)}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Button onClick={handleSubmit} type="primary" style={{ marginTop: '16px' }}>
                    ДОБАВИТЬ
                </Button>

                <Modal
                    title="Внимание"
                    open={isModalVisible}
                    onOk={confirmRoleChange}
                    onCancel={cancelRoleChange}
                    okText="Да"
                    cancelText="Нет"
                >
                    <p>ВЫ СОЗДАЕТЕ ПОЛЬЗОВАТЕЛЯ С ВЫСОКИМ УРОВНЕМ ПРАВ, ВЫ УВЕРЕНЫ?</p>
                </Modal>
            </Spin>
        </div>
    );
};

export default CreateUserForm;