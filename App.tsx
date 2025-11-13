
import React, { useState, useCallback } from 'react';
import { generatePassportPhoto } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import ImageUploader from './components/ImageUploader';
import GeneratedImage from './components/GeneratedImage';
import { SparklesIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImageFile(file);
    setOriginalImagePreview(URL.createObjectURL(file));
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleGenerateClick = async () => {
    if (!originalImageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await fileToBase64(originalImageFile);
      const mimeType = originalImageFile.type;
      
      const generatedBase64 = await generatePassportPhoto(base64Image, mimeType);
      
      setGeneratedImage(`data:image/png;base64,${generatedBase64}`);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. The AI may be busy or the image could not be processed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          AI Passport Photo Generator
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Upload a photo and instantly get a professional passport-sized version.
        </p>
      </header>

      <main className="w-full max-w-6xl flex-grow flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={originalImagePreview} />
          <GeneratedImage imageUrl={generatedImage} isLoading={isLoading} error={error} />
        </div>

        <div className="w-full max-w-md mt-8">
          <button
            onClick={handleGenerateClick}
            disabled={!originalImageFile || isLoading}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <SparklesIcon className="w-6 h-6" />
            <span className="text-lg font-bold">
              {isLoading ? 'Generating...' : 'Generate Passport Photo'}
            </span>
          </button>
        </div>
      </main>
      
      <footer className="w-full max-w-6xl text-center text-gray-500 mt-12 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Passport Photo Generator. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
