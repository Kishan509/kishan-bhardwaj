
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload, handleDragEvents]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl shadow-md h-full">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">1. Upload Your Photo</h2>
      <div className="w-full h-full flex-grow flex items-center justify-center">
        {imagePreviewUrl ? (
          <div className="relative w-full h-full max-h-96">
            <img src={imagePreviewUrl} alt="Original Upload" className="object-contain w-full h-full rounded-lg" />
             <label htmlFor="file-upload" className="absolute bottom-2 right-2 px-3 py-1.5 bg-gray-900 bg-opacity-70 text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-opacity-90 transition-opacity">
                Change
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
             </label>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className={`w-full h-64 md:h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
              ${isDragging ? 'border-indigo-500 bg-gray-700' : 'border-gray-500 hover:border-indigo-400 hover:bg-gray-700/50'}`}
            onDragEnter={(e) => handleDragEvents(e, true)}
            onDragLeave={(e) => handleDragEvents(e, false)}
            onDragOver={(e) => handleDragEvents(e, true)}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-12 h-12 text-gray-400 mb-3" />
            <p className="font-semibold text-gray-300">
              <span className="text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WEBP</p>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
