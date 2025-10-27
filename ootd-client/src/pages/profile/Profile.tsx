import { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import type { LayoutContextType } from '../../types/context.ts';
import styles from './profile.module.scss';
import LogoutIcon from '../../components/icons/LogoutIcon.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import { API_ENDPOINTS, apiClient } from '../../api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProfileHeaderSection from './ProfileHeaderSection.tsx';
import useModalStore from '../../stores/useModalStore.ts';
import type { Stats } from '../../types/profile.ts';

const Profile = () => {
    const { nickname } = useParams<{ nickname: string }>();
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const { user, logout } = useUserStore();
    const { showComingSoonModal, openModal, onClose } = useModalStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: profileStat } = useQuery({
        queryKey: ['ootd', 'stats', nickname],
        queryFn: () => apiClient<Stats>(API_ENDPOINTS.MEMBER.STATS.replace('{nickname}', String(nickname))),
        enabled: !!nickname,
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await apiClient(API_ENDPOINTS.AUTH.LOGOUT, {
                method: 'POST',
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['ootd'] });
            onClose();
            logout();
        },
    });

    const handleLogout = () => {
        openModal({
            title: 'Goodbye',
            subTitle: '로그아웃 하시겠습니까?',
            cancelText: '취소',
            confirmText: '확인',
            onConfirm: async () => {
                await logoutMutation.mutateAsync();
                navigate('/', { replace: true });
            },
        });
    };

    useEffect(() => {
        setPageTitle('프로필');
    }, [setPageTitle]);

    return (
        <div className={styles.profile}>
            {profileStat && (
                <ProfileHeaderSection
                    nickname={profileStat.nickname}
                    bio={profileStat.bio}
                    profileImageUrl={profileStat.profileImageUrl}
                />
            )}

            <section className={styles.profile_numbers_section}>
                <h2 className='sr-only'>게시물 수, 팔로워 수, 팔로잉 수 현황</h2>
                <dl className={styles.profile_numbers}>
                    <div>
                        <dt>게시물</dt>
                        <dd>{profileStat?.postCount}</dd>
                    </div>
                    <div>
                        <dt>팔로워</dt>
                        <dd>{profileStat?.followerCount}</dd>
                    </div>
                    <div>
                        <dt>팔로잉</dt>
                        <dd>{profileStat?.followingCount}</dd>
                    </div>
                </dl>
            </section>

            {user?.nickname === nickname && (
                <section className={styles.profile_settings_section}>
                    <h2 className='sr-only'>프로필 설정</h2>
                    <Link to={`/profile/${nickname}/edit`} className={styles.profile_edit}>
                        프로필 편집
                    </Link>
                    <button className={styles.profile_share} onClick={showComingSoonModal}>
                        프로필 공유
                    </button>
                    <button className={styles.logout} aria-label='로그아웃' onClick={handleLogout}>
                        <LogoutIcon />
                    </button>
                </section>
            )}

            <section className={styles.profile_ootd_group_section}>
                <h2 className='sr-only'>내 게시물, 저장, 태그 목록</h2>
                <div className={styles.profile_tabs}>
                    {user?.nickname === nickname && (
                        <>
                            <NavLink
                                to={`/profile/${nickname}`}
                                replace={true}
                                end
                                className={({ isActive }) => (isActive ? styles.active : '')}
                            >
                                게시물
                            </NavLink>
                            <NavLink
                                to={`/profile/${nickname}/bookmarked`}
                                replace={true}
                                className={({ isActive }) => (isActive ? styles.active : '')}
                            >
                                저장
                            </NavLink>
                            <NavLink
                                to={`/profile/${nickname}/tagged`}
                                onClick={() => showComingSoonModal()}
                                replace={true}
                                className={({ isActive }) => (isActive ? styles.active : '')}
                            >
                                태그
                            </NavLink>
                        </>
                    )}
                </div>
            </section>

            <section className={styles.profile_content_section}>
                <Outlet />
            </section>
        </div>
    );
};

export default Profile;
