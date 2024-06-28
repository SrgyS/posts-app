import { ButtonHTMLAttributes } from 'react';
import s from './button.module.css';
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;

    variant?: 'primary' | 'secondary';
};

export const Button = ({
    children,
    onClick,
    className,

    variant,
}: ButtonProps) => {
    const variantClass = variant === 'primary' ? s.primary : s.secondary;
    return (
        <button
            onClick={onClick}
            className={`${s.btn} ${variantClass} ${className || ''}`}
        >
            {children}
        </button>
    );
};
