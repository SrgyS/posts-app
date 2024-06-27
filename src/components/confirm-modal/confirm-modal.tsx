import { useEffect, useState } from 'react';

import { Button } from '../button/button';
import ReactDOM from 'react-dom';
import s from '../../modules/posts/edit-post-form.module.css';
import styles from '../../modules/posts/posts-list.module.css';

type ConfirmModalProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
    isLoading?: boolean;
};

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
    };
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
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <p>{message}</p>
                <Button onClick={onCancel} className={s.secondaryButton}>
                    Нет
                </Button>
                <Button onClick={onConfirm} className={s.primaryButton}>
                    {isLoading ? 'Удаление...' : 'Да'}
                </Button>
            </div>
        </div>,
        document.body
    );
};
