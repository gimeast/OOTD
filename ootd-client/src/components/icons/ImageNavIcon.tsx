const ImageNavIcon = ({ isActive }: { isActive?: boolean }) => {
    return (
        <svg width='5' height='5' viewBox='0 0 5 5' fill='none' xmlns='http://www.w3.org/2000/svg'>
            {isActive ? (
                <circle cx='2.5' cy='2.5' r='2.5' fill='#767676' />
            ) : (
                <circle cx='2.5' cy='2.5' r='2' fill='white' stroke='#767676' />
            )}
        </svg>
    );
};

export default ImageNavIcon;
