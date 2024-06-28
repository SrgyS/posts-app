import { Button } from '../buttons/button';
import ReactDOM from 'react-dom';
import s from './confirm-modal.module.css';
import { useEffect } from 'react';

type ConfirmModalProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
    isLoading?: boolean;
};

export const ConfirmModal = ({
    message,
    onConfirm,
    onCancel,
    isOpen,
    isLoading,
}: ConfirmModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modalOpen');
        } else {
            document.body.classList.remove('modalOpen');
        }
        return () => {
            document.body.classList.remove('modalOpen');
        };
    }, [isOpen]);
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                <p>{message}</p>
                <div className={s.buttons}>
                    <Button onClick={onCancel} variant='secondary'>
                        Нет
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant='primary'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Удаление...' : 'Да'}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
