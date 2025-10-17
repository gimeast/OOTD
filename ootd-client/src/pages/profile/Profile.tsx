import BottomNav from '../../components/layout/BottomNav.tsx';
import { useEffect } from 'react';
import { Link, NavLink, Outlet, useOutletContext } from 'react-router-dom';
import type { LayoutContextType } from '../../types/context.ts';
import styles from './profile.module.scss';
import LogoutIcon from '../../components/icons/LogoutIcon.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import { API_ENDPOINTS, apiClient } from '../../api';
import { useQuery } from '@tanstack/react-query';
import ProfileHeaderSection from './ProfileHeaderSection.tsx';

type Stats = { followerCount: number; followingCount: number; postCount: number };

const Profile = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const { user, logout } = useUserStore();

    const { data } = useQuery({
        queryKey: ['ootd', 'stats'],
        queryFn: () => apiClient<Stats>(API_ENDPOINTS.MEMBER.STATS.replace('{nickname}', String(user?.nickname))),
    });

    const handleLogout = async () => {
        const result: { message: string; isSuccess: boolean } = await apiClient(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
        });

        if (result?.isSuccess) {
            logout();
        }
    };

    useEffect(() => {
        setPageTitle('프로필');
    }, [setPageTitle]);

    return (
        <div className={styles.profile}>
            <ProfileHeaderSection />

            <section className={styles.profile_numbers_section}>
                <h2 className='sr-only'>게시물 수, 팔로워 수, 팔로잉 수 현황</h2>
                <dl className={styles.profile_numbers}>
                    <div>
                        <dt>게시물</dt>
                        <dd>{data?.postCount}</dd>
                    </div>
                    <div>
                        <dt>팔로워</dt>
                        <dd>{data?.followerCount}</dd>
                    </div>
                    <div>
                        <dt>팔로잉</dt>
                        <dd>{data?.followingCount}</dd>
                    </div>
                </dl>
            </section>

            <section className={styles.profile_settings_section}>
                <h2 className='sr-only'>프로필 설정</h2>
                <Link to='/profile/edit' className={styles.profile_edit}>
                    프로필 편집
                </Link>
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
