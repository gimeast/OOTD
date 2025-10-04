import OotdAddIcon from '../icons/OotdAddIcon.tsx';
import styles from './bottomNav.module.scss';
import HomeIcon from '../icons/HomeIcon.tsx';
import SearchIcon from '../icons/SearchIcon.tsx';
import LikeIcon from '../icons/HeartIcon.tsx';
import UserIcon from '../icons/UserIcon.tsx';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
    const isLoggedIn = false; //todo: 실제 로그인 됐는지 체크하는 로직으로 수정 필요

    return (
        <nav>
            <div className={styles.nav_inner_box}>
                <NavLink to='/' className={({ isActive }) => (isActive ? styles.active : '')}>
                    {({ isActive }) => <HomeIcon className={isActive ? '' : styles.homeIcon} />}
                </NavLink>
                <NavLink to='/search' className={({ isActive }) => (isActive ? styles.active : '')}>
                    {({ isActive }) => <SearchIcon className={isActive ? '' : styles.searchIcon} />}
                </NavLink>
                <NavLink to='/ootd/add' className={({ isActive }) => (isActive ? styles.active : '')}>
                    {({ isActive }) => <OotdAddIcon className={isActive ? '' : styles.ootdAddIcon} />}
                </NavLink>
                <NavLink to='/likes' className={({ isActive }) => (isActive ? styles.active : '')}>
                    {({ isActive }) => <LikeIcon className={isActive ? '' : styles.likeIcon} />}
                </NavLink>
                <NavLink
                    to={isLoggedIn ? '/mypage' : '/login'}
                    className={({ isActive }) => (isActive ? styles.active : '')}
                >
                    {({ isActive }) => <UserIcon className={isActive ? '' : styles.userIcon} />}
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
