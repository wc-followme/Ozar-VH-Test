import { NOT_FOUND_MESSAGES } from '@/constants/messages';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4'>
      <div className='w-full max-w-[850px] flex flex-col items-center'>
        <div className='w-full flex justify-center mb-8'>
          <Image
            src='/images/not-found.png'
            alt='Under Construction Illustration'
            width={800}
            height={500}
            className='object-contain rounded-lg'
            priority
          />
        </div>
        <p className='text-center text-[24px] text-[var(--text-dark)] mb-6'>
          {NOT_FOUND_MESSAGES.NOTFOUNd}
        </p>
        <Link href='/'>
          <span className='inline-block bg-[var(--secondary)] hover:bg-[var(--hover-bg)] text-white font-semibold px-8 py-3 rounded-full transition-colors'>
            {NOT_FOUND_MESSAGES.GO_HOME}
          </span>
        </Link>
      </div>
    </div>
  );
}
