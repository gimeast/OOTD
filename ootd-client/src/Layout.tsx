import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
import BottomNav from './components/layout/BottomNav.tsx';
import { useState } from 'react';
import BasicModal from './components/common/BasicModal.tsx';
import useModalStore from './stores/useModalStore.ts';

const Layout = () => {
    const [pageTitle, setPageTitle] = useState('');
    const { pathname } = useLocation();
    const bottomNav = ['/', '/search', '/ootd/add', '/likes', '/login'].includes(pathname);
    const { isOpen, closeModal, title, subTitle, confirmText, cancelText, onConfirm, onCancel, closeOnBackdropClick } =
        useModalStore();
    return (
        <>
            <Header pageTitle={pageTitle} />
            <main>
                <Outlet context={{ setPageTitle }} />
                <BasicModal
                    isOpen={isOpen}
                    onClose={closeModal}
                    title={title}
                    subTitle={subTitle}
                    confirmText={confirmText}
                    cancelText={cancelText}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    closeOnBackdropClick={closeOnBackdropClick}
                />
            </main>
            <Footer />
            {bottomNav && <BottomNav />}
        </>
    );
};

export default Layout;
