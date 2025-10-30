import { useState, useRef } from 'react';
import styles from './ootdItem.module.scss';
import ProfileIcon from '../../components/icons/ProfileIcon.tsx';
import LikeIcon from '../../components/icons/LikeIcon.tsx';
import ShareIcon from '../../components/icons/ShareIcon.tsx';
import CommentIcon from '../../components/icons/CommentIcon.tsx';
import BookmarkIcon from '../../components/icons/BookmarkIcon.tsx';
import ImageNavIcon from '../../components/icons/ImageNavIcon.tsx';
import { API_ENDPOINTS, apiClient } from '../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProductOgIcon from '../../components/icons/ProductOgIcon.tsx';
import type { OotdItemType } from '../../types/ootd.ts';
import type { PageResponseType } from '../../types/common.ts';
import useModalStore from '../../stores/useModalStore.ts';
import KebabMenuIcon from '../../components/icons/KebabMenuIcon.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import { useModal } from '../../hooks/useModal.ts';
import { Link } from 'react-router-dom';

const OotdItem = ({ item }: { item: OotdItemType }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const imgListRef = useRef<HTMLUListElement>(null);
    const queryClient = useQueryClient();
    const { showComingSoonModal } = useModalStore();
    const { user } = useUserStore();
    const { modalRef, handleModalOpen, handleModalClose, handleBackdropClick } = useModal();

    const handleScroll = () => {
        if (imgListRef.current) {
            const scrollLeft = imgListRef.current.scrollLeft;
            const itemWidth = imgListRef.current.offsetWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            setCurrentIndex(newIndex);
        }
    };

    const handleImageIndexClick = (index: number) => {
        setCurrentIndex(index);
        if (imgListRef.current) {
            const itemWidth = imgListRef.current.offsetWidth;
            imgListRef.current.scrollTo({
                left: itemWidth * index,
            });
        }
    };

    const likeMutation = useMutation({
        mutationFn: (ootdId: number) =>
            apiClient(API_ENDPOINTS.OOTD.LIKE.replace('{ootdId}', String(ootdId)), {
                method: 'POST',
            }),
        onMutate: async (ootdId: number) => {
            await queryClient.cancelQueries({ queryKey: ['ootd'] });
            const previousData = queryClient.getQueriesData({ queryKey: ['ootd'] });

            queryClient.setQueriesData({ queryKey: ['ootd'] }, (old: any) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: PageResponseType<OotdItemType>) => ({
                        ...page,
                        content: page.content.map((ootdItem: OotdItemType) =>
                            ootdItem.ootdId === ootdId
                                ? {
                                      ...ootdItem,
                                      isLiked: !ootdItem.isLiked,
                                      likeCount: ootdItem.isLiked ? ootdItem.likeCount - 1 : ootdItem.likeCount + 1,
                                  }
                                : ootdItem
                        ),
                    })),
                };
            });

            return { previousData };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                context.previousData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ['ootd'] });
        },
    });

    const bookmarkMutation = useMutation({
        mutationFn: (ootdId: number) =>
            apiClient(API_ENDPOINTS.OOTD.BOOKMARK.replace('{ootdId}', String(ootdId)), {
                method: 'POST',
            }),
        onMutate: async (ootdId: number) => {
            await queryClient.cancelQueries({ queryKey: ['ootd'] });
            const previousData = queryClient.getQueriesData({ queryKey: ['ootd'] });

            queryClient.setQueriesData({ queryKey: ['ootd'] }, (old: any) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: PageResponseType<OotdItemType>) => ({
                        ...page,
                        content: page.content.map((ootdItem: OotdItemType) =>
                            ootdItem.ootdId === ootdId
                                ? {
                                      ...ootdItem,
                                      isBookmarked: !ootdItem.isBookmarked,
                                  }
                                : ootdItem
                        ),
                    })),
                };
            });

            return { previousData };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                context.previousData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ['ootd'] });
        },
    });

    const handleLike = (ootdId: number) => {
        likeMutation.mutate(ootdId);
    };
    const handleBookmark = (ootdId: number) => {
        bookmarkMutation.mutate(ootdId);
    };

    return (
        <article className={styles.ootd_box}>
            <div className={styles.ootd_header}>
                <div className={styles.ootd_profile}>
                    {item.profileImageUrl ? (
                        <div>
                            <img
                                src={`${import.meta.env.VITE_API_BASE_URL}${item.profileImageUrl}`}
                                alt='프로필 이미지'
                            />
                        </div>
                    ) : (
                        <ProfileIcon />
                    )}
                    <span className={styles.nickname}>{item.nickname}</span>
                </div>

                {user?.nickname === item.nickname && (
                    <button className={styles.kebabBtn} onClick={handleModalOpen}>
                        <KebabMenuIcon />
                    </button>
                )}
            </div>

            <div className={styles.ootd_img_box}>
                <ul ref={imgListRef} className={styles.ootd_img_list} onScroll={handleScroll}>
                    {item.ootdImages?.map((ootdImage, index) => (
                        <li key={index}>
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${ootdImage}`} alt='OOTD 이미지' />
                        </li>
                    ))}
                </ul>

                <ul className={styles.ootd_img_nav}>
                    {item.ootdImages?.map((_, index) => (
                        <li key={index}>
                            <button onClick={() => handleImageIndexClick(index)}>
                                <ImageNavIcon isActive={currentIndex === index} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.ootd_btn_group}>
                <button onClick={() => handleLike(item.ootdId)} disabled={likeMutation.isPending}>
                    <LikeIcon isActive={item.isLiked} />
                </button>
                <button onClick={showComingSoonModal}>
                    <CommentIcon />
                </button>
                <button onClick={showComingSoonModal}>
                    <ShareIcon />
                </button>
                <button onClick={() => handleBookmark(item.ootdId)} disabled={bookmarkMutation.isPending}>
                    <BookmarkIcon isActive={item.isBookmarked} />
                </button>
            </div>
            <span className={styles.ootd_like}>좋아요 {item.likeCount}개</span>

            <ul className={styles.product_list}>
                {item.products.map((product, index) => (
                    <li key={index} className={styles.product_box}>
                        <a href={product.productLink} target='_blank' rel='noopener noreferrer'>
                            {product.ogImage ? (
                                <img
                                    src={product.ogImage}
                                    alt={product.productName}
                                    className={styles.product_image}
                                    referrerPolicy='no-referrer'
                                />
                            ) : (
                                <ProductOgIcon />
                            )}

                            <span className={`multi-ellipsis ${styles.product_name}`}>{product.productName}</span>
                        </a>
                    </li>
                ))}
            </ul>

            <div className={styles.ootd_content}>{item.content}</div>

            <div className={styles.ootd_hashtags}>
                {item.hashtags.map((hashtag, index) => (
                    <span key={index}>#{hashtag}</span>
                ))}
            </div>

            <dialog className={styles.dialog} ref={modalRef} onClick={handleBackdropClick}>
                <ul onClick={e => e.stopPropagation()}>
                    <li>
                        <Link to={`ootd/${item.ootdId}/edit`}>게시물 수정</Link>
                    </li>
                    <li>
                        <button type='button'>게시물 삭제</button>
                    </li>
                    <li>
                        <button type='button' onClick={handleModalClose}>
                            취소
                        </button>
                    </li>
                </ul>
            </dialog>
        </article>
    );
};

export default OotdItem;
