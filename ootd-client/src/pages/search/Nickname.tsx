import { useInfiniteQuery } from '@tanstack/react-query';
import type { PageResponseType } from '../../types/common.ts';
import type { nicknameSearchType } from '../../types/ootd.ts';
import { API_ENDPOINTS, apiClient } from '../../api';
import { useScrollObserver } from '../../hooks/useScrollObserver.ts';
import { Link, useOutletContext } from 'react-router-dom';
import styles from './nickname.module.scss';
import NoResult from '../../components/common/NoResult.tsx';
import ProfileOotdAddIcon from '../../components/icons/ProfileOotdAddIcon.tsx';
import ProfileIcon from '../../components/icons/ProfileIcon.tsx';

const Nickname = () => {
    const { debouncedSearchInput } = useOutletContext<{
        debouncedSearchInput: string;
    }>();
    const {
        data: userData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['ootd', 'profile', debouncedSearchInput],
        queryFn: ({ pageParam }: { pageParam: number }): Promise<PageResponseType<nicknameSearchType>> =>
            apiClient(API_ENDPOINTS.MEMBER.SEARCH, {
                method: 'GET',
                params: { page: pageParam, size: 10, keyword: debouncedSearchInput },
            }),
        getNextPageParam: (lastPage: PageResponseType<nicknameSearchType>, allPages) => {
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
            {userData && userData.pages[0]?.content.length === 0 ? (
                <NoResult
                    icon={<ProfileOotdAddIcon />}
                    content1='검색 결과가 없어요'
                    content2='다른 키워드로 검색해보세요'
                />
            ) : (
                <div className={styles.search_result}>
                    <ul className={styles.profile_list}>
                        {userData?.pages.flatMap((page: PageResponseType<nicknameSearchType>) =>
                            page.content.map(item => (
                                <li key={item.idx} className={styles.profile_item}>
                                    <Link to={`/profile/${item.nickname}`}>
                                        {item.profileImageUrl ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}${item.profileImageUrl}`}
                                                alt='프로필 이미지'
                                            />
                                        ) : (
                                            <ProfileIcon width='60' height='60' />
                                        )}
                                        <div className={styles.profile_content}>
                                            <h3>{item?.nickname}</h3>
                                            <p>{item?.bio}</p>
                                        </div>
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

export default Nickname;
