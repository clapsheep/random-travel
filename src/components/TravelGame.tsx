import React, { useState, useMemo } from "react";
import { SpinWheel } from "./SpinWheel";
import { ResultCard } from "./ResultCard";
import { gameSteps } from "../data/gameSteps";
import {
  initializeGameState,
  canProceedToNextStep,
  getDestinationOptions,
  determineFinalDestination,
} from "../utils/gameLogic";
import type { GameState, SelectionOption } from "../types/travel";

export function TravelGame(): React.JSX.Element {
  const [gameState, setGameState] = useState<GameState>(initializeGameState());

  // 현재 단계의 옵션들을 동적으로 계산
  const currentStepOptions = useMemo(() => {
    const currentStep = gameSteps[gameState.currentStep];

    if (currentStep.type === "destination" && gameState.selections.region) {
      // 지역이 선택된 경우 해당 지역의 장소들을 가져옴
      return getDestinationOptions(gameState.selections.region);
    }

    return currentStep.options;
  }, [gameState.currentStep, gameState.selections.region]);

  const handleOptionSelect = (option: SelectionOption): void => {
    const currentStep = gameSteps[gameState.currentStep];

    // 현재 단계에 맞는 선택 저장
    const newSelections = {
      ...gameState.selections,
      [currentStep.id]: option.value,
    };

    setGameState((prev) => ({
      ...prev,
      selections: newSelections,
      isSpinning: false,
    }));

    // 자동 진행 제거 - 사용자가 다음 버튼을 눌러야 진행
  };

  const handleNextStep = (): void => {
    if (canProceedToNextStep(gameState.currentStep, gameState.selections)) {
      if (gameState.currentStep < gameSteps.length - 1) {
        setGameState((prev) => ({
          ...prev,
          currentStep: prev.currentStep + 1,
        }));
      } else {
        // 마지막 단계 - 최종 여행지 결정
        const finalDestination = determineFinalDestination(
          gameState.selections
        );
        setGameState((prev) => ({
          ...prev,
          finalDestination: finalDestination || undefined,
        }));
      }
    }
  };

  const handlePrevStep = (): void => {
    if (gameState.currentStep > 0) {
      const prevStep = gameState.currentStep - 1;

      // 이전 단계로 가면서 해당 단계부터의 모든 선택을 제거
      const newSelections = { ...gameState.selections };

      // 이전 단계부터 현재까지의 모든 선택 제거
      for (let i = prevStep; i < gameSteps.length; i++) {
        delete newSelections[gameSteps[i].id];
      }

      setGameState((prev) => ({
        ...prev,
        currentStep: prevStep,
        selections: newSelections,
      }));
    }
  };

  const handleRestart = (): void => {
    setGameState(initializeGameState());
  };

  const handleSpin = (): void => {
    setGameState((prev) => ({ ...prev, isSpinning: true }));
  };

  const handleSpinComplete = (): void => {
    setGameState((prev) => ({ ...prev, isSpinning: false }));
  };

  // 게임이 완료되었는지 확인
  const isGameComplete = gameState.finalDestination !== undefined;

  if (isGameComplete) {
    return (
      <ResultCard
        destination={gameState.finalDestination!}
        selections={gameState.selections}
        onRestart={handleRestart}
      />
    );
  }

  const currentStep = gameSteps[gameState.currentStep];
  const canProceed = canProceedToNextStep(
    gameState.currentStep,
    gameState.selections
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-4 flex justify-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-pink-300 shadow-lg bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/bg.jpg')",
              }}
            ></div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 px-2">
            💕 부부지양이 함께하는
            <br className="sm:hidden" /> 1박2일 복불복 여름휴가!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            운명의 여행지와 조건들을 룰렛으로 결정해보세요!
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex space-x-1 sm:space-x-2">
            {gameSteps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  index <= gameState.currentStep ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 현재 단계 정보 */}
        <div className="text-center mb-4 sm:mb-6 px-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {currentStep.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {currentStep.description}
          </p>
        </div>

        {/* 선택된 옵션들 표시 */}
        {Object.keys(gameState.selections).length > 0 && (
          <div className="mb-4 sm:mb-6 px-2">
            <h3 className="text-center text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
              ✨ 지금까지 선택된 내용
            </h3>
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              {Object.entries(gameState.selections).map(([key, value]) => {
                const step = gameSteps.find((s) => s.id === key);
                let option;
                if (key === "destination" && gameState.selections.region) {
                  // destination의 경우 해당 지역의 옵션들에서 찾기
                  const destinationOptions = getDestinationOptions(
                    gameState.selections.region
                  );
                  option = destinationOptions.find((o) => o.value === value);
                } else {
                  option = step?.options.find((o) => o.value === value);
                }
                return (
                  <div
                    key={key}
                    className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-2 sm:px-4 sm:py-3 rounded-full border-2 border-purple-200"
                  >
                    <span className="text-base sm:text-xl">{option?.icon}</span>
                    <span className="font-bold text-purple-800 text-sm sm:text-base">
                      {option?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 스핀 휠 */}
        <div className="flex justify-center mb-8">
          <SpinWheel
            options={currentStepOptions}
            onSelect={handleOptionSelect}
            isSpinning={gameState.isSpinning}
            onSpinComplete={handleSpinComplete}
            onSpinStart={handleSpin}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 px-2">
          {/* 이전 단계 버튼 */}
          <button
            onClick={handlePrevStep}
            disabled={gameState.currentStep === 0}
            className={`font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-200 shadow-2xl border-2 border-white transform ${
              gameState.currentStep === 0
                ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white hover:scale-105 active:scale-95"
            }`}
          >
            ← 이전 단계
          </button>

          {/* 다음 단계 버튼 */}
          <button
            onClick={handleNextStep}
            disabled={!canProceed}
            className={`font-bold py-3 px-4 sm:py-4 sm:px-10 rounded-xl text-base sm:text-xl transition-all duration-200 shadow-2xl border-2 border-white transform ${
              !canProceed
                ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 active:scale-95"
            }`}
          >
            {gameState.currentStep === gameSteps.length - 1
              ? "여행지 결정하기"
              : "다음 단계 →"}
          </button>
        </div>
      </div>
    </div>
  );
}
