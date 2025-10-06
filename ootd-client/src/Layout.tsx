import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
import BottomNav from './components/layout/BottomNav.tsx';
import { useState } from 'react';

const Layout = () => {
    const [pageTitle, setPageTitle] = useState('');

    return (
        <>
            <Header pageTitle={pageTitle} />
            <main>
                <Outlet context={{ setPageTitle }} />
            </main>
            <Footer />
            <BottomNav />
        </>
    );
};

export default Layout;
