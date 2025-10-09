import styles from './authInput.module.scss';

type AuthInputProps = {
    type: 'text' | 'email' | 'password';
    id: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    autoComplete?: string;
};

const AuthInput = ({ type, id, name, placeholder, value, onChange, label, autoComplete }: AuthInputProps) => {
    const getAutoComplete = () => {
        if (autoComplete) return autoComplete;
        if (type === 'email') return 'email';
        if (type === 'password') return 'current-password';
        return undefined;
    };

    return (
        <div className={styles.form_group}>
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete={getAutoComplete()}
            />
        </div>
    );
};

export default AuthInput;