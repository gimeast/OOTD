import styles from './header.module.scss';
import AlimIcon from '../icons/AlimIcon.tsx';

const Header = () => {
    return (
        <header>
            <h1 className={styles.logo}>OOTD</h1>
            <AlimIcon className={styles.alim} />
        </header>
    );
};

export default Header;
