import BasicButton from './BasicButton.tsx';
import styles from './basicModal.module.scss';
import LogoSection from './LogoSection.tsx';

type BasicModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subTitle: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    closeOnBackdropClick?: boolean;
};

const BasicModal = ({
    isOpen,
    onClose,
    title,
    subTitle,
    confirmText = '확인',
    cancelText,
    onConfirm,
    closeOnBackdropClick = true,
}: BasicModalProps) => {
    if (!isOpen) return null;

    const handleBackdropClick = () => {
        if (closeOnBackdropClick) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            onClose();
        }
    };

    return (
        <div className={styles.modal_backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {<LogoSection h2={title} p={subTitle} />}
                <div className={styles.modal_buttons}>
                    {cancelText && (
                        <BasicButton type='button' onClick={onClose}>
                            {cancelText}
                        </BasicButton>
                    )}
                    <BasicButton type='button' onClick={handleConfirm} isActive={true}>
                        {confirmText}
                    </BasicButton>
                </div>
            </div>
        </div>
    );
};

export default BasicModal;
