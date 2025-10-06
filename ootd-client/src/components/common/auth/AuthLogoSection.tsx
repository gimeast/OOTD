import styles from './authLogoSection.module.scss';
import LogoIcon from '../../icons/LogoIcon.tsx';

const AuthLogoSection = ({ h2, p }: { h2: string; p: string }) => {
    return (
        <section className={styles.logo_section}>
            <h1>
                <LogoIcon className={styles.logo} />
            </h1>
            <h2>{h2}</h2>
            <p>{p}</p>
        </section>
    );
};

export default AuthLogoSection;
