
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon, XIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (files: FileList) => void;
  images: { file: File; base64: string }[];
  onImageRemove: (index: number) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, images, onImageRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        onImageUpload(event.dataTransfer.files);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30 flex-grow flex flex-col shadow-md">
       <h2 className="text-lg font-semibold text-gray-200 mb-3 text-center">Reference Images (Optional)</h2>
      <label
        htmlFor="image-upload"
        className={`relative flex-grow flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 group overflow-hidden ${isDragging ? 'border-purple-500 bg-purple-900/50' : 'border-gray-600 hover:border-purple-400'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        {images.length > 0 ? (
          <div className="w-full h-full flex flex-col p-2">
            <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto">
              {images.map((image, index) => (
                <div key={`${image.file.name}-${index}`} className="relative group aspect-square">
                  <img src={image.base64} alt={image.file.name} className="w-full h-full object-cover rounded-md" />
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onImageRemove(index); }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    aria-label="Remove image"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full text-center p-4 text-purple-400 hover:text-purple-300 shrink-0">
              Click or drag to add more images
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 p-8">
            <UploadIcon className="w-12 h-12 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">You can add multiple images</p>
          </div>
        )}
      </label>
    </div>
  );
};
