import DeleteIcon from '../icons/DeleteIcon.tsx';
import styles from './imageBox.module.scss';
import PlusIcon from '../icons/PlusIcon.tsx';

type ImageBoxProps = {
    imageUrl?: string;
    onFileSelect?: (file: File) => void;
    onDelete?: () => void;
};

const ImageBox = ({ imageUrl, onFileSelect, onDelete }: ImageBoxProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onFileSelect) {
            onFileSelect(file);
        }
    };

    return (
        <div className={styles.image_box}>
            {imageUrl ? (
                <>
                    <img src={imageUrl} alt='선택된 이미지' className={styles.image} />
                    {onDelete && <DeleteIcon variant='outlined' className={styles.delete_icon} onClick={onDelete} />}
                </>
            ) : (
                <label htmlFor='fileInput' className={styles.upload_label}>
                    <input
                        type='file'
                        id='fileInput'
                        name='fileInput'
                        accept='image/*'
                        onChange={handleFileChange}
                        className={styles.file_input}
                    />
                    <PlusIcon className={styles.plus_icon} />
                </label>
            )}
        </div>
    );
};

export default ImageBox;
