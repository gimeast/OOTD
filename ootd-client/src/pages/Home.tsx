import { useState, useRef } from 'react';
import styles from './home.module.scss';
import ProfileIcon from '../components/icons/ProfileIcon.tsx';
import LikeIcon from '../components/icons/LikeIcon.tsx';
import ShareIcon from '../components/icons/ShareIcon.tsx';
import CommentIcon from '../components/icons/CommentIcon.tsx';
import BookmarkIcon from '../components/icons/BookmarkIcon.tsx';
import ImageNavIcon from '../components/icons/ImageNavIcon.tsx';
import { API_ENDPOINTS, apiClient } from '../api';
import { useQuery } from '@tanstack/react-query';

type OotdItemType = {
    ootdId: number;
    profileImageUrl: string;
    nickname: string;
    ootdImages: string[];
    isLiked: boolean;
    likeCount: number;
    isBookmarked: boolean;
    content: string;
    hashtags: string[];
};

type OotdDataType = {
    content: OotdItemType[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            unsorted: boolean;
            sorted: boolean;
        };
        offset: number;
        unpaged: boolean;
        paged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
};

const OotdItem = ({ item }: { item: OotdItemType }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const imgListRef = useRef<HTMLUListElement>(null);

    const handleScroll = () => {
        if (imgListRef.current) {
            const scrollLeft = imgListRef.current.scrollLeft;
            const itemWidth = imgListRef.current.offsetWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            setCurrentIndex(newIndex);
        }
    };

    const handleNavClick = (index: number) => {
        setCurrentIndex(index);
        if (imgListRef.current) {
            const itemWidth = imgListRef.current.offsetWidth;
            imgListRef.current.scrollTo({
                left: itemWidth * index,
            });
        }
    };

    return (
        <article className={styles.ootd_box}>
            <div className={styles.ootd_header}>
                <ProfileIcon />
                <span className={styles.nickname}>{item.nickname}</span>
            </div>

            <div className={styles.ootd_img_box}>
                <ul ref={imgListRef} className={styles.ootd_img_list} onScroll={handleScroll}>
                    {item.ootdImages.map((ootdImage, index) => (
                        <li key={index}>
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${ootdImage}`} alt='OOTD 이미지' />
                        </li>
                    ))}
                </ul>

                <ul className={styles.ootd_img_nav}>
                    {item.ootdImages.map((_, index) => (
                        <li key={index}>
                            <button onClick={() => handleNavClick(index)}>
                                <ImageNavIcon isActive={currentIndex === index} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.ootd_btn_group}>
                <button>
                    <LikeIcon isActive={item.isLiked} />
                </button>
                <button>
                    <CommentIcon />
                </button>
                <button>
                    <ShareIcon />
                </button>
                <button>
                    <BookmarkIcon isActive={item.isBookmarked} />
                </button>
            </div>
            <span className={styles.ootd_like}>좋아요 {item.likeCount}개</span>

            <div className={styles.ootd_content}>{item.content}</div>

            <div className={styles.ootd_hashtags}>
                {item.hashtags.map((hashtag, index) => (
                    <span key={index}>#{hashtag}</span>
                ))}
            </div>
        </article>
    );
};

const Home = () => {
    const { data, isLoading, error } = useQuery<OotdDataType>({
        queryKey: ['ootd', 'list'],
        queryFn: () =>
            apiClient(API_ENDPOINTS.OOTD.LIST, {
                method: 'GET',
                params: { page: 1 },
            }),
    });

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error.message}</div>;

    console.log(data?.content);

    return (
        <div className={styles.home}>
            <div className={styles.filter_btn_group}>
                <button className={styles.active}>최신순</button>
                <button>인기순</button>
            </div>

            {data?.content?.map(item => (
                <OotdItem key={item.ootdId} item={item} />
            ))}
        </div>
    );
};

export default Home;
