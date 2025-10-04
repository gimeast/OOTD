const BackArrow = ({ className }: { className: string }) => {
    return (
        <svg
            className={className}
            width='17'
            height='14'
            viewBox='0 0 17 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path d='M1 7H16' stroke='#767676' stroke-width='2' stroke-linecap='round' />
            <path d='M7 1L1 7L7 13' stroke='#767676' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
        </svg>
    );
};

export default BackArrow;
