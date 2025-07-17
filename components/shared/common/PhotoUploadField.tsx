import { GalleryAdd } from 'iconsax-react';
import Image from 'next/image';
import React, { useRef } from 'react';
import { JSX } from 'react/jsx-runtime';

interface PhotoUploadFieldProps {
  photo: File | null;
  onPhotoChange: (file: File | null) => void;
  onDeletePhoto?: () => void;
  label?: string;
  text?: JSX.Element | string;
  className?: string;
  uploading?: boolean;
  existingImageUrl?: string;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  photo,
  onPhotoChange,
  onDeletePhoto,
  label = 'Upload Photo or Drag and Drop',
  text,
  className = '',
  uploading = false,
  existingImageUrl,
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
          {photo ? (
            <div className='w-full h-full flex flex-col items-center justify-center'>
              <Image
                src={URL.createObjectURL(photo)}
                alt='Preview'
                className='rounded-lg max-w-full max-h-32 object-cover'
                width={120}
                height={120}
              />
              <div className='mt-2 text-sm text-center text-[var(--text-dark)]'>
                {photo.name}
              </div>
            </div>
          ) : existingImageUrl ? (
            <div className='w-full h-full flex flex-col items-center justify-center'>
              <Image
                src={existingImageUrl}
                alt='Current Image'
                className='rounded-lg max-w-full max-h-32 object-cover'
                width={120}
                height={120}
              />
              <div className='mt-2 text-sm text-center text-[var(--text-dark)]'>
                Current Image
              </div>
            </div>
          ) : (
            <>
              <GalleryAdd size='32' color='#00A8BF' variant='Outline' />
              <div className='mt-2 text-base font-medium text-center text-[var(--text-dark)]'>
                {label}
              </div>
              {text && (
                <div className='text-sm text-[var(--text-secondary)] mt-1.5 text-center'>
                  {text}
                </div>
              )}
            </>
          )}
          {/* {!photo && (
            <div className='text-sm text-gray-500 font-normal mt-1 leading-none'>
              &nbsp;
            </div>
          )} */}
        </div>
        {(photo || existingImageUrl) && (
          <div className='flex gap-2 mt-2'>
            <button
              type='button'
              className='flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors text-sm font-medium flex items-center justify-center gap-2'
              onClick={handleClick}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                  Uploading...
                </>
              ) : (
                'Change Photo'
              )}
            </button>
            {onDeletePhoto && (
              <button
                type='button'
                className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium'
                onClick={e => {
                  e.stopPropagation();
                  onDeletePhoto();
                }}
                disabled={uploading}
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadField;
