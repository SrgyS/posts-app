import { useEffect, useState } from 'react';

import { Button } from '../../../components/buttons/button';
import { Post } from '../posts.slice';
import { User } from '../../users/users.slice';
import s from './edit-post-form.module.css';

type EditPostFormProps = {
    post: Post;
    users: User[];
    onSave: (updatedPost: Post) => void;
    onCancel: () => void;
    isAdd: boolean;
};

export const EditPostForm = ({
    post,
    users,
    onSave,
    onCancel,
    isAdd,
}: EditPostFormProps) => {
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState(post.body);
    const [userId, setUserId] = useState(post.userId);

    useEffect(() => {
        setTitle(post.title);
        setBody(post.body);
        setUserId(post.userId);
    }, [post]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...post, title, body, userId });
    };

    return (
        <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.formGroup}>
                <label className={s.label} htmlFor='title'>
                    Заголовок:
                </label>
                <input
                    className={s.input}
                    id='title'
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className={s.label} htmlFor='body'>
                    Текст поста:
                </label>
                <textarea
                    className={s.textarea}
                    id='body'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className={s.label} htmlFor='userId'>
                    Автор:
                </label>
                <select
                    className={s.select}
                    id='userId'
                    value={userId}
                    onChange={(e) => setUserId(Number(e.target.value))}
                    required
                >
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={s.btnContainer}>
                <Button onClick={onCancel} variant='secondary'>
                    Отменить
                </Button>
                <Button type='submit' variant='primary'>
                    {isAdd ? 'Опубликовать' : ' Сохранить'}
                </Button>
            </div>
        </form>
    );
};
