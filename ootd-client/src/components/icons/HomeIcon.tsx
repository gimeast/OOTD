const HomeIcon = ({ className, onClick }: { className: string; onClick?: () => void }) => {
    return (
        <svg
            className={className}
            onClick={onClick}
            width='24'
            height='25'
            viewBox='0 0 24 25'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M1.00328 10.3275L1.04032 21.5769C1.04395 22.6789 1.93832 23.5703 3.04031 23.5703H5.98864C7.0971 23.5703 7.99414 22.6688 7.98861 21.5603L7.96175 16.1696C7.95623 15.0611 8.85326 14.1596 9.96173 14.1596H14.0016C15.1023 14.1596 15.9961 15.049 16.0016 16.1496L16.0287 21.5803C16.0342 22.6809 16.928 23.5703 18.0286 23.5703H20.9837C22.0909 23.5703 22.9874 22.6709 22.9837 21.5637L22.9467 10.3193C22.9446 9.69628 22.6524 9.10979 22.1562 8.73303L13.1812 1.91834C12.4662 1.37549 11.4772 1.37549 10.7623 1.91834L1.79381 8.72807C1.29392 9.10763 1.00122 9.69985 1.00328 10.3275Z'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
            />
        </svg>
    );
};

export default HomeIcon;
