const DeleteIcon = ({
    variant = 'basic',
    className,
    color = '#000',
    onClick,
}: {
    variant?: 'basic' | 'outlined';
    className?: string;
    color?: string;
    onClick?: () => void;
}) => {
    return (
        <>
            {variant === 'basic' ? (
                <svg
                    className={className}
                    onClick={onClick}
                    width='12'
                    height='12'
                    viewBox='0 0 12 12'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path d='M1 1L11 11' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                    <path
                        d='M1 11L11 0.999999'
                        stroke={color}
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            ) : (
                <svg
                    className={className}
                    onClick={onClick}
                    width='15'
                    height='15'
                    viewBox='0 0 10 10'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <rect
                        x='0.707108'
                        width='1.57129'
                        height='10.5708'
                        transform='matrix(0.707108 -0.707106 0.707108 0.707106 0.207106 2.31812)'
                        fill='#767676'
                        stroke='white'
                    />
                    <rect
                        y='0.707106'
                        width='1.57129'
                        height='10.5708'
                        transform='matrix(0.707108 0.707106 -0.707108 0.707106 8.68176 0.207107)'
                        fill='#767676'
                        stroke='white'
                    />
                </svg>
            )}
        </>
    );
};

export default DeleteIcon;
