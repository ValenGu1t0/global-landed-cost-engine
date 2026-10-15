'use client';

import { FullImageUrl } from '@/features/products_view/data/get-product-image-by-id';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  IconChevronLeft,
  IconChevronRight,
  IconLoader,
  IconPhotoOff
} from '@tabler/icons-react';
import { useState, useMemo, useCallback } from 'react';

type ProductImageGalleryProps = {
  imageUrls: FullImageUrl[] | undefined;
  isLoading: boolean;
};

export function ProductImageGallery({
  imageUrls,
  isLoading
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = useMemo(() => imageUrls || [], [imageUrls]);

  // Navegación dentro de la galeria
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const currentImage = useMemo(() => {
    if (images.length === 0) return null;
    return images[activeIndex];
  }, [images, activeIndex]);

  // Spinner de carga
  if (isLoading || imageUrls === undefined) {
    return (
      <div className='mx-auto max-w-[500px] p-4 pt-0'>
        <div className='flex h-64 items-center justify-center rounded-xl border-2 border-dashed bg-gray-50/80 p-6'>
          <IconLoader className='text-primary h-8 w-8 animate-spin' />
          <p className='ml-3 text-sm text-white'>Loading images...</p>
        </div>
      </div>
    );
  }

  // Comprobación de contenido vacío solo después de que la carga haya terminado (isLoading=false y imageUrls no es undefined)
  if (images.length === 0) {
    return (
      <div className='mx-auto max-w-[500px] p-4 pt-0'>
        <div className='flex h-64 items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-6'>
          <IconPhotoOff className='h-8 w-8 text-red-500' />
          <p className='ml-3 text-sm text-red-500'>
            This product has no images yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-[500px] p-4 pt-0'>
      <div className='relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-orange-100/70 shadow-lg'>
        {/* IMAGEN PRINCIPAL */}
        <div className='h-full w-full'>
          {currentImage && (
            <Image
              src={currentImage}
              alt={`Product image ${activeIndex + 1}`}
              fill
              sizes='(max-width: 768px) 100vw, 500px'
              className='bg-white object-contain'
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src =
                  'https://placehold.co/600x450/eeeeee/333333?text=Image+Missing';
              }}
            />
          )}
        </div>

        {/* CONTROLES DE NAVEGACIÓN */}
        {images.length > 1 && (
          <>
            <Button
              variant='outline'
              size='icon'
              className='absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full border-orange-700 bg-white/70 text-orange-700 shadow-md backdrop-blur-sm transition hover:bg-white'
              onClick={goToPrev}
            >
              <IconChevronLeft className='h-6 w-6' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full border-orange-600 bg-white/70 text-orange-600 shadow-md backdrop-blur-sm transition hover:bg-white'
              onClick={goToNext}
            >
              <IconChevronRight className='h-6 w-6' />
            </Button>
          </>
        )}
      </div>

      {/* Miniatura de las imagenes modo galeria */}
      {images.length > 1 && (
        <div className='mt-4 flex flex-wrap justify-center gap-3 overflow-x-auto p-2'>
          {images.map((url, index) => (
            <div
              key={index}
              className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-200 ${
                index === activeIndex
                  ? 'border-orange-500 shadow-md'
                  : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={url}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes='64px'
                className='object-cover'
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://placehold.co/64x64/dddddd/333333?text=X';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
