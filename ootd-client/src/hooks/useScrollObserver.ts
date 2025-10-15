import { useEffect, useRef } from 'react';

export function useScrollObserver(callback: () => void): void {
    const endLineRef = useRef<HTMLDivElement | null>(null);
    const prevIntersectingRef = useRef<boolean>(false);

    useEffect(() => {
        const main = document.querySelector('main');
        if (!main) return;

        const endLine = document.createElement('div');
        endLine.style.height = '10px';
        main.append(endLine);
        endLineRef.current = endLine;

        const observer = new IntersectionObserver(
            entry => {
                const isIntersecting = entry[0].isIntersecting;

                if (isIntersecting && !prevIntersectingRef.current) {
                    callback();
                }

                prevIntersectingRef.current = isIntersecting;
            },
            {
                threshold: 1,
            }
        );

        observer.observe(endLineRef.current);

        return () => {
            if (endLineRef.current) {
                observer.unobserve(endLineRef.current);
                main.removeChild(endLineRef.current);
            }
        };
    }, [callback]);
}
