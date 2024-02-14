
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { ERole } from '@/enum/role.enum';
import { getUserList } from '@/app/order.slice';
import useInfiniteScroll from '../../scrolling/useInfiniteScroll';
interface StateInput {
    text: string;
    option: 'displayName' | 'phone';
}
export const useSearchHandler = (role:ERole) => {
    const dispatch = useAppDispatch();
    const { filterOrder } = useAppSelector((store) => store.order);
    const [stateInput, setStateInput] = useState<StateInput>({ text: '', option: 'displayName' });

    const loadMoreCustomer = async () => {
        if (!filterOrder.listCustomer.links.next) {
            return;
        }
        await dispatch(
            getUserList({
                role: role,
                displayName: stateInput.option === 'displayName' ? stateInput.text : '',
                phone: stateInput.option === 'phone' ? stateInput.text : '',
                nextPage: filterOrder.listCustomer.links.next,
            })
        );
    };

    useInfiniteScroll(loadMoreCustomer, filterOrder.loadingCustomer);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastCustomerElementRef = useCallback((node: Element | null) => {
        if (filterOrder.listCustomer.users.length >= filterOrder.listCustomer.totalItems) {
            return;
        }

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreCustomer();
            }
        });

        if (node) observer.current.observe(node);
    }, [loadMoreCustomer]);

    useEffect(() => {
        const fetchUsers = async () => {
            await dispatch(
                getUserList({
                    role: role,
                    displayName: stateInput.option === 'displayName' ? stateInput.text : '',
                    phone: stateInput.option === 'phone' ? stateInput.text : '',
                })
            );
        };

        if (stateInput.text.length === 0 || stateInput.text) {
            fetchUsers();
        }
    }, [stateInput, role, dispatch]);

    return {
        stateInput,
        setStateInput,
        filterOrder,
        loadMoreCustomer,
        lastCustomerElementRef
    };
};