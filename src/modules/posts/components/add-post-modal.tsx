import { EditPostForm } from './edit-post-form';
import { Post } from '../posts.slice';
import ReactDOM from 'react-dom';
import { User } from '../../users/users.slice';
import { postsApi } from '../api';
import s from './add-post-modal.module.css';
import { useEffect } from 'react';

type AddPostModalProps = {
    users: User[];
    onClose: () => void;
    isOpen: boolean;
};

export const AddPostModal = ({ users, onClose, isOpen }: AddPostModalProps) => {
    const [addPost] = postsApi.useAddPostMutation();

    const handleAddPost = async (newPost: Post) => {
        try {
            await addPost(newPost).unwrap();
            onClose();
        } catch (error) {
            console.error('Failed to add the post:', error);
        }
    };
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
                <EditPostForm
                    post={{ userId: users[0].id, title: '', body: '', id: 0 }}
                    users={users}
                    onSave={handleAddPost}
                    onCancel={onClose}
                    isAdd={true}
                />
            </div>
        </div>,
        document.body
    );
};
