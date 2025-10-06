import styles from './checkbox.module.scss';

type CheckboxProps = {
    id: string;
    name: string;
    label: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = ({ id, name, label, checked, onChange }: CheckboxProps) => {
    return (
        <div className={styles.checkbox_wrapper}>
            <input type='checkbox' id={id} name={name} checked={checked} onChange={onChange} />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};

export default Checkbox;
