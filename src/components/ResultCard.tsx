import React from "react";
import type { TravelDestination } from "../types/travel";

interface ResultCardProps {
  destination: TravelDestination;
  selections: Record<string, string>;
  onRestart: () => void;
}

export function ResultCard({
  destination,
  selections,
  onRestart,
}: ResultCardProps): React.JSX.Element {
  // 선택 항목들을 이모지와 함께 매핑
  const getSelectionIcon = (key: string): string => {
    switch (key) {
      case "region":
        return "📍";
      case "destination":
        return "🏖️";
      case "accommodation":
        return "🏨";
      case "budget":
        return "💰";
      default:
        return "✨";
    }
  };

  const getSelectionLabel = (key: string): string => {
    switch (key) {
      case "region":
        return "여행 지역";
      case "destination":
        return "여행지";
      case "accommodation":
        return "숙소";
      case "budget":
        return "회비";
      default:
        return key;
    }
  };

  return (
    <div
      className="min-h-screen py-4 sm:py-8 relative"
      style={{
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎊</div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 px-2 drop-shadow-lg">
            💕 부부지양의 복불복
            <br className="sm:hidden" /> 여름휴가 확정!
          </h1>
          <p className="text-base sm:text-lg text-white px-2 drop-shadow-md">
            룰렛이 결정한 운명의 여행 계획이 완성되었습니다!
          </p>
        </div>

        {/* 메인 결과 카드 */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden mb-6 sm:mb-8">
          {/* 헤더 그라데이션 */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 sm:p-8 text-white text-center">
            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🏖️</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
              {destination.name}
            </h2>
            <p className="text-lg sm:text-xl opacity-90">
              {destination.region}
            </p>
          </div>

          {/* 선택된 항목들 요약 */}
          <div className="p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
              🎯 최종 선택 결과
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* 실제 결정된 여행지 정보를 우선으로 표시 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border-2 border-purple-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-2xl sm:text-3xl">📍</span>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      여행 지역
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-purple-800">
                      {destination.region}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border-2 border-purple-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-2xl sm:text-3xl">🏖️</span>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      여행지
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-purple-800">
                      {destination.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* 나머지 선택된 항목들 (지역, 여행지 제외) */}
              {Object.entries(selections)
                .filter(([key]) => key !== "region" && key !== "destination")
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border-2 border-purple-200"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-2xl sm:text-3xl">
                        {getSelectionIcon(key)}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm text-gray-600 font-medium">
                          {getSelectionLabel(key)}
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-purple-800">
                          {value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* 여행지 상세 정보 */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                📋 여행지 정보
              </h4>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                {destination.description}
              </p>

              <div className="flex flex-wrap gap-1 sm:gap-2">
                {destination.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={onRestart}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                🔄 다시 뽑기
              </button>

              <button
                onClick={() => {
                  const { lat, lng } = destination.coordinates;
                  window.open(
                    `https://map.naver.com/?lat=${lat}&lng=${lng}&zoom=15`,
                    "_blank"
                  );
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                🗺️ 지도에서 보기
              </button>
            </div>
          </div>
        </div>

        {/* 추가 메시지 */}
        <div className="text-center px-2">
          <p className="text-base sm:text-lg text-white drop-shadow-md">
            즐거운 여행 되세요! 💕✈️
          </p>
        </div>
      </div>
    </div>
  );
}
