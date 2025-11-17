
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageResultDisplay } from './components/ImageResultDisplay';
import { PromptControls } from './components/PromptControls';
import { editImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

// Fix: Manually define types for the Web Speech API to resolve TypeScript errors,
// as these types are not included in the standard TypeScript DOM library.
interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}


// Handle browser differences for SpeechRecognition API
const SpeechRecognition: SpeechRecognitionStatic | undefined = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface OriginalImage {
  file: File;
  base64: string; // This is a full Data URL
}

const App: React.FC = () => {
  const [originalImages, setOriginalImages] = useState<OriginalImage[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setPrompt(prevPrompt => (prevPrompt ? prevPrompt.trim() + ' ' : '') + transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      setError(`Voice recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError(null); // Clear previous errors
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  const handleImageUpload = useCallback(async (files: FileList) => {
    try {
      setError(null);
      const newImagesPromises = Array.from(files)
        .filter(file => file.type.startsWith('image/'))
        .map(async (file) => {
        const base64 = await fileToBase64(file);
        return { file, base64 };
      });

      const newImages = await Promise.all(newImagesPromises);

      setOriginalImages(prevImages => [...prevImages, ...newImages]);
      setGeneratedImage(null);
       if (newImages.length > 0) {
          setShowOriginal(true);
      }
    } catch (err) {
      setError('Failed to read image file(s).');
      console.error(err);
    }
  }, []);

  const handleRemoveImage = (indexToRemove: number) => {
    setOriginalImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageParts = originalImages.map(img => {
        const originalImageData = img.base64.split(',');
        const base64Data = originalImageData?.[1] ?? null;
        const mimeType = img.file.type ?? null;
        return { base64Data, mimeType };
      });

<<<<<<< HEAD
      // Call the service (now connected to SambaNova API)
=======
>>>>>>> 7a769c05113dd62edce7b1ebd15670c2609e382f
      const resultBase64 = await editImage(
        imageParts, 
        prompt
      );
      
<<<<<<< HEAD
      // Create a data URL for the result
      // Note: This will be an SVG placeholder with the text response embedded
      const resultDataUrl = `data:image/svg+xml;base64,${resultBase64}`;
=======
      // Gemini API for image generation returns PNG format.
      const resultDataUrl = `data:image/png;base64,${resultBase64}`;
>>>>>>> 7a769c05113dd62edce7b1ebd15670c2609e382f
      setGeneratedImage(resultDataUrl);
      setShowOriginal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerate = prompt.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <Header />
      <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 mt-8 flex-grow">
        <div className="lg:w-1/2 flex flex-col gap-6">
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            images={originalImages}
            onImageRemove={handleRemoveImage}
          />
          <PromptControls
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            disabled={!canGenerate}
            isListening={isListening}
            onVoiceClick={handleToggleListening}
            voiceTypingSupported={!!SpeechRecognition}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <ImageResultDisplay
            originalImage={originalImages.length === 1 ? originalImages[0].base64 : null}
            generatedImage={generatedImage}
            isLoading={isLoading}
            error={error}
            showOriginal={showOriginal}
            setShowOriginal={setShowOriginal}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
