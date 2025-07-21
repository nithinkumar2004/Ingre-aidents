
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="w-16 h-16 border-4 border-green-300 dark:border-green-700 border-t-green-500 dark:border-t-green-400 border-solid rounded-full animate-spin"></div>
    );
};

export default LoadingSpinner;
