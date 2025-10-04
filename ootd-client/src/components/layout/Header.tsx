import styles from './header.module.scss';
import AlimIcon from '../icons/AlimIcon.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import BackArrow from '../icons/BackArrow.tsx';

const Header = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handlePrev = () => {
        navigate(-1);
    };

    return (
        <header>
            {pathname.includes('/login') ? (
                <div className={styles.page_box}>
                    <button onClick={handlePrev}>
                        <BackArrow className='back_arrow' />
                    </button>
                    <h1 className={styles.page_name}>페이지명</h1>
                </div>
            ) : (
                <div className={styles.header_inner_box}>
                    <h1 className={styles.logo}>OOTD</h1>
                    <AlimIcon className={styles.alim} />
                </div>
            )}
        </header>
    );
};

export default Header;
