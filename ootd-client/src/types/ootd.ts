export type ProductType = {
    productName: string;
    productLink: string;
    ogImage: string;
};

export type OotdItemType = {
    ootdId: number;
    profileImageUrl: string;
    nickname: string;
    ootdImages?: string[];
    ootdImage?: string;
    isLiked: boolean;
    likeCount: number;
    isBookmarked: boolean;
    content: string;
    hashtags: string[];
    products: ProductType[];
};
