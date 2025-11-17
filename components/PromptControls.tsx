
import React from 'react';
import { WandIcon, MicrophoneIcon } from './IconComponents';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
  isListening: boolean;
  onVoiceClick: () => void;
  voiceTypingSupported: boolean;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ 
  prompt, 
  setPrompt, 
  onSubmit, 
  isLoading, 
  disabled,
  isListening,
  onVoiceClick,
  voiceTypingSupported
}) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30 shadow-md">
      <h2 className="text-lg font-semibold text-gray-200 mb-3">Editing Prompt</h2>
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g., "Add a retro filter" or "Make it look like a watercolor painting"'
          className="w-full h-24 p-3 pr-14 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors duration-200 resize-none"
          disabled={isLoading}
        />
        {voiceTypingSupported && (
            <button
              onClick={onVoiceClick}
              disabled={isLoading}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                ${isListening 
                  ? 'bg-purple-600 text-white animate-pulse shadow-lg shadow-purple-500/50' 
                  : 'bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white'
                }`
              }
              aria-label={isListening ? 'Stop listening' : 'Start voice typing'}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={disabled || isLoading}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <WandIcon className="w-5 h-5" />
            Generate
          </>
        )}
      </button>
    </div>
  );
};
