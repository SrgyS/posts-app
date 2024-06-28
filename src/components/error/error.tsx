import { ErrorIcon } from '../../assets/icons';
import s from './error.module.css';

export const Error = ({
    message,
    children,
}: {
    message: string | null;
    children?: React.ReactNode;
}) => {
    return (
        <div className={s.container}>
            <ErrorIcon fill='red' />
            {message}
            {children}
        </div>
    );
};
