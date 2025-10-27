import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
import BottomNav from './components/layout/BottomNav.tsx';
import { useState } from 'react';
import BasicModal from './components/common/modal/BasicModal.tsx';
import useModalStore from './stores/useModalStore.ts';

const Layout = () => {
    const [pageTitle, setPageTitle] = useState('');
    const { pathname } = useLocation();
    const { isOpen, onClose, title, subTitle, confirmText, cancelText, onConfirm, closeOnBackdropClick } =
        useModalStore();

    const hideBottomNavPaths = ['/join'];
    const bottomNav = !hideBottomNavPaths.includes(pathname);

    return (
        <>
            <Header pageTitle={pageTitle} />
            <main>
                <Outlet context={{ setPageTitle }} />
                <BasicModal
                    isOpen={isOpen}
                    onClose={onClose}
                    title={title}
                    subTitle={subTitle}
                    confirmText={confirmText}
                    cancelText={cancelText}
                    onConfirm={onConfirm}
                    closeOnBackdropClick={closeOnBackdropClick}
                />
            </main>
            <Footer />
            {bottomNav && <BottomNav />}
        </>
    );
};

export default Layout;
