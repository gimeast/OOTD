import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
import BottomNav from './components/layout/BottomNav.tsx';

const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <BottomNav />
        </>
    );
};

export default Layout;
