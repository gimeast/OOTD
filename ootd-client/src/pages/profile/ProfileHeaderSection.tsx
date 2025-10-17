import styles from './profileHeaderSection.module.scss';
import ProfileIcon from '../../components/icons/ProfileIcon.tsx';
import useUserStore from '../../stores/useUserStore.ts';

const ProfileHeaderSection = () => {
    const { user } = useUserStore();

    return (
        <section className={styles.profile_header_section}>
            <h2 className='sr-only'>프로필 정보</h2>
            {user?.profileImageUrl ? (
                <div>
                    <img src={`${import.meta.env.VITE_API_BASE_URL}${user.profileImageUrl}`} alt='프로필 이미지' />
                </div>
            ) : (
                <ProfileIcon width='60' height='60' />
            )}

            <div className={styles.profile_content}>
                <h3>{user?.nickname}</h3>
                <p>{user?.bio}</p>
            </div>
        </section>
    );
};

export default ProfileHeaderSection;
