import OotdAddIcon from '../icons/OotdAddIcon.tsx';
import styles from './bottomNav.module.scss';
import HomeIcon from '../icons/HomeIcon.tsx';
import SearchIcon from '../icons/SearchIcon.tsx';
import LikeIcon from '../icons/HeartIcon.tsx';
import UserIcon from '../icons/UserIcon.tsx';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';
import useModalStore from '../../stores/useModalStore.ts';

const BottomNav = () => {
    const isLoggedIn = useUserStore(state => state.isLoggedIn);
    const { showComingSoonModal } = useModalStore();

    return (
        <nav>
            <div className={styles.nav_inner_box}>
                <NavLink to='/' className={({ isActive }) => (isActive ? styles.active : '')}>
                    {({ isActive }) => <HomeIcon className={isActive ? '' : styles.homeIcon} />}
                </NavLink>
                <NavLink
                    to='/search'
                    onClick={showComingSoonModal}
                    className={({ isActive }) => (isActive ? styles.active : '')}
                >
                    {({ isActive }) => <SearchIcon className={isActive ? '' : styles.searchIcon} />}
                </NavLink>
                <NavLink
                    to={isLoggedIn ? '/ootd/add' : '/login'}
                    className={({ isActive }) => (isLoggedIn && isActive ? styles.active : '')}
                >
                    {({ isActive }) => <OotdAddIcon className={isLoggedIn && isActive ? '' : styles.ootdAddIcon} />}
                </NavLink>
                <NavLink
                    to={isLoggedIn ? '/likes' : '/login'}
                    onClick={showComingSoonModal}
                    className={({ isActive }) => (isLoggedIn && isActive ? styles.active : '')}
                >
                    {({ isActive }) => <LikeIcon className={isLoggedIn && isActive ? '' : styles.likeIcon} />}
                </NavLink>
                <NavLink
                    to={isLoggedIn ? '/profile' : '/login'}
                    className={({ isActive }) => (isActive ? styles.active : '')}
                >
                    {({ isActive }) => <UserIcon className={isActive ? '' : styles.userIcon} />}
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
