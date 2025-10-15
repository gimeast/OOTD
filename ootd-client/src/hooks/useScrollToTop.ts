import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export function useScrollToTop(): void {
    const { pathname } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        if (navigationType !== 'POP') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pathname, navigationType]);
}