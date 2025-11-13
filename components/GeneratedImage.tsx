
import React from 'react';
import { DownloadIcon, ImageIcon } from './IconComponents';

interface GeneratedImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="w-full h-full animate-pulse bg-gray-700 rounded-lg flex items-center justify-center">
    <ImageIcon className="w-20 h-20 text-gray-600" />
  </div>
);

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, isLoading, error }) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'passport-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-md h-full">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">2. Get Your Result</h2>
      <div className="w-full h-full flex-grow flex items-center justify-center min-h-64 md:min-h-0">
        {isLoading && <LoadingSkeleton />}
        {error && !isLoading && (
          <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
            <p className="font-bold">An Error Occurred</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && imageUrl && (
          <div className="relative group w-full h-full max-h-96">
            <img src={imageUrl} alt="Generated Passport Photo" className="object-contain w-full h-full rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center rounded-lg">
              <button
                onClick={handleDownload}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                <DownloadIcon className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        )}
        {!isLoading && !error && !imageUrl && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center">
             <ImageIcon className="w-20 h-20 text-gray-600 mb-4" />
            <p className="font-semibold">Your generated photo will appear here.</p>
            <p className="text-sm">Upload an image and click "Generate".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedImage;
