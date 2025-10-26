import SearchInput from '../../components/common/search/searchInput.tsx';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import type { LayoutContextType } from '../../types/context.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './search.module.scss';
import useDebounce from '../../hooks/useDebounce.ts';

const Search = () => {
    const { setPageTitle } = useOutletContext<LayoutContextType>();
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchInput = useDebounce(searchInput, 500);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleClickHashtag = useCallback((tagName: string) => {
        setSearchInput(tagName);
    }, []);

    const contextValue = useMemo(
        () => ({ handleClickHashtag, debouncedSearchInput }),
        [handleClickHashtag, debouncedSearchInput]
    );

    useEffect(() => {
        setPageTitle('검색');
    }, [setPageTitle]);

    return (
        <div className={styles.search}>
            <SearchInput value={searchInput} onChange={handleSearchInput} placeholder='해시태그, 사용자, 스타일 검색' />
            <section className={styles.search_type_section}>
                <h2 className='sr-only'>검색타입</h2>
                <NavLink to='/search' replace={true} end className={({ isActive }) => (isActive ? styles.active : '')}>
                    해시태그
                </NavLink>
                <NavLink
                    to='/search/nickname'
                    replace={true}
                    className={({ isActive }) => (isActive ? styles.active : '')}
                >
                    사용자
                </NavLink>
                <NavLink
                    to='/search/style'
                    replace={true}
                    className={({ isActive }) => (isActive ? styles.active : '')}
                >
                    스타일
                </NavLink>
            </section>
            <section className={styles.search_content}>
                <Outlet context={contextValue} />
            </section>
        </div>
    );
};

export default Search;
