import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
import BottomNav from './components/layout/BottomNav.tsx';
import { useState, useEffect } from 'react';
import BasicModal from './components/common/modal/BasicModal.tsx';
import useModalStore from './stores/useModalStore.ts';
import noticeStyles from './components/common/modal/demoNotice.module.scss';

const DEMO_NOTICE_KEY = 'ootd_demo_notice_seen';

const DemoNoticeContent = () => (
    <div className={noticeStyles.notice}>
        <p>
            본 서비스는 실제 운영이 아닌 <strong>포트폴리오 목적</strong>으로 제작되었습니다.
            백엔드 서버의 지속적인 운영 비용 문제로 인해 현재 실제 서버는 중단된 상태이며,
            <strong> MSW(Mock Service Worker)</strong>를 통해 브라우저 내부에서 API가 모의 동작하고 있습니다.
        </p>

        <p className={noticeStyles.section_title}>아래 테스트 계정으로 자유롭게 이용하실 수 있습니다.</p>
        <div className={noticeStyles.account_list}>
            {[
                { label: '계정 1', email: 'user1@ootd.com', password: 'password1!' },
                { label: '계정 2', email: 'user2@ootd.com', password: 'password2@' },
                { label: '계정 3', email: 'user3@ootd.com', password: 'password3#' },
            ].map(account => (
                <div key={account.label} className={noticeStyles.account_item}>
                    <span className={noticeStyles.label}>{account.label}</span>
                    <span className={noticeStyles.value}>이메일: {account.email}</span>
                    <span className={noticeStyles.value}>비밀번호: {account.password}</span>
                </div>
            ))}
        </div>

        <div className={noticeStyles.caution}>
            ⚠️ MSW는 브라우저 메모리 기반으로 동작하기 때문에 페이지를 새로고침하면 로그인이 풀립니다.
            이는 서버 부재로 인한 정상적인 동작이오니 양해 부탁드립니다.
        </div>
    </div>
);

const Layout = () => {
    const [pageTitle, setPageTitle] = useState('');
    const [isDemoNoticeOpen, setIsDemoNoticeOpen] = useState(false);
    const { pathname } = useLocation();
    const { isOpen, onClose, title, subTitle, confirmText, cancelText, onConfirm, closeOnBackdropClick } =
        useModalStore();

    useEffect(() => {
        if (!sessionStorage.getItem(DEMO_NOTICE_KEY)) {
            setIsDemoNoticeOpen(true);
        }
    }, []);

    const handleDemoNoticeClose = () => {
        sessionStorage.setItem(DEMO_NOTICE_KEY, 'true');
        setIsDemoNoticeOpen(false);
    };

    const hideBottomNavPaths = ['/join'];
    const bottomNav = !hideBottomNavPaths.includes(pathname);

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

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
                <BasicModal
                    isOpen={isDemoNoticeOpen}
                    onClose={handleDemoNoticeClose}
                    title='서비스 안내'
                    subTitle='방문해 주셔서 감사합니다 :)'
                    confirmText='확인했습니다'
                    closeOnBackdropClick={false}
                >
                    <DemoNoticeContent />
                </BasicModal>
            </main>
            <Footer />
            {bottomNav && <BottomNav />}
        </>
    );
};

export default Layout;
