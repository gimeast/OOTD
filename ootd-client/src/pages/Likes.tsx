import type { PageResponseType } from '../types/common.ts';
import type { OotdItemType } from '../types/ootd.ts';
import OotdItem from './home/OotdItem.tsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '../api';
import { useScrollObserver } from '../hooks/useScrollObserver.ts';
import HeartIcon from '../components/icons/HeartIcon.tsx';
import NoResult from '../components/common/NoResult.tsx';
import styles from './likes.module.scss';

const Likes = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['ootd', 'list'],
        queryFn: ({ pageParam }: { pageParam: number }): Promise<PageResponseType<OotdItemType>> =>
            apiClient(API_ENDPOINTS.OOTD.LIKED, {
                method: 'GET',
                params: { page: pageParam },
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
        <div className={styles.likes}>
            {data?.pages.map((page: PageResponseType<OotdItemType>) =>
                page.content.length ? (
                    page.content.map((item: OotdItemType) => <OotdItem key={item.ootdId} item={item} />)
                ) : (
                    <NoResult
                        icon={<HeartIcon className={styles.heart_icon} />}
                        content1='좋아요를 클릭한 게시물이 없어요'
                        content2='게시물의 좋아요를 눌러주세요!'
                    />
                )
            )}
        </div>
    );
};

export default Likes;
