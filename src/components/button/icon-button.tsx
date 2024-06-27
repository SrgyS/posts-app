import s from './icon-button.module.css';
type ButtonAction = 'comment' | 'edit' | 'delete' | 'favorite';

type ButtonProps = {
    action: ButtonAction;
    onClick: () => void;
    className?: string;
    label?: string;
    children?: React.ReactNode;
    disabled?: boolean;
};

const getIcon = (action: ButtonAction): string => {
    switch (action) {
        case 'comment':
            return 'comment';
        case 'edit':
            return 'edit';
        case 'delete':
            return 'delete';
        case 'favorite':
            return 'star';
        default:
            return '';
    }
};
export const IconButton = ({
    children,
    onClick,
    className,
    action,
    label,
    disabled,
}: ButtonProps) => {
    const iconName = getIcon(action);
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${className} + ${s.iconBtn}`}
            aria-label={label || action}
        >
            <span className='material-symbols-outlined'>{iconName}</span>
            {children}
        </button>
    );
};
