import { NOT_FOUND_MESSAGES } from '@/constants/messages';
import Image from 'next/image';

interface ComingSoonProps {
  message?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ message }) => (
  <div className='min-h-[60vh] flex flex-col items-center justify-center w-full px-4'>
    <div className='w-full max-w-[850px] flex flex-col items-center'>
      <div className='w-full flex justify-center mb-8'>
        <Image
          src='/images/coming-soon.png'
          alt='Under Construction Illustration'
          width={560}
          height={320}
          className='object-contain rounded-lg'
          priority
        />
      </div>
      <p className='text-center text-lg text-[var(--text-dark)]'>
        {message || NOT_FOUND_MESSAGES.CONSTRUCTION}
      </p>
    </div>
  </div>
);

export default ComingSoon;
