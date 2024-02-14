import React from 'react';
import { Row, Col, Avatar, Typography, Tag, Space } from 'antd';
import { Link } from 'react-router-dom';
import RoleButtons from './RoleButtons';
import translateValue, { responseStatusDictionary } from '@/helpers/translate.helper';
import { EResponseStatus } from '@/enum/order.enum';
import { IResponse } from '@/interfaces/response.interface';
import { ERole } from '@/enum/role.enum';
import { IUser } from '@/interfaces/user.interface';
interface PerformerRowProps {
    response: IResponse;
    role: ERole;
    setSelectedPerformers: React.Dispatch<React.SetStateAction<IUser[]>>;
}
const PerformerRow: React.FC<PerformerRowProps> = ({ response, role, setSelectedPerformers }) => {
    const userRowStyle = response.status === EResponseStatus.BANNED
        ? {
            borderLeft: '5px solid red',
            backgroundColor: '#fff1f0',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '10px'
        }
        : {
            marginBottom: '10px'
        };
    const getStatusTagColor = (status: EResponseStatus) => {
        switch (status) {
            case EResponseStatus.WAITING:
                return { backgroundColor: '#faad14', color: 'white' };
            case EResponseStatus.IN_PATH:
                return { backgroundColor: '#17a2b8', color: 'white' };
            case EResponseStatus.AWAITING_CONFIRMATION_ARRIVAL:
                return { backgroundColor: '#ffc107', color: 'white' };
            case EResponseStatus.IN_PROGRESS:
                return { backgroundColor: '#1890ff', color: 'white' };
            case EResponseStatus.AWAITING_CONFIRMATION_COMPLETION:
                return { backgroundColor: '#13c2c2', color: 'white' };
            case EResponseStatus.BANNED:
                return { backgroundColor: '#f5222d', color: 'white' };
            case EResponseStatus.DONE:
                return { backgroundColor: '#52c41a', color: 'white' };
            default:
                return { backgroundColor: '#d9d9d9', color: 'rgba(0, 0, 0, 0.65)' };
        }
    };

    const statusTagColor = getStatusTagColor(response.status);
    const translatedStatus = translateValue(response.status, responseStatusDictionary);

    return (
        <Row align="middle" wrap={false} gutter={[16, 16]} style={userRowStyle}>
            <Col>
                <Avatar
                    src={response.performer?.avatar || 'path-to-default-avatar.png'}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                />
            </Col>
            <Col flex="auto">
                <Link to={`/user/${response.performer.id}`}>
                    <Typography.Title level={5}>{response.performer.displayName}</Typography.Title>
                    <Space direction="vertical" size="small" style={{ padding: 0 }}>
                        <Typography.Text style={{ display: 'block' }}>{response.performer.phone}</Typography.Text>
                        <Tag style={statusTagColor}>{translatedStatus}</Tag>
                    </Space>
                </Link>
               
            </Col>
            <RoleButtons
                role={role}
                response={response}
                setSelectedPerformers={setSelectedPerformers}
            />
        </Row>
    );
};

export default PerformerRow;