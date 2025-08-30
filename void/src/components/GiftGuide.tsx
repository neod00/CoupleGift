import React from 'react';

const GiftGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💝 커플 선물 가이드</h2>
      
      <div className="space-y-4">
        <div className="border-l-4 border-pink-400 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🎯 선물 선택 팁</h3>
          <ul className="text-gray-600 space-y-1">
            <li>• 상대방의 취미와 관심사를 고려하세요</li>
            <li>• 의미있는 메시지와 함께 전달하세요</li>
            <li>• 예산에 맞는 실용적인 선물을 선택하세요</li>
            <li>• 개인화된 요소를 추가해보세요</li>
          </ul>
        </div>
        
        <div className="border-l-4 border-blue-400 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">💡 인기 선물 카테고리</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>• 패션 & 액세서리</div>
            <div>• 뷰티 & 화장품</div>
            <div>• 전자제품</div>
            <div>• 홈 & 리빙</div>
            <div>• 취미 & 레저</div>
            <div>• 식품 & 음료</div>
          </div>
        </div>
        
        <div className="border-l-4 border-green-400 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🌟 특별한 날 추천</h3>
          <ul className="text-gray-600 space-y-1">
            <li>• 생일: 개인화된 선물 + 케이크</li>
            <li>• 기념일: 추억이 담긴 선물</li>
            <li>• 발렌타인데이: 로맨틱한 선물</li>
            <li>• 크리스마스: 따뜻한 겨울 선물</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-pink-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          💕 진심이 담긴 선물이 가장 소중합니다. 
          상대방을 생각하는 마음이 전해지는 선물을 선택해보세요!
        </p>
      </div>
    </div>
  );
};

export default GiftGuide;
