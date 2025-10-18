import { create } from 'zustand';

type ModalState = {
    isOpen: boolean;
    title: string;
    subTitle: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    closeOnBackdropClick?: boolean;
};

type ModalStore = ModalState & {
    openModal: (config: Omit<ModalState, 'isOpen'>) => void;
    onClose: () => void;
    showComingSoonModal: () => void;
};

const initialState: ModalState = {
    isOpen: false,
    title: '',
    subTitle: '',
    confirmText: undefined,
    cancelText: undefined,
    onConfirm: undefined,
    closeOnBackdropClick: true,
};

const useModalStore = create<ModalStore>(set => ({
    ...initialState,

    openModal: config =>
        set({
            isOpen: true,
            ...config,
        }),

    onClose: () => set(initialState),

    showComingSoonModal: () =>
        set({
            isOpen: true,
            title: '서비스 준비 중',
            subTitle: '해당 기능은 곧 제공될 예정입니다.',
            confirmText: '확인',
            closeOnBackdropClick: true,
        }),
}));

export default useModalStore;
