import React, { useEffect, useState } from 'react';
import { Button, Flex, Input, Modal, Select, Space, Typography } from 'antd';
import { ERole } from '@/enum/role.enum';
import { ESearchFields, EUserStatus } from '@/enum/user.enum';
import { FilterTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import './SearchBar.scss';
import translateValue, { roleDictionary, searchFieldsDictionary, statusDictionary } from '@/helpers/translate.helper';
import { useNavigate } from 'react-router-dom';
import useScrollDirection from '@/components/UI/scrolling/useScrollDirection';

    const { Option } = Select;
    interface SearchBarProps {
        onSearch: (
            searchTerm: string,
            selectedStatus?: EUserStatus | null,
            selectedRole?: ERole | null,
            selectedSearchField?: ESearchFields | null
        ) => void;
    }
    const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
        const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const [selectedStatus, setSelectedStatus] = useState<EUserStatus | null>(null);
        const [selectedRole, setSelectedRole] = useState<ERole | null>(null);
        const [selectedSearchField, setSelectedSearchField] = useState<ESearchFields | null>(ESearchFields.DisplayName);
        
        const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
      


        const [searchBarStyle, setSearchBarStyle] = useState({});
        const scrollDirection = useScrollDirection();
        
        useEffect(() => {
            if (scrollDirection === 'down') {
                setSearchBarStyle({
                    maxHeight: 0, 
                    opacity: 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                    pointerEvents: 'none',
                });
            } else {
                setSearchBarStyle({
                    maxHeight: '500px',
                    opacity: 1,
                    overflow: 'visible',
                    transition: 'max-height 1.3s ease-in-out, opacity 1.3s ease-in-out',
                    pointerEvents: 'auto',
                });
            }
        }, [scrollDirection]);




        const toggleStatus = (status: EUserStatus) => {
            const newStatus = selectedStatus === status ? null : status;
            setSelectedStatus(newStatus);
            onSearch(searchTerm, newStatus, selectedRole, selectedSearchField);
        };

        const toggleRole = (role: ERole) => {
            const newRole = selectedRole === role ? null : role;
            setSelectedRole(newRole);
            onSearch(searchTerm, selectedStatus, newRole, selectedSearchField);
        };

        const toggleSearchField = (field: ESearchFields) => {
            const newField = selectedSearchField === field ? null : field;
            setSelectedSearchField(newField);
            if (searchTerm) {
                onSearch(searchTerm, selectedStatus, selectedRole, newField);
            }
        };

        const handleSearch = (value: string) => {
            setSearchTerm(value);
            if (debounceTimer) clearTimeout(debounceTimer);

            const newTimer = setTimeout(() => {
                if (selectedSearchField) {
                    onSearch(value, selectedStatus, selectedRole, selectedSearchField);
                } else {
                    setIsFilterModalVisible(true);
                }
            }, 500);

            setDebounceTimer(newTimer);
        };

        const handleApplyFilters = () => {
            onSearch(searchTerm, selectedStatus, selectedRole, selectedSearchField);
            setIsFilterModalVisible(false);
        };

        const navigate = useNavigate();

        return (
            <div
                className={`searchContainer `}
                style={{
                    ...searchBarStyle,
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    position: 'fixed',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    maxWidth: '100%',
                    zIndex: 5,
                    backgroundColor: '#f5f5f5',
                }}
            >

                <Input
                    addonBefore={
                        <Select
                            defaultValue={ESearchFields.DisplayName}
                            className="searchSelect"
                            onChange={toggleSearchField}
                            value={selectedSearchField || undefined}
                            popupMatchSelectWidth={false}
                            style={{ width: 100 }} 
                        >
                            {Object.values(ESearchFields).map((field) => (
                                <Option key={field} value={field}>
                                    {translateValue(field, searchFieldsDictionary)}
                                </Option>
                            ))}
                        </Select>
                    }
                    placeholder="Введите текст для поиска..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="searchInput"
                    style={{
                        width: '90%'
                    }}
                    suffix={
                        <Button
                            icon={<FilterTwoTone />}
                            onClick={() => setIsFilterModalVisible(true)}
                            className="filterButton"
                        />
                    }
                />

                <Button
                    style={{ marginRight: '40px' }}
                    type="text"
                    icon={<PlusCircleOutlined />}
                    onClick={() => navigate('/createUserForm')}
                />

                <Modal
                    title="Настройки фильтра"
                    open={isFilterModalVisible}
                    onOk={handleApplyFilters}
                    onCancel={() => setIsFilterModalVisible(false)}
                    width="100%"
                    className="modalCustomStyle"
                    footer={[]}

                >
                    <Space className='123' direction="vertical" size="middle" style={{ padding: '0px' }}>
                        <Flex
                            vertical
                            justify="flex-start"
                            align="flex-start"
                            gap="20px"
                            style={{ width: '100%', flexWrap: 'wrap' }}
                        >
                            {/* Фильтр по статусу */}
                            <Typography.Title level={5} style={{ marginBottom: '10px' }}>Статус</Typography.Title>
                            <Flex style={{ width: '100%', flexWrap: 'wrap', gap: '13px' }}>
                                {Object.values(EUserStatus).map((statusValue) => (
                                    <Button
                                        key={statusValue}
                                        type={selectedStatus === statusValue ? 'primary' : 'default'}
                                        onClick={() => toggleStatus(statusValue)}
                                        size="small"
                                        style={{

                                            width: '45%',
                                            height: '29px',
                                            borderColor: '#006698',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0,
                                            maxWidth: '152px'

                                        }}
                                    >
                                        {translateValue(statusValue, statusDictionary)}
                                    </Button>
                                ))}
                            </Flex>

                            {/* Фильтр по роли */}
                            <Typography.Title level={5} style={{ marginBottom: '10px' }}>Роли</Typography.Title>
                            <Flex style={{ width: '100%', flexWrap: 'wrap', gap: '13px' }}>
                                {Object.values(ERole).map((roleValue) => (
                                    <Button
                                        key={roleValue}
                                        type={selectedRole === roleValue ? 'primary' : 'default'}
                                        onClick={() => toggleRole(roleValue)}
                                        size="small"
                                        style={{

                                            width: '45%',
                                            height: '29px',
                                            borderColor: '#006698',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0,
                                            maxWidth: '152px'

                                        }}
                                    >

                                        {translateValue(roleValue, roleDictionary)}
                                    </Button>
                                ))}
                            </Flex>

                          

                        </Flex>
                    </Space>
                </Modal>

            </div>
        );
    };


    export default SearchBar;