import React from 'react';
import { ImageIcon, DownloadIcon } from './IconComponents';

interface ImageResultDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  showOriginal: boolean;
  setShowOriginal: (show: boolean) => void;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-4 border-purple-500/50 rounded-full animate-pulse"></div>
      <div className="absolute inset-2 border-4 border-pink-500/50 rounded-full animate-pulse animation-delay-200"></div>
       <div className="absolute inset-4 border-4 border-teal-500/50 rounded-full animate-pulse animation-delay-400"></div>
    </div>
    <p className="mt-6 text-lg font-semibold text-gray-300 animate-pulse">AI is creating magic...</p>
    <p className="text-sm text-gray-500">This may take a moment.</p>
  </div>
);

const Placeholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
    <ImageIcon className="w-16 h-16 mb-4" />
    <h3 className="text-lg font-semibold text-gray-400">Your generated image will appear here</h3>
    <p className="text-sm">Enter a prompt to generate an image, or upload one to start editing.</p>
  </div>
);

export const ImageResultDisplay: React.FC<ImageResultDisplayProps> = ({ 
  originalImage, 
  generatedImage, 
  isLoading, 
  error,
  showOriginal,
  setShowOriginal
}) => {
  const displayedImage = showOriginal ? originalImage : generatedImage;

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    // Check if the image is SVG or PNG to set the correct extension
    const isSvg = generatedImage.startsWith('data:image/svg+xml');
    link.download = isSvg ? 'salarx-ai-response.svg' : 'salarx-ai-generated.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30 flex-grow flex flex-col shadow-lg relative min-h-[300px] lg:min-h-0">
        <div className="flex justify-between items-center mb-3 z-10">
             <h2 className="text-lg font-semibold text-gray-200">Result</h2>
             <div className="flex items-center gap-2">
                {generatedImage && originalImage && (
                    <div className="flex items-center bg-gray-900/70 p-1 rounded-full border border-gray-700">
                        <button 
                            onClick={() => setShowOriginal(true)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${showOriginal ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            Original
                        </button>
                        <button 
                            onClick={() => setShowOriginal(false)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${!showOriginal ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            Edited
                        </button>
                    </div>
                )}
                {generatedImage && !isLoading && (
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-full bg-gray-900/70 border border-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white transition-colors"
                        aria-label="Download generated image"
                    >
                        <DownloadIcon className="w-5 h-5" />
                    </button>
                )}
             </div>
        </div>
      <div className="relative flex-grow flex items-center justify-center bg-black/30 rounded-lg overflow-hidden">
        <div className={`w-full h-full transition-filter duration-500 ease-in-out ${isLoading ? 'filter blur-md' : 'filter-none'}`}>
            {!error && displayedImage && (
                <img
                    key={displayedImage} 
                    src={displayedImage}
                    alt="Result"
                    className={`w-full h-full object-contain ${!isLoading ? 'animate-fade-in' : ''}`}
                />
            )}
            {!error && !displayedImage && <Placeholder />}
            {error && (
                <div className="w-full h-full flex items-center justify-center text-center text-red-400 p-4">
                    <div>
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <LoadingState />
          </div>
        )}
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .transition-filter {
            transition: filter 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};