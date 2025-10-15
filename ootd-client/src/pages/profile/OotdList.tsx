import styles from './ootdList.module.scss';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '../../api';
import type { PageResponseType } from '../../types/common.ts';
import type { OotdItemType } from '../../types/ootd.ts';
import ProfileOotdAddIcon from '../../components/icons/ProfileOotdAddIcon.tsx';

const OotdList = () => {
    const { data } = useQuery({
        queryKey: ['ootd', 'my'],
        queryFn: () =>
            apiClient<PageResponseType<OotdItemType>>(API_ENDPOINTS.OOTD.MY, { method: 'GET', params: { page: 1 } }),
    });
    console.log('data', data);

    return (
        <>
            <h2 className='sr-only'>내가 올린 게시물 조회</h2>
            {data?.content?.length ? (
                <ul className={styles.ootd_grid}>
                    {data.content.map(item => (
                        <li key={item.ootdId} className={styles.ootd_item}>
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${item.ootdImages[0]}`} alt='' />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className={styles.no_content}>
                    <ProfileOotdAddIcon />
                    <p>업로드한 게시물이 없어요</p>
                    <p>OOTD를 업로드해보세요!</p>
                </div>
            )}
        </>
    );
};

export default OotdList;
