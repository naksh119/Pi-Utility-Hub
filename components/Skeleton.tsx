import React from 'react';

interface SkeletonProps {
    variant?: 'text' | 'rect' | 'circle';
    width?: string | number;
    height?: string | number;
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    className = '',
}) => {
    const variantClass = variant === 'circle' ? 'skeleton-circle' : variant === 'rect' ? 'skeleton-rect' : 'skeleton-text';

    const style: React.CSSProperties = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`skeleton ${variantClass} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
