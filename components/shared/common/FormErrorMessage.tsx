import { AlertCircle } from 'lucide-react';
import React from 'react';

interface FormErrorMessageProps {
  message: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className='flex items-center gap-1 text-[var(--warning)] text-sm mt-1'>
      <AlertCircle size={16} className='flex-shrink-0' />
      <span>{message}</span>
    </div>
  );
};

export default FormErrorMessage;
