import React from 'react';

const GiftGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 연령대별 선물 가이드 */}
      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-6 text-center">👥 연령대별 선물 가이드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💑 20-30대 커플</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 감성적인 디자인 제품</li>
              <li>• 체험형 선물 (데이트, 여행)</li>
              <li>• 개인화된 액세서리</li>
              <li>• 취미 관련 선물</li>
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">👨‍👩‍👧‍👦 40-50대 부부</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 실용적이면서도 고급스러운 제품</li>
              <li>• 건강 관련 선물</li>
              <li>• 홈 인테리어 제품</li>
              <li>• 취미 활동 도구</li>
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">👨‍🦳 60-70대 장년층</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 건강 관리 제품</li>
              <li>• 편안한 생활용품</li>
              <li>• 전통적인 선물</li>
              <li>• 가족과의 추억 선물</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 계절별 선물 추천 */}
      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-6 text-center">🌱 계절별 선물 추천</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🌸 봄 (3-5월)</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">🌷</span>
                <div>
                  <h4 className="font-medium">화이트데이 (3월 14일)</h4>
                  <p className="text-sm">초콜릿, 과자, 화장품, 액세서리</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🎂</span>
                <div>
                  <h4 className="font-medium">봄 생일</h4>
                  <p className="text-sm">꽃, 가드닝 도구, 봄 패션 아이템</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">☀️ 여름 (6-8월)</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">💝</span>
                <div>
                  <h4 className="font-medium">여름 기념일</h4>
                  <p className="text-sm">여행용품, 수영용품, 여름 패션</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🎂</span>
                <div>
                  <h4 className="font-medium">여름 생일</h4>
                  <p className="text-sm">레저용품, 여름 액티비티</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🍂 가을 (9-11월)</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">🌕</span>
                <div>
                  <h4 className="font-medium">추석</h4>
                  <p className="text-sm">전통 선물, 건강식품, 가족용품</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🎂</span>
                <div>
                  <h4 className="font-medium">가을 생일</h4>
                  <p className="text-sm">독서용품, 따뜻한 패션 아이템</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">❄️ 겨울 (12-2월)</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">🎄</span>
                <div>
                  <h4 className="font-medium">크리스마스</h4>
                  <p className="text-sm">장난감, 전자제품, 따뜻한 의류</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">💝</span>
                <div>
                  <h4 className="font-medium">발렌타인데이 (2월 14일)</h4>
                  <p className="text-sm">초콜릿, 꽃, 액세서리, 향수</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 예산별 선물 아이디어 */}
      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-6 text-center">💰 예산별 선물 아이디어</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-4xl mb-4">💚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">1-5만원</h3>
            <ul className="space-y-2 text-sm text-gray-700 text-left">
              <li>• 개인화된 액세서리</li>
              <li>• 취미 관련 소품</li>
              <li>• 감성적인 디자인 제품</li>
              <li>• 건강 간식 세트</li>
            </ul>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <div className="text-4xl mb-4">💛</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5-15만원</h3>
            <ul className="space-y-2 text-sm text-gray-700 text-left">
              <li>• 고급스러운 화장품</li>
              <li>• 실용적인 전자제품</li>
              <li>• 브랜드 액세서리</li>
              <li>• 체험형 선물권</li>
            </ul>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-4xl mb-4">💜</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">15만원 이상</h3>
            <ul className="space-y-2 text-sm text-gray-700 text-left">
              <li>• 럭셔리 브랜드 제품</li>
              <li>• 여행 패키지</li>
              <li>• 고급 전자제품</li>
              <li>• 프리미엄 체험</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 선물 선택 팁 */}
      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-6 text-center">💡 선물 선택 실전 팁</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">✅ 해야 할 것들</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>상대방의 취미와 관심사를 미리 파악하기</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>선물의 실용성과 의미를 모두 고려하기</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>개인화된 메시지나 의미를 담기</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>선물 포장과 전달 방법도 신경 쓰기</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">❌ 피해야 할 것들</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>본인 취향만 고려한 선물 선택</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>너무 비싸거나 저렴한 선물</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>실용성이 전혀 없는 선물</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>마지막 순간에 급하게 선택한 선물</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 특별한 선물 아이디어 */}
      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-6 text-center">✨ 특별한 선물 아이디어</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">🎨 개인화된 선물</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 이름이 새겨진 액세서리</li>
              <li>• 사진이 들어간 커스텀 제품</li>
              <li>• 개인 취향에 맞춘 맞춤 제작품</li>
              <li>• 추억이 담긴 스크랩북</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">🌟 경험 선물</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 쿠킹 클래스나 워크샵</li>
              <li>• 스파나 마사지 이용권</li>
              <li>• 콘서트나 공연 티켓</li>
              <li>• 여행 패키지</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftGuide; 