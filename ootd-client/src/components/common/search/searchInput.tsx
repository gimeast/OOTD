import styles from './searchInput.module.scss';
import SearchIcon from '../../icons/SearchIcon.tsx';

const SearchInput = ({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}) => {
    return (
        <section className={styles.search_input_section}>
            <h2 className='sr-only'>검색어 입력창</h2>
            <SearchIcon className={styles.search_icon} />
            <input type='text' value={value} onChange={onChange} placeholder={placeholder} />
        </section>
    );
};

export default SearchInput;
