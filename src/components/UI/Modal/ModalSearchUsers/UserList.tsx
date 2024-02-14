import React from 'react';
import { List, Typography } from 'antd';
import { displayFormatPhone } from '@/helpers/displayFormatPhone.helper';
import { IUserOrder } from '@/interfaces/order.interface';

const listItemStyle: React.CSSProperties = {
  border: '1px solid #d9d9d9',
  borderRadius: '10px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '10px',
  marginBottom: '10px'
};

interface UserListProps {
    users: IUserOrder[];
    onSelect: (user: IUserOrder) => void; 
    selectedPerformerIds?: Set<number>;
    lastCustomerElementRef: ((node: HTMLElement | null) => void) | null;
}

export const UserList: React.FC<UserListProps> = ({
    users,
    onSelect,
    selectedPerformerIds,
    lastCustomerElementRef,
}) => {
  return (
    <>
      {users && users.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={users}
          style={{ marginTop: '20px' }}
          renderItem={(user, index) => {
            const isAlreadySelected = selectedPerformerIds?.has(user.id);
            const isLastElement = index === users.length - 1;
            const ref = isLastElement ? lastCustomerElementRef : null;
            const backgroundColor = isAlreadySelected ? 'lightgreen' : undefined; 

            return (
              <List.Item
                ref={ref}
                style={{ ...listItemStyle, backgroundColor }}
                onClick={() => {
                  if (!isAlreadySelected) {
                    onSelect(user);
                  }
                }}
              >
                <p>{user.displayName}:</p>
                <p>{displayFormatPhone(user.phone)}</p>
              </List.Item>
            );
          }}
        />
      ) : (
        <Typography.Title style={{ marginTop: 30 }} level={5}>
          Такого пользователя не существует
        </Typography.Title>
      )}
    </>
  );
};