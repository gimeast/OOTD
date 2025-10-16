import styles from './home.module.scss';
import { API_ENDPOINTS, apiClient } from '../../api';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { PageResponseType } from '../../types/common.ts';
import type { OotdItemType } from '../../types/ootd.ts';
import { useScrollObserver } from '../../hooks/useScrollObserver.ts';
import OotdItem from './OotdItem.tsx';
import { useState } from 'react';

const Home = () => {
    const [sort, setSort] = useState<'id' | 'like'>('id');

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['ootd', 'list', sort],
        queryFn: ({ pageParam }: { pageParam: number }): Promise<PageResponseType<OotdItemType>> =>
            apiClient(API_ENDPOINTS.OOTD.LIST, {
                method: 'GET',
                params: { page: pageParam, sort },
            }),
        getNextPageParam: (lastPage: PageResponseType<OotdItemType>, allPages) => {
            return lastPage.last ? undefined : allPages.length + 1;
        },
        initialPageParam: 1,
    });

    const handleSort = (newSort: 'id' | 'like') => {
        setSort(newSort);
    };

    useScrollObserver(() => {
        if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    });

    return (
        <div className={styles.home}>
            <div className={styles.filter_btn_group}>
                <button className={sort === 'id' ? styles.active : ''} onClick={() => handleSort('id')}>
                    최신순
                </button>
                <button className={sort === 'like' ? styles.active : ''} onClick={() => handleSort('like')}>
                    인기순
                </button>
            </div>

            {data?.pages.map((page: PageResponseType<OotdItemType>) =>
                page.content.map((item: OotdItemType) => <OotdItem key={item.ootdId} item={item} />)
            )}
        </div>
    );
};

export default Home;
