
import React from 'react';
import { WandIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl text-center">
      <div className="inline-flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-purple-500/30 shadow-lg">
        <WandIcon className="w-8 h-8 text-purple-400" />
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            SalarX AI
            </h1>
            <p className="text-sm text-gray-400 mt-1">Create and edit images with AI-powered text prompts.</p>
        </div>
      </div>
    </header>
  );
};
