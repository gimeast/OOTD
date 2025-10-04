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
            <path d='M1 7H16' stroke='#767676' strokeWidth='2' strokeLinecap='round' />
            <path d='M7 1L1 7L7 13' stroke='#767676' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
    );
};

export default BackArrow;
