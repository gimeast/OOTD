import { useState, useEffect } from 'react';

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timeoutId); //value, delay 변경감지시 정리함수 실행됨
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
