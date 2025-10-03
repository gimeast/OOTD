const OotdAddIcon = ({ className, onClick }: { className: string; onClick?: () => void }) => {
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
            <circle
                cx='12'
                cy='12'
                r='11'
                fill='white'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
            />
            <path
                d='M16.5 12H7.59046'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
            />
            <path
                d='M12.0452 16.4548L12.0452 7.54529'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
            />
        </svg>
    );
};

export default OotdAddIcon;
