import { useRef } from 'react';

export const useModal = () => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const handleModalOpen = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    const handleModalClose = () => {
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialogElement = modalRef.current;
        if (dialogElement && e.target === dialogElement) {
            handleModalClose();
        }
    };

    return { modalRef, handleModalOpen, handleModalClose, handleBackdropClick };
};
