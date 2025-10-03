import styles from './header.module.scss';

const Header = () => {
    return (
        <header>
            <h1 className={styles.logo}>OOTD</h1>
            <button className={styles.alim}></button>
        </header>
    );
};

export default Header;
