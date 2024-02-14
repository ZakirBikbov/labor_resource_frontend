
import React, { ChangeEvent } from 'react';
import { Input, Select } from 'antd';

interface SearchInputProps {
    stateInput: {
        text: string;
        option: 'displayName' | 'phone'; 
    };
    setStateInput: (stateInput: { text: string; option: 'displayName' | 'phone' }) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ stateInput, setStateInput }) => {
    const optionsSearch = [
        { label: 'Имя', value: 'displayName' },
        { label: 'Номер телефона', value: 'phone' },
    ];

    return (
        <Input
            addonBefore={
                <Select
                    defaultValue={stateInput.option} 
                    style={{ width: 165 }}
                    onChange={(value) => setStateInput({ ...stateInput, option: value })}
                >
                    {optionsSearch.map((item, index) => (
                        <Select.Option value={item.value} key={index}>
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
            }
            placeholder={
                stateInput.option === 'displayName'
                    ? 'Напишите имя'
                    : 'Напишите номер телефона'
            }
            value={stateInput.text}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStateInput({
                    ...stateInput,
                    text: e.target.value,
                })
            }
        />
    );
};