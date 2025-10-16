import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '../../api';
import NoResult from '../../components/common/NoResult.tsx';
import ProfileBookmarkIcon from '../../components/icons/ProfileBookmarkIcon.tsx';
import type { PageResponseType } from '../../types/common.ts';
import type { OotdItemType } from '../../types/ootd.ts';
import styles from './ootdList.module.scss';
import useUserStore from '../../stores/useUserStore.ts';

const BookmarkedList = () => {
    const { user } = useUserStore();
    const { data } = useQuery({
        queryKey: ['ootd', 'bookmarked'],
        queryFn: () =>
            apiClient<PageResponseType<OotdItemType>>(
                API_ENDPOINTS.MEMBER.OOTD.BOOKMARKED.replace('{nickname}', String(user?.nickname)),
                {
                    method: 'GET',
                    params: { page: 1 },
                }
            ),
    });

    return (
        <div>
            {data?.content?.length ? (
                <ul className={styles.ootd_grid}>
                    {data.content.map(item => (
                        <li key={item.ootdId} className={styles.ootd_item}>
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${item.ootdImage}`} alt='' />
                        </li>
                    ))}
                </ul>
            ) : (
                <NoResult
                    icon={<ProfileBookmarkIcon />}
                    content1='저장된 게시물이 없어요'
                    content2='마음에 드는 OOTD를 저장해보세요!'
                />
            )}
        </div>
    );
};

export default BookmarkedList;
