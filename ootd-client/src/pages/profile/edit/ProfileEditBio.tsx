import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { LayoutContextType } from '../../../types/context.ts';
import styles from './profileEditBio.module.scss';
import BasicButton from '../../../components/common/button/BasicButton.tsx';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '../../../api';
import useUserStore from '../../../stores/useUserStore.ts';

const ProfileEditBio = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const navigate = useNavigate();
    const { updateBio } = useUserStore();
    const [bio, setBio] = useState('');

    const bioMutation = useMutation({
        mutationFn: async (bio: string) =>
            await apiClient(API_ENDPOINTS.MEMBER.BIO, { method: 'PATCH', params: { bio } }),
        onSuccess: () => {
            updateBio(bio);
            navigate('/profile/edit', { replace: true });
        },
    });

    const handleChangeBio = async (e: React.FormEvent) => {
        e.preventDefault();
        await bioMutation.mutateAsync(bio);
    };

    useEffect(() => {
        setPageTitle('소개 변경');
    }, [setPageTitle]);

    return (
        <div className={styles.profile_edit_bio}>
            <form onSubmit={handleChangeBio} className={styles.profile_edit_bio_form}>
                <label htmlFor='bio'>소개</label>
                <input type='text' id='bio' placeholder='소개' onChange={e => setBio(e.target.value)} value={bio} />
                <BasicButton type='submit' children='변경하기' isActive={true} />
            </form>
        </div>
    );
};

export default ProfileEditBio;
