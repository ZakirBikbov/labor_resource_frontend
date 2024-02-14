import { useState, useEffect } from 'react';
import { fetchUsers, setFilterApplied } from '@/app/userList.slice';

import { useAppDispatch, useAppSelector } from '@/app/store';

import { ESearchFields, EUserStatus } from '@/enum/user.enum';
import { ERole } from '@/enum/role.enum';
import SearchBar from './SearchBar/SearchBar';
import UserList from './UserList/UserList';

interface Filters {
    offset: number;
    limit: number;
    phone?: string;
    email?: string;
    role?: string;
    status?: string;
    [key: string]: any;
}


const UsersPageContainer = () => {
    const dispatch = useAppDispatch();

    const { userList, totalItems } = useAppSelector((state) => state.users);

    const [filters, setFilters] = useState<Filters>({
        offset: 0,
        limit: 10,
        status: undefined,
        role: undefined,
        searchField: undefined
    });
    const fetchUsersWithUrl = (url: any) => {
        setFilters(url);
        dispatch(fetchUsers(url))

    };
    useEffect(() => {
        const requestFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined) acc[key] = value;
            return acc;
        }, {} as Filters);

        dispatch(setFilterApplied(true));
        dispatch(fetchUsers(requestFilters))
    }, []);

    const handleSearch = (
        searchTerm: string,
        status?: EUserStatus | null,
        role?: ERole | null,
        searchField?: ESearchFields | null
    ) => {
        const newFilters: Filters = {
            offset: 0,
            limit: 10,
            ...(searchField && searchTerm ? { [searchField]: searchTerm } : {}),
            ...(status ? { status: status } : {}),
            ...(role ? { role: role } : {}),
        };

        setFilters(newFilters);
        dispatch(setFilterApplied(true));
        dispatch(fetchUsers(newFilters));
    };


    return (

        <div className="UserList" style={{ padding: '0 20px', display: 'flex', width: '100%', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
                <SearchBar onSearch={handleSearch} />
            </div>
            <UserList
                users={userList}
                totalItems={totalItems}
                pageSize={filters.limit}
                fetchUsers={fetchUsersWithUrl}
                currentFilters={filters}
            />
        </div>
    );

};

export default UsersPageContainer;
