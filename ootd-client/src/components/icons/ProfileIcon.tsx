const ProfileIcon = ({ width = '42', height = '42' }: { width?: string; height?: string }) => {
    return (
        <svg width={width} height={height} viewBox='0 0 42 42' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='21' cy='21' r='21' fill='#F5F5F5' />
            <ellipse cx='21' cy='20.3' rx='9.8' ry='9.1' fill='#D9D9D9' />
            <mask id='mask0_7_49' maskUnits='userSpaceOnUse' x='0' y='0' width='42' height='42'>
                <circle cx='21' cy='21' r='21' fill='#F5F5F5' />
            </mask>
            <g mask='url(#mask0_7_49)'>
                <ellipse cx='21' cy='49.7' rx='16.8' ry='16.1' fill='#D9D9D9' />
            </g>
        </svg>
    );
};

export default ProfileIcon;
