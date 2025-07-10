import React from 'react';

const LoadingComponent: React.FC = () => (
  <div className='fixed h-screen w-screen top-0 left-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center'>
    <div className='loader'></div>
  </div>
);

export default LoadingComponent;
