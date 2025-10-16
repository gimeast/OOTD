import styles from './ootdList.module.scss';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '../../api';
import type { PageResponseType } from '../../types/common.ts';
import type { OotdItemType } from '../../types/ootd.ts';
import ProfileOotdAddIcon from '../../components/icons/ProfileOotdAddIcon.tsx';
import NoResult from '../../components/common/NoResult.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import { useScrollObserver } from '../../hooks/useScrollObserver.ts';

const OotdList = () => {
    const { user } = useUserStore();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['ootd', 'my'],
        queryFn: ({ pageParam }: { pageParam: number }): Promise<PageResponseType<OotdItemType>> =>
            apiClient(API_ENDPOINTS.MEMBER.OOTD.LIST.replace('{nickname}', String(user?.nickname)), {
                method: 'GET',
                params: { page: pageParam, size: 12 },
            }),
        getNextPageParam: (lastPage: PageResponseType<OotdItemType>, allPages) => {
            return lastPage.last ? undefined : allPages.length + 1;
        },
        initialPageParam: 1,
    });
    console.log('data', data);

    useScrollObserver(() => {
        if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    });

    return (
        <>
            <h2 className='sr-only'>내가 올린 게시물 조회</h2>
            {data?.pages?.length ? (
                <ul className={styles.ootd_grid}>
                    {data.pages.map((page: PageResponseType<OotdItemType>) =>
                        page.content.map(item => (
                            <li key={item.ootdId} className={styles.ootd_item}>
                                <img src={`${import.meta.env.VITE_API_BASE_URL}${item.ootdImage}`} alt='' />
                            </li>
                        ))
                    )}
                </ul>
            ) : (
                <NoResult
                    icon={<ProfileOotdAddIcon />}
                    content1='업로드한 게시물이 없어요'
                    content2='OOTD를 업로드해보세요!'
                />
            )}
        </>
    );
};

export default OotdList;
