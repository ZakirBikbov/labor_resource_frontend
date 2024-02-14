import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { fetchUserById } from '@/app/userList.slice';
import { Avatar, Button, Card, Modal, Select, Tag } from 'antd';

import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { displayFormatPhone } from '@/helpers/displayFormatPhone.helper';
import { changeUserStatus } from '@/app/user.slice';
import { ERole } from '@/enum/role.enum';


const UserDetail: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const cardUser = useAppSelector((state) => state.users.currentUser);
    const { user } = useAppSelector((state) => state.user)
    const isLoading = useAppSelector((state) => state.users.loading);
    const error = useAppSelector((state) => state.users.error);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newStatus, setNewStatus] = useState<string | null>(null);

    useEffect(() => {
        if (cardUser) {
            setNewStatus(cardUser.status);
        }
    }, [cardUser]);

    const showModal = () => {
        if (cardUser) {
            setIsModalVisible(true);
            setNewStatus(cardUser.status);
        }
    };

    const handleOk = async () => {
        if (cardUser && newStatus && newStatus !== cardUser.status) {
            await dispatch(changeUserStatus({ id: cardUser.id.toString(), status: newStatus }));
            dispatch(fetchUserById(cardUser.id.toString()));
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const confirmPerformer = async () => {
        if (cardUser) {
            await dispatch(changeUserStatus({ id: cardUser.id.toString(), status: 'ACTIVE' }));
            dispatch(fetchUserById(cardUser.id.toString()));
        }
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchUserById(id));
        }
    }, [dispatch, id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!cardUser) {
        return <div>No user data available.</div>;
    }

    const formattedBirthday = new Date(cardUser.birthday!).toLocaleDateString();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            overflow: 'auto',
            position: 'relative'
        }}>
            <Card
                style={{
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                    position: 'relative',
                    width: '90%',
                    maxWidth: '600px',
                }}
                cover={
                    <div style={{ padding: '20px', background: '#f0f2f5', borderBottom: '1px solid #f0f0f0' }}>

                        <Avatar
                            size={128}
                            src={cardUser.avatar}
                            icon={!cardUser.avatar && <UserOutlined />}
                        />
                    </div>
                }
                actions={[
                    <>
                        {user && user.role === ERole.manager && cardUser.role === 'performer' && cardUser.status === 'AWAITING' && (
                            <Button type="primary" onClick={confirmPerformer}>
                                Подтвердить исполнителя
                            </Button>
                        )}
                        {user && user.role === ERole.manager && !(cardUser.status === 'AWAITING') && (
                            <Button type="primary" danger onClick={showModal}>
                                Изменить статус
                            </Button>
                        )}
                        <Modal
                            title="Изменить статус"
                            open={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <Select
                                placeholder="Выберите новый статус"
                                style={{ width: 120 }}
                                onChange={setNewStatus}
                                value={newStatus}
                            >
                                {['ACTIVE', 'BLOCKED', 'DISABLED'].filter(status => status !== cardUser.status && !(cardUser.role !== 'performer' && status === 'AWAITING')).map(status => (
                                    <Select.Option key={status} value={status}>{status}</Select.Option>
                                ))}
                            </Select>
                        </Modal>

                    </>
                ]}
            >
                <Card.Meta
                    title={cardUser.displayName}
                    description={(
                        <>
                            <p>Телефон:{cardUser.phone ? displayFormatPhone(cardUser.phone) : 'Не указан'}</p>
                            <p>Email: {cardUser.email || 'Не указан'}</p>
                            <p>Дата рождения: {cardUser.birthday ? formattedBirthday : 'Не указана'}</p>
                            <p>Роль: {cardUser.role}</p>
                            <p>Средний рейтинг: {cardUser.avgRating || 'Не указан'}</p>
                            <p>Количество оценок: {cardUser.ratingCount || 'Не указано'}</p>
                            <p>Последнее местоположение: {cardUser.lastPosition || 'Не указано'}</p>
                            <p>Идентификационный номер: {cardUser.identifyingNumber || 'Не указан'}</p>
                            <Tag color={cardUser.status === 'ACTIVE' ? 'green' : 'volcano'}>{cardUser.status}</Tag>
                        </>
                    )}
                />
            </Card>

            <Button
                onClick={() => navigate(-1)}
                icon={<CloseOutlined />}
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    border: 'none',
                    background: 'transparent',
                    color: 'rgba(0, 0, 0, 0.65)',
                    boxShadow: 'none',
                }}
            />
        </div>
    );
};

export default UserDetail;
