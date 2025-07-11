import React from 'react';

interface FormErrorMessageProps {
  message: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className='flex items-center gap-1 text-[var(--warning)] text-xs'>
      <span>{message}</span>
    </div>
  );
};

export default FormErrorMessage;
