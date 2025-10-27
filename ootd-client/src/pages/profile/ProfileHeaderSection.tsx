import styles from './profileHeaderSection.module.scss';
import ProfileIcon from '../../components/icons/ProfileIcon.tsx';

const ProfileHeaderSection = ({
    nickname,
    bio,
    profileImageUrl,
}: {
    nickname: string;
    bio: string;
    profileImageUrl: string;
}) => {
    return (
        <section className={styles.profile_header_section}>
            <h2 className='sr-only'>프로필 정보</h2>
            {profileImageUrl ? (
                <img src={`${import.meta.env.VITE_API_BASE_URL}${profileImageUrl}`} alt='프로필 이미지' />
            ) : (
                <ProfileIcon width='60' height='60' />
            )}

            <div className={styles.profile_content}>
                <h3>{nickname}</h3>
                <p>{bio}</p>
            </div>
        </section>
    );
};

export default ProfileHeaderSection;
