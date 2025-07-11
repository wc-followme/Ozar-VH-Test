import { GalleryAdd } from 'iconsax-react';
import React, { useRef } from 'react';
import { JSX } from 'react/jsx-runtime';

interface PhotoUploadFieldProps {
  photo: File | null;
  onPhotoChange: (file: File | null) => void;
  onDeletePhoto: () => void;
  label?: string;
  text?: JSX.Element | string;
  className?: string;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  photo,
  onPhotoChange,
  onDeletePhoto,
  label = 'Upload Photo or Drag and Drop',
  text,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoChange(e.target.files[0]);
    }
  };

  return (
    <div className={className}>
      {/* {label && (
        <Label className='text-[14px] font-semibold text-[var(--text-dark)] mb-1 block'>
          {label}
        </Label>
      )} */}

      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div className='mb-2'>
        <div
          className='w-full min-h-[9.375rem] rounded-xl border-2 border-dashed border-cyanwave-main bg-cyanwave-light flex flex-col items-center justify-center cursor-pointer relative py-10'
          onClick={handleClick}
        >
          <GalleryAdd size='32' color='#00A8BF' variant='Outline' />
          <div className='mt-2 text-base font-medium text-center text-[var(--text-dark)]'>
            {photo ? photo.name : label}
          </div>
          {/* {!photo && (
            <div className='text-sm text-gray-500 font-normal mt-1 leading-none'>
              &nbsp;
            </div>
          )} */}
          {text && (
            <div className='text-sm text-[var(--text-secondary)] mt-1.5 text-center'>
              {photo ? '' : text}
            </div>
          )}
          {photo && (
            <button
              type='button'
              className='absolute top-2 right-2 rounded-full bg-white border border-gray-200 p-1 hover:bg-gray-100 shadow'
              onClick={e => {
                e.stopPropagation();
                onDeletePhoto();
              }}
              aria-label='Remove photo'
            >
              <svg width='18' height='18' viewBox='0 0 20 20' fill='none'>
                <path
                  d='M6 6L14 14M6 14L14 6'
                  stroke='#888'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadField;
