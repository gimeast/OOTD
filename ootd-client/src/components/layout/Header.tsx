import styles from './header.module.scss';
import AlimIcon from '../icons/AlimIcon.tsx';

const Header = () => {
    return (
        <header>
            <div className={styles.header_inner_box}>
                <h1 className={styles.logo}>OOTD</h1>
                <AlimIcon className={styles.alim} />
            </div>
        </header>
    );
};

export default Header;
