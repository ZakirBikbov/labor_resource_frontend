import { IModal } from '@/interfaces/ui.interface.ts';
import { Modal } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store.ts';
import { showModal } from '@/app/app.slice';
import { setSignUpUsers } from '@/app/user.slice';

export const ModalConfirm = ({ title, children }: IModal) => {
	const { modal } = useAppSelector((store) => store.app);
	const dispatch = useAppDispatch();

	const cancelModal = () => {
		dispatch(showModal(false))
		dispatch(setSignUpUsers(null))
	}

	return (
		<>
			<Modal
				title={title}
				open={modal}
				footer={null}
				closable={false}
				cancelButtonProps={{ style: { display: 'none' } }}
				onCancel={cancelModal}
			>
				{children}
			</Modal>
		</>
	);
};
