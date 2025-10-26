import styles from './basicButton.module.scss';

type AuthButtonProps = {
    type?: 'submit' | 'button';
    onClick?: () => void;
    disabled?: boolean;
    isActive?: boolean;
    children: React.ReactNode;
};

const BasicButton = ({ type = 'submit', onClick, disabled, isActive, children }: AuthButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.basic_btn} ${isActive ? styles.active : ''}`}
        >
            {children}
        </button>
    );
};

export default BasicButton;
