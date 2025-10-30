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

export type OotdImageType = {
    id?: number;  // 기존 이미지는 id가 있음
    imageUrl: string;
    imageOrder: number;
};

export type OotdEditType = {
    id: number;
    content: string;
    images: OotdImageType[];
    hashtags: string[];
    products: ProductType[];
};

export type nicknameSearchType = {
    idx: number;
    nickname: string;
    profileImageUrl: string;
    bio: string;
};

export type OotdMutationType = {
    images: Array<Record<string, unknown>>;
    content: string;
    hashtags: string[];
    products: Array<{ productName: string; productLink: string; displayOrder: number }>;
};
