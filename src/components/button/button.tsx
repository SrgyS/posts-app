import s from './button.module.css';

export const Button = ({
    children,
    onClick,
    className,
    type,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${s.btn} ${className || ''}`}
        >
            {children}
        </button>
    );
};
