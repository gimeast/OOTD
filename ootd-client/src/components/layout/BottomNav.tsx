import OotdAddIcon from '../icons/OotdAddIcon.tsx';
import styles from './bottomNav.module.scss';
import HomeIcon from '../icons/HomeIcon.tsx';
import SearchIcon from '../icons/SearchIcon.tsx';
import LikeIcon from '../icons/HeartIcon.tsx';
import UserIcon from '../icons/UserIcon.tsx';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const isLoggedIn = false; //todo: 실제 로그인 됐는지 체크하는 로직으로 수정 필요

    const handleIcon = (path: string): void => {
        navigate(`${path}`);
    };

    return (
        <nav>
            <div className={styles.nav_inner_box}>
                <HomeIcon className={pathname === '/' ? '' : styles.homeIcon} onClick={() => handleIcon('/')} />
                <SearchIcon
                    className={pathname === '/search' ? '' : styles.searchIcon}
                    onClick={() => handleIcon('/search')}
                />
                <OotdAddIcon
                    className={pathname === '/ootd/add' ? '' : styles.ootdAddIcon}
                    onClick={() => handleIcon('/ootd/add')}
                />
                <LikeIcon
                    className={pathname === '/likes' ? '' : styles.likeIcon}
                    onClick={() => handleIcon('/likes')}
                />
                <UserIcon
                    className={pathname === (isLoggedIn ? '/mypage' : '/login') ? '' : styles.userIcon}
                    onClick={() => handleIcon(isLoggedIn ? '/mypage' : '/login')}
                />
            </div>
        </nav>
    );
};

export default BottomNav;
