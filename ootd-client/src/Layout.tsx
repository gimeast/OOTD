import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
import BottomNav from './components/layout/BottomNav.tsx';
import { useState } from 'react';

const Layout = () => {
    const [pageTitle, setPageTitle] = useState('');
    const { pathname } = useLocation();
    const bottomNav = ['/', '/search', '/ootd/add', '/likes', '/login'].includes(pathname);

    return (
        <>
            <Header pageTitle={pageTitle} />
            <main>
                <Outlet context={{ setPageTitle }} />
            </main>
            <Footer />
            {bottomNav && <BottomNav />}
        </>
    );
};

export default Layout;
