import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { LayoutContextType } from '../types/context.ts';
import ImageBox from '../components/common/ImageBox.tsx';
import styles from './ootdAdd.module.scss';
import BasicButton from '../components/common/BasicButton.tsx';
import DeleteIcon from '../components/icons/DeleteIcon.tsx';

type Product = { productName: string; productLink: string };

const OotdAdd = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();

    const [images, setImages] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleFileSelect = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        setPageTitle('OOTD 업로드');
    }, [setPageTitle]);

    useEffect(() => {
        if (images.length > 0) {
            setIsActive(true);
        }
    }, [images]);

    return (
        <div className={styles.ootd_add}>
            <form onSubmit={handleSubmit}>
                <section className={styles.image_section}>
                    <h2>사진 선택</h2>
                    <ul className={styles.image_list}>
                        {images.map((imageUrl, index) => (
                            <li key={index}>
                                <ImageBox imageUrl={imageUrl} onDelete={() => handleDeleteImage(index)} />
                            </li>
                        ))}
                        {images.length < 2 && (
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
                        aria-labelledby='content-title'
                        placeholder='오늘의 스타일에 대해 설명해주세요...'
                    />
                </section>

                <section className={styles.hashtags_section}>
                    <h2 id='hashtags-title'>해시태그</h2>
                    <textarea
                        name='hashtags'
                        id='hashtags'
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
                    <BasicButton type='submit' children='OOTD 업로드' isActive={isActive} />
                </div>
            </form>
        </div>
    );
};

export default OotdAdd;
