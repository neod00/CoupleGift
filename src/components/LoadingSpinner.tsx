import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="card text-center">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-border"></div>
          <div className="absolute top-1 left-1 animate-spin rounded-full h-14 w-14 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border"></div>
          <div className="absolute top-2 left-2 animate-pulse rounded-full h-12 w-12 bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-2xl">🎁</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold gradient-text mb-3">
          AI가 선물을 추천하고 있습니다...
        </h3>
        
        <p className="text-gray-600 text-lg mb-4">
          잠시만 기다려주세요. 최적의 선물을 찾고 있어요! ✨
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span>분석 중...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 