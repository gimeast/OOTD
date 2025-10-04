const SearchIcon = ({ className, onClick }: { className: string; onClick?: () => void }) => {
    return (
        <svg
            className={className}
            onClick={onClick}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <circle cx='11' cy='11' r='10' stroke='currentColor' strokeWidth='2' />
            <line
                x1='18.4142'
                y1='18'
                x2='23'
                y2='22.5858'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
            />
        </svg>
    );
};

export default SearchIcon;
