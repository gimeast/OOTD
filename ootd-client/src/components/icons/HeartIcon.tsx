const HeartIcon = ({ className, onClick }: { className: string; onClick?: () => void }) => {
    return (
        <svg
            className={className}
            onClick={onClick}
            width='27'
            height='24'
            viewBox='0 0 27 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M19.7454 1C17.0635 1 14.7806 2.48 13.5 4.78C12.2194 2.49 9.93653 1 7.25464 1C3.80252 1 1 4.02 1 7.73C1 8.21 1.0464 8.68 1.1392 9.13C2.49406 16.32 13.5 23 13.5 23C13.5 23 24.5059 16.32 25.8608 9.13C25.9536 8.68 26 8.21 26 7.73C26 4.01 23.1975 1 19.7546 1H19.7454Z'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
            />
        </svg>
    );
};

export default HeartIcon;
