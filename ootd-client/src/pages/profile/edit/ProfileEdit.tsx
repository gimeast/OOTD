import { useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import type { LayoutContextType } from '../../../types/context.ts';
import ProfileHeaderSection from '../ProfileHeaderSection.tsx';
import styles from './profileEdit.module.scss';
import { API_ENDPOINTS, apiClient } from '../../../api';
import { useMutation } from '@tanstack/react-query';
import useUserStore from '../../../stores/useUserStore.ts';
import DeleteIcon from '../../../components/icons/DeleteIcon.tsx';
import useModalStore from '../../../stores/useModalStore.ts';

const ProfileEdit = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const { updateProfileImageUrl } = useUserStore();
    const modalRef = useRef<HTMLDialogElement>(null);
    const { showComingSoonModal } = useModalStore();

    const handleModalOpen = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    const handleModalClose = () => {
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    const imageMutation = useMutation({
        mutationFn: async (images: File[]) => {
            const formData = new FormData();
            images.forEach(file => {
                formData.append('images', file);
            });
            return await apiClient<{ profileImageUrl: string }>(API_ENDPOINTS.MEMBER.PROFILE_IMG, {
                method: 'PATCH',
                body: formData,
            });
        },
        onSuccess: data => {
            updateProfileImageUrl(data.profileImageUrl);
            handleModalClose();
        },
    });

    const imageResetMutation = useMutation({
        mutationFn: async () => {
            return await apiClient<{ profileImageUrl: string }>(API_ENDPOINTS.MEMBER.PROFILE_IMG_RESET, {
                method: 'PATCH',
            });
        },
        onSuccess: data => {
            updateProfileImageUrl(data.profileImageUrl);
            handleModalClose();
        },
    });

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const filesArray = Array.from(fileList);
            imageMutation.mutate(filesArray);
        }
    };

    const handleProfileImageReset = () => {
        imageResetMutation.mutate();
    };

    useEffect(() => {
        setPageTitle('프로필 편집');
    }, [setPageTitle]);

    return (
        <div className={styles.profile_edit}>
            <ProfileHeaderSection />
            <section className={styles.button_group_section}>
                <h2 className='sr-only'>프로필 편집 버튼</h2>
                <button className={styles.profile_image_change_btn} onClick={handleModalOpen}>
                    프로필 이미지 변경
                </button>

                <Link to='bio' className={styles.bio_btn}>
                    소개 변경
                </Link>
            </section>

            <section className={styles.list_section}>
                <h2 className='sr-only'>편집 목록</h2>
                <ul>
                    <li>
                        <button onClick={showComingSoonModal}>
                            <div>
                                <h3>회원정보 변경</h3>
                                <p>이름, 이메일, 닉네임</p>
                            </div>
                        </button>
                    </li>
                    <li>
                        <button onClick={showComingSoonModal}>
                            <h3>비밀번호 변경</h3>
                        </button>
                    </li>
                </ul>
            </section>

            <dialog ref={modalRef} className={styles.profile_image_change_modal}>
                <div className={styles.modal_header}>
                    <h3>프로필 이미지 변경</h3>
                    <button onClick={handleModalClose}>
                        <DeleteIcon color={'#767676'} />
                    </button>
                </div>
                <ul>
                    <li>
                        <label htmlFor='profileImage' className={styles.profile_image_upload_btn}>
                            사진 올리기
                            <input
                                className={styles.profile_image_input}
                                type='file'
                                id='profileImage'
                                accept='image/png,image/jpeg,image/jpg,image/gif,image/webp'
                                onChange={handleProfileImageChange}
                            />
                        </label>
                    </li>
                    <li>
                        <button onClick={handleProfileImageReset}>기본 이미지로 변경</button>
                    </li>
                </ul>
            </dialog>
        </div>
    );
};

export default ProfileEdit;
