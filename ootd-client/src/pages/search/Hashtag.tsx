import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '../../api';
import styles from './hashtag.module.scss';
import { Link, useOutletContext } from 'react-router-dom';
import type { PageResponseType } from '../../types/common.ts';
import type { OotdItemType } from '../../types/ootd.ts';
import { useScrollObserver } from '../../hooks/useScrollObserver.ts';
import NoResult from '../../components/common/NoResult.tsx';
import ProfileOotdAddIcon from '../../components/icons/ProfileOotdAddIcon.tsx';

type Hashtags = [
    {
        id: number;
        tagName: string;
        usageCount: number;
    },
];

const Hashtag = () => {
    const { handleClickHashtag, debouncedSearchInput } = useOutletContext<{
        handleClickHashtag: (tagName: string) => void;
        debouncedSearchInput: string;
    }>();

    const { data: hashtags } = useQuery({
        queryKey: ['ootd', 'hashtags'],
        queryFn: async () => await apiClient<Hashtags>(API_ENDPOINTS.HASHTAG.POPULAR),
    });

    const {
        data: ootdData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['ootd', 'list', debouncedSearchInput],
        queryFn: ({ pageParam }: { pageParam: number }): Promise<PageResponseType<OotdItemType>> =>
            apiClient(API_ENDPOINTS.OOTD.SEARCH, {
                method: 'GET',
                params: { page: pageParam, size: 20, keyword: debouncedSearchInput },
            }),
        getNextPageParam: (lastPage: PageResponseType<OotdItemType>, allPages) => {
            return lastPage.last ? undefined : allPages.length + 1;
        },
        initialPageParam: 1,
        enabled: !!debouncedSearchInput,
    });

    useScrollObserver(() => {
        if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    });

    return (
        <>
            <h2 className='sr-only'>해시태그 검색</h2>
            {!ootdData?.pages[0].content.length && (
                <>
                    <h3 className={styles.popular_hashtag}>인기 해시태그</h3>
                    <ul className={styles.popular_hashtag_list}>
                        {hashtags?.map(hashtag => (
                            <li key={hashtag.id}>
                                <button onClick={() => handleClickHashtag(hashtag.tagName)}>#{hashtag.tagName}</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {ootdData && ootdData.pages[0]?.content.length === 0 ? (
                <NoResult
                    icon={<ProfileOotdAddIcon />}
                    content1='검색 결과가 없어요'
                    content2='다른 키워드로 검색해보세요'
                />
            ) : (
                <div className={styles.search_result}>
                    <ul className={styles.ootd_grid}>
                        {ootdData?.pages.flatMap((page: PageResponseType<OotdItemType>) =>
                            page.content.map(item => (
                                <li key={item.ootdId} className={styles.ootd_item}>
                                    <Link to={`/ootd/${item.ootdId}`}>
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}${item.ootdImage}`} alt='' />
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Hashtag;
