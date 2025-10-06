import styles from './authInput.module.scss';

type AuthInputProps = {
    type: 'text' | 'email' | 'password';
    id: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
};

const AuthInput = ({ type, id, name, placeholder, value, onChange, label }: AuthInputProps) => {
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
            />
        </div>
    );
};

export default AuthInput;