import BottomNav from '../../components/layout/BottomNav.tsx';
import { useEffect } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import type { LayoutContextType } from '../../types/context.ts';
import styles from './profile.module.scss';
import ProfileIcon from '../../components/icons/ProfileIcon.tsx';
import LogoutIcon from '../../components/icons/LogoutIcon.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import { API_ENDPOINTS, apiClient } from '../../api';

const Profile = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const { user, logout } = useUserStore();

    const handleLogout = async () => {
        const result: { message: string; isSuccess: boolean } = await apiClient(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
        });
        console.log('result', result);
        if (result?.isSuccess) {
            logout();
        }
    };

    useEffect(() => {
        setPageTitle('프로필');
    }, [setPageTitle]);

    return (
        <div className={styles.profile}>
            <section className={styles.profile_header_section}>
                <h2 className='sr-only'>프로필 정보</h2>
                <ProfileIcon width='60' height='60' />
                <div className={styles.profile_content}>
                    <h3>{user?.nickname}</h3>
                    <p></p>
                </div>
            </section>

            <section className={styles.profile_numbers_section}>
                <h2 className='sr-only'>게시물 수, 팔로워 수, 팔로잉 수 현황</h2>
                <dl className={styles.profile_numbers}>
                    <div>
                        <dt>게시물</dt>
                        <dd>24</dd>
                    </div>
                    <div>
                        <dt>팔로워</dt>
                        <dd>2.4k</dd>
                    </div>
                    <div>
                        <dt>팔로잉</dt>
                        <dd>240</dd>
                    </div>
                </dl>
            </section>

            <section className={styles.profile_settings_section}>
                <h2 className='sr-only'>프로필 설정</h2>
                <button className={styles.profile_edit}>프로필 편집</button>
                <button className={styles.profile_share}>프로필 공유</button>
                <button className={styles.logout} aria-label='로그아웃' onClick={handleLogout}>
                    <LogoutIcon />
                </button>
            </section>

            <section className={styles.profile_ootd_group_section}>
                <h2 className='sr-only'>내 게시물, 저장, 태그 목록</h2>
                <div className={styles.profile_tabs}>
                    <NavLink
                        to='/profile'
                        replace={true}
                        end
                        className={({ isActive }) => (isActive ? styles.active : '')}
                    >
                        게시물
                    </NavLink>
                    <NavLink
                        to='/profile/bookmarked'
                        replace={true}
                        className={({ isActive }) => (isActive ? styles.active : '')}
                    >
                        저장
                    </NavLink>
                    <NavLink
                        to='/profile/tagged'
                        replace={true}
                        className={({ isActive }) => (isActive ? styles.active : '')}
                    >
                        태그
                    </NavLink>
                </div>
            </section>

            <section className={styles.profile_content_section}>
                <Outlet />
            </section>

            <BottomNav />
        </div>
    );
};

export default Profile;
