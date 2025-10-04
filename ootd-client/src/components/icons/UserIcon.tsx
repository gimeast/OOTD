const UserIcon = ({ className, onClick }: { className: string; onClick?: () => void }) => {
    return (
        <svg
            className={className}
            onClick={onClick}
            width='21'
            height='23'
            viewBox='0 0 21 23'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M10.47 1C13.4041 1.00024 15.7825 3.37932 15.7825 6.31348C15.7822 9.24743 13.4039 11.6257 10.47 11.626C7.53581 11.626 5.15674 9.24757 5.15649 6.31348C5.15649 3.37917 7.53566 1 10.47 1Z'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M1 21.9623C1 16.7532 5.26051 12.5305 10.4696 12.5305C15.6786 12.5305 19.9391 16.7532 19.9391 21.9623C19.9391 21.9831 19.9222 22 19.9014 22H1.03773C1.01689 22 1 21.9831 1 21.9623Z'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinejoin='round'
            />
        </svg>
    );
};

export default UserIcon;
