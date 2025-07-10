import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4'>
      <h1 className='text-7xl font-extrabold text-[var(--primary)] mb-4'>
        404
      </h1>
      <h2 className='text-2xl font-semibold text-[var(--text-dark)] mb-2'>
        Page Not Found
      </h2>
      <p className='text-lg text-[var(--text-secondary)] mb-8 text-center max-w-md'>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link href='/'>
        <span className='inline-block bg-[var(--secondary)] hover:bg-[var(--hover-bg)] text-white font-semibold px-8 py-3 rounded-full transition-colors'>
          Go to Home
        </span>
      </Link>
    </div>
  );
}
