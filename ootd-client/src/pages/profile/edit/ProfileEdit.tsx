import { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import type { LayoutContextType } from '../../../types/context.ts';
import BottomNav from '../../../components/layout/BottomNav.tsx';
import ProfileHeaderSection from '../ProfileHeaderSection.tsx';
import styles from './profileEdit.module.scss';
import { API_ENDPOINTS, apiClient } from '../../../api';
import { useMutation } from '@tanstack/react-query';
import useUserStore from '../../../stores/useUserStore.ts';

const ProfileEdit = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const { updateProfileImageUrl } = useUserStore();

    const imageMutation = useMutation({
        mutationFn: async (images: File[]) => {
            const formData = new FormData();
            images.forEach(file => {
                formData.append('images', file);
            });
            return await apiClient<{ profileImageUrl: string }>(API_ENDPOINTS.MEMBER.PROFILE_IMG, {
                method: 'PATCH',
                body: formData
            });
        },
        onSuccess: (data) => {
            updateProfileImageUrl(data.profileImageUrl);
        },
    });

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const filesArray = Array.from(fileList);
            imageMutation.mutate(filesArray);
        }
    };

    useEffect(() => {
        setPageTitle('프로필 편집');
    }, [setPageTitle]);

    return (
        <div className={styles.profile_edit}>
            <ProfileHeaderSection />
            <section className={styles.button_group_section}>
                <h2 className='sr-only'>프로필 변경 버튼</h2>
                <label htmlFor='profileImage' className={styles.profile_image_label}>
                    프로필 이미지 변경
                    <input
                        className={styles.profile_image_input}
                        type='file'
                        id='profileImage'
                        accept='image/*'
                        onChange={handleProfileImageChange}
                    />
                </label>
                <Link to='bio' className={styles.bio_btn}>
                    소개 변경
                </Link>
            </section>

            <section className={styles.list_section}>
                <h2 className='sr-only'>편집 목록</h2>
                <ul>
                    <li>
                        <button>
                            <div>
                                <h3>회원정보 변경</h3>
                                <p>이름, 이메일, 닉네임</p>
                            </div>
                        </button>
                    </li>
                    <li>
                        <button>
                            <h3>비밀번호 변경</h3>
                        </button>
                    </li>
                </ul>
            </section>
            <BottomNav />
        </div>
    );
};

export default ProfileEdit;
