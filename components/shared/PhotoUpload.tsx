'use client';

import { GalleryAdd } from 'iconsax-react';
import { Upload } from 'lucide-react';

export function PhotoUpload() {
  return (
    <div className="aspect-square w-full mx-auto lg:mx-0 rounded-lg overflow-hidden bg-[#00A8BF26]">
      <div className="w-full h-full border-image-custom rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer">
        <GalleryAdd
 size="32"
 color="#00A8BF"
 variant="Outline"
/>
        <p className="text-[var(--text-dark)] mt-2 font-semibold text-[14px]">Upload Photo</p>
      </div>
    </div>
  );
}