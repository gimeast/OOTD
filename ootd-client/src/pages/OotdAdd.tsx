import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LayoutContextType } from '../types/context.ts';
import ImageBox from '../components/common/ImageBox.tsx';
import styles from './ootdAdd.module.scss';
import BasicButton from '../components/common/BasicButton.tsx';
import DeleteIcon from '../components/icons/DeleteIcon.tsx';
import { API_ENDPOINTS, apiClient } from '../api';
import BasicModal from '../components/common/BasicModal.tsx';

type Product = { productName: string; productLink: string };

const OotdAdd = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const uploadImageMutation = useMutation({
        mutationFn: async (imageFiles: File[]) => {
            const imageFormData = new FormData();
            imageFiles.forEach(file => {
                imageFormData.append('images', file);
            });
            return await apiClient(API_ENDPOINTS.OOTD.IMAGE.UPLOAD, {
                method: 'POST',
                body: imageFormData,
            });
        },
    });

    const createOotdMutation = useMutation({
        mutationFn: async (data: {
            images: Array<Record<string, unknown>>;
            content: string;
            hashtags: string[];
            products: Array<{ productName: string; productLink: string; displayOrder: number }>;
        }) => {
            return await apiClient(API_ENDPOINTS.OOTD.CREATE, {
                method: 'POST',
                body: data,
            });
        },
    });

    const handleFileSelect = (file: File) => {
        setImageFiles(prev => [...prev, file]);
    };

    const handleDeleteImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleProductAdd = () => {
        if (products.length < 3) {
            const product = { productName: '', productLink: '' };
            setProducts(prev => [...prev, product]);
        }
    };

    const handleProductChange = (index: number, field: keyof Product, value: string) => {
        setProducts(prev => prev.map((product, i) => (i === index ? { ...product, [field]: value } : product)));
    };

    const handleDeleteProduct = (index: number) => {
        setProducts(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const imageResult = await uploadImageMutation.mutateAsync(imageFiles);

            const imagesWithOrder = (imageResult as Array<Record<string, unknown>>).map((image, index) => ({
                ...image,
                imageOrder: index,
            }));

            const productsWithOrder = products.map((product, index) => ({
                ...product,
                displayOrder: index,
            }));

            await createOotdMutation.mutateAsync({
                images: imagesWithOrder,
                content,
                hashtags: hashtags
                    .split('#')
                    .filter(tag => tag.trim())
                    .map(tag => tag.trim()),
                products: productsWithOrder,
            });

            queryClient.invalidateQueries({ queryKey: ['ootd', 'list'] });
            setIsModalOpen(true);
        } catch (error) {
            console.error('업로드 실패:', error);
            alert('업로드 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        setPageTitle('OOTD 업로드');
    }, [setPageTitle]);

    useEffect(() => {
        if (imageFiles.length > 0) {
            setIsActive(true);
        }
    }, [imageFiles]);

    const isLoading = uploadImageMutation.isPending || createOotdMutation.isPending;

    return (
        <div className={styles.ootd_add}>
            <form onSubmit={handleSubmit}>
                <section className={styles.image_section}>
                    <h2>사진 선택</h2>
                    <ul className={styles.image_list}>
                        {imageFiles.map((file, index) => (
                            <li key={index}>
                                <ImageBox
                                    imageUrl={URL.createObjectURL(file)}
                                    onDelete={() => handleDeleteImage(index)}
                                />
                            </li>
                        ))}
                        {imageFiles.length < 4 && (
                            <li>
                                <ImageBox onFileSelect={handleFileSelect} />
                            </li>
                        )}
                    </ul>
                </section>

                <section className={styles.content_section}>
                    <h2 id='content-title'>설명</h2>
                    <textarea
                        name='content'
                        id='content'
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        aria-labelledby='content-title'
                        placeholder='오늘의 스타일에 대해 설명해주세요...'
                    />
                </section>

                <section className={styles.hashtags_section}>
                    <h2 id='hashtags-title'>해시태그</h2>
                    <input
                        name='hashtags'
                        id='hashtags'
                        value={hashtags}
                        onChange={e => setHashtags(e.target.value)}
                        aria-labelledby='hashtags-title'
                        placeholder='#데일리룩 #OOTD #캐주얼'
                    />
                </section>

                <section className={styles.products_section}>
                    <div className={styles.products_section_title}>
                        <h2>착용 상품 정보</h2>
                        {products.length < 3 && (
                            <button type='button' onClick={handleProductAdd}>
                                + 상품 추가
                            </button>
                        )}
                    </div>
                    <ul className={styles.products_list}>
                        {products.map((product, index) => (
                            <li key={index} className={styles.product_info}>
                                <div className={styles.product_info_header}>
                                    <h3>상품 {index + 1}</h3>
                                    <DeleteIcon
                                        className={styles.delete_icon}
                                        color='#767676'
                                        onClick={() => handleDeleteProduct(index)}
                                    />
                                </div>
                                <div className={styles.products_input}>
                                    <label htmlFor={`productName${index}`} className='sr-only'>
                                        상품명
                                    </label>
                                    <input
                                        type='text'
                                        name='productNames'
                                        id={`productName${index}`}
                                        value={product.productName}
                                        onChange={e => handleProductChange(index, 'productName', e.target.value)}
                                        placeholder='상품명'
                                    />
                                    <label htmlFor={`productLink${index}`} className='sr-only'>
                                        상품 링크 (URL)
                                    </label>
                                    <input
                                        type='text'
                                        name='productLinks'
                                        id={`productLink${index}`}
                                        value={product.productLink}
                                        onChange={e => handleProductChange(index, 'productLink', e.target.value)}
                                        placeholder='상품 링크 (URL)'
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className={styles.basic_btn}>
                    <BasicButton type='submit' isActive={isActive && !isLoading} disabled={!isActive || isLoading}>
                        {isLoading ? '업로드 중...' : 'OOTD 업로드'}
                    </BasicButton>
                </div>
            </form>

            <BasicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title='Outfit Of The Day'
                subTitle='업로드를 완료 하였습니다!'
                confirmText='확인'
                onConfirm={() => {
                    setIsModalOpen(false);
                    navigate('/', { replace: true });
                }}
            />
        </div>
    );
};

export default OotdAdd;
