import styles from './authButton.module.scss';

type AuthButtonProps = {
    type?: 'submit' | 'button';
    onClick?: () => void;
    disabled?: boolean;
    isActive?: boolean;
    children: React.ReactNode;
};

const AuthButton = ({ type = 'submit', onClick, disabled, isActive, children }: AuthButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={isActive ? styles.active : ''}
        >
            {children}
        </button>
    );
};

export default AuthButton;