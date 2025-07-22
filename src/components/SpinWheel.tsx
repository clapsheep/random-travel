import React, { useState, useRef, useEffect } from "react";
import type { SelectionOption } from "../types/travel";

interface SpinWheelProps {
  options: SelectionOption[];
  onSelect: (option: SelectionOption) => void;
  isSpinning: boolean;
  onSpinComplete: () => void;
  onSpinStart: () => void;
}

export function SpinWheel({
  options,
  onSelect,
  isSpinning,
  onSpinComplete,
  onSpinStart,
}: SpinWheelProps): React.JSX.Element {
  const [wheelRotation, setWheelRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const spinningOptionsRef = useRef<SelectionOption[]>([]);

  // options가 변경될 때 selectedIndex 초기화
  useEffect(() => {
    setSelectedIndex(null);
    setWheelRotation(0);
    setIsTransitioning(false);
  }, [options]);

  // weight를 고려한 가중치 기반 옵션 생성
  const createWeightedOptions = (
    originalOptions: SelectionOption[]
  ): SelectionOption[] => {
    const weightedOptions: SelectionOption[] = [];

    originalOptions.forEach((option) => {
      const weight = option.weight || 1; // 기본 가중치는 1
      // weight만큼 해당 옵션을 반복 추가
      for (let i = 0; i < weight; i++) {
        weightedOptions.push({
          ...option,
          id: `${option.id}_${i}`, // 중복 id 방지
        });
      }
    });

    return weightedOptions;
  };

  // 휠 회전각에서 12시 방향 화살표가 가리키는 옵션 계산
  const getSelectedOptionFromWheelRotation = (
    rotation: number,
    optionsList: SelectionOption[]
  ): number => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const segmentAngle = 360 / optionsList.length;

    // 12시 방향을 기준으로 계산
    // 휠이 시계방향으로 회전하므로, 옵션들은 반시계방향으로 이동
    // 따라서 화살표 기준에서 역방향으로 계산
    const arrowPointsAt = (360 - normalizedRotation) % 360;
    const index = Math.floor(arrowPointsAt / segmentAngle) % optionsList.length;

    return index;
  };

  useEffect(() => {
    if (isSpinning) {
      spinningOptionsRef.current = createWeightedOptions(options);

      // 먼저 휠을 0도로 즉시 초기화 (transition 없이)
      setIsTransitioning(false);
      setWheelRotation(0);
      setSelectedIndex(null);

      // 짧은 지연 후 회전 시작
      const initTimer = setTimeout(() => {
        // transition 활성화
        setIsTransitioning(true);

        // 랜덤 회전각 계산 (3-5바퀴 + 랜덤)
        const minRotation = 1080; // 3바퀴
        const maxRotation = 1800; // 5바퀴
        const randomRotation =
          minRotation + Math.random() * (maxRotation - minRotation);

        setWheelRotation(randomRotation);

        // 회전 완료 후 결과 처리
        const completionTimer = setTimeout(() => {
          const finalIndex = getSelectedOptionFromWheelRotation(
            randomRotation,
            spinningOptionsRef.current
          );
          setSelectedIndex(finalIndex);

          if (spinningOptionsRef.current[finalIndex]) {
            const selectedWeightedOption =
              spinningOptionsRef.current[finalIndex];
            // 원본 옵션을 찾아서 반환 (weight로 복제된 것이 아닌 원본)
            const originalOption =
              options.find((opt) =>
                selectedWeightedOption.id.startsWith(opt.id)
              ) || selectedWeightedOption;
            onSelect(originalOption);
          }
          onSpinComplete();
          setIsTransitioning(false);
        }, 4000); // 4초간 회전

        return () => clearTimeout(completionTimer);
      }, 50); // 50ms 지연으로 초기화 후 회전 시작

      return () => {
        clearTimeout(initTimer);
      };
    } else {
      spinningOptionsRef.current = [];
    }
  }, [isSpinning, onSelect, onSpinComplete, options]);

  const handleSpinClick = () => {
    if (!isSpinning) {
      onSpinStart();
    }
  };

  const displayOptions =
    isSpinning && spinningOptionsRef.current.length > 0
      ? spinningOptionsRef.current
      : createWeightedOptions(options);

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-8">
      <div className="relative w-72 h-72 sm:w-96 sm:h-96">
        {/* 고정된 12시 방향 아래쪽 화살표 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 sm:-translate-y-2 z-30">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] sm:border-l-[20px] sm:border-r-[20px] sm:border-t-[40px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
        </div>

        {/* 회전하는 룰렛 휠 */}
        <div
          className="w-full h-full rounded-full border-8 border-gray-800 shadow-2xl overflow-hidden"
          style={{
            transform: `rotate(${wheelRotation}deg)`,
            transition: isTransitioning
              ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)"
              : "none",
          }}
        >
          {displayOptions.map((option, index) => {
            const segmentAngle = 360 / displayOptions.length;
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;

            // 색상 교대로 적용
            const colors = [
              { bg: "#EF4444", text: "#FFFFFF" }, // 빨강
              { bg: "#3B82F6", text: "#FFFFFF" }, // 파랑
              { bg: "#10B981", text: "#FFFFFF" }, // 초록
              { bg: "#F59E0B", text: "#FFFFFF" }, // 주황
              { bg: "#8B5CF6", text: "#FFFFFF" }, // 보라
              { bg: "#EC4899", text: "#FFFFFF" }, // 핑크
            ];
            const color = colors[index % colors.length];

            // SVG 경로 계산
            const centerX = 192; // 48 * 4 (w-96 = 384px / 2)
            const centerY = 192;
            const outerRadius = 184;
            const innerRadius = 40;

            const startAngleRad = ((startAngle - 90) * Math.PI) / 180; // -90도로 12시 방향 시작
            const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

            const x1 = centerX + innerRadius * Math.cos(startAngleRad);
            const y1 = centerY + innerRadius * Math.sin(startAngleRad);
            const x2 = centerX + outerRadius * Math.cos(startAngleRad);
            const y2 = centerY + outerRadius * Math.sin(startAngleRad);

            const x3 = centerX + outerRadius * Math.cos(endAngleRad);
            const y3 = centerY + outerRadius * Math.sin(endAngleRad);
            const x4 = centerX + innerRadius * Math.cos(endAngleRad);
            const y4 = centerY + innerRadius * Math.sin(endAngleRad);

            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

            const pathData = [
              `M ${x1} ${y1}`,
              `L ${x2} ${y2}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
              `L ${x4} ${y4}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
              "Z",
            ].join(" ");

            // 텍스트 각도 계산
            const textAngle = startAngle + segmentAngle / 2 - 90;

            return (
              <svg
                key={option.id}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 384 384"
              >
                <path
                  d={pathData}
                  fill={color.bg}
                  stroke="#1F2937"
                  strokeWidth="2"
                />
                {/* 중심을 향한 직선 방향으로 글자 배치 */}
                <g>
                  {/* 아이콘 - 바깥쪽 시작점 */}
                  <text
                    x={
                      centerX +
                      (outerRadius - 25) * Math.cos((textAngle * Math.PI) / 180)
                    }
                    y={
                      centerY +
                      (outerRadius - 25) * Math.sin((textAngle * Math.PI) / 180)
                    }
                    fill={color.text}
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    transform={`rotate(${-wheelRotation}, ${
                      centerX +
                      (outerRadius - 25) * Math.cos((textAngle * Math.PI) / 180)
                    }, ${
                      centerY +
                      (outerRadius - 25) * Math.sin((textAngle * Math.PI) / 180)
                    })`}
                  >
                    {option.icon}
                  </text>

                  {/* 세그먼트 중앙선을 따라 바깥→안쪽으로 세로 배치 */}
                  {option.label.split("").map((char, charIndex) => {
                    // 세그먼트 중앙선을 따라 바깥에서 안쪽으로 배치
                    const charRadius = outerRadius - 50 - charIndex * 15; // 15px씩 중심으로 이동
                    const charX =
                      centerX +
                      charRadius * Math.cos((textAngle * Math.PI) / 180);
                    const charY =
                      centerY +
                      charRadius * Math.sin((textAngle * Math.PI) / 180);

                    return (
                      <text
                        key={charIndex}
                        x={charX}
                        y={charY}
                        fill={color.text}
                        fontSize="12"
                        fontWeight="semibold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none select-none"
                        transform={`rotate(${-wheelRotation}, ${charX}, ${charY})`}
                      >
                        {char}
                      </text>
                    );
                  })}
                </g>
              </svg>
            );
          })}
        </div>

        {/* 중앙 고정점 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 rounded-full border-2 sm:border-4 border-white shadow-2xl z-20 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-inner"></div>
        </div>

        {/* SPIN 버튼 */}
        <button
          onClick={handleSpinClick}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 disabled:from-gray-400 disabled:to-gray-500 text-gray-900 font-black text-xs rounded-full border-2 sm:border-3 border-gray-900 shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 z-30"
        >
          <div className="flex flex-col items-center">
            <div className="text-sm sm:text-lg leading-none">
              {isSpinning ? "🎲" : "🎯"}
            </div>
            <div className="text-[8px] sm:text-[10px] font-bold leading-none">
              {isSpinning ? "..." : "SPIN"}
            </div>
          </div>
        </button>
      </div>

      {/* 결과 표시 */}
      <div className="mt-4 sm:mt-6 text-center px-2">
        {selectedIndex !== null ? (
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 sm:p-6 shadow-lg max-w-sm mx-auto">
            <div className="text-3xl sm:text-4xl mb-2">
              {displayOptions[selectedIndex]?.icon}
            </div>
            <div className="text-lg sm:text-xl font-bold text-green-800 mb-1">
              당첨!
            </div>
            <div className="text-base sm:text-lg text-green-700">
              {displayOptions[selectedIndex]?.label}
            </div>
          </div>
        ) : isSpinning ? (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 sm:p-6 shadow-lg max-w-sm mx-auto">
            <div className="animate-spin text-3xl sm:text-4xl mb-2">🎰</div>
            <div className="text-base sm:text-lg font-bold text-yellow-800">
              룰렛이 돌아가는 중...
            </div>
          </div>
        ) : (
          <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-4 sm:p-6 shadow-lg max-w-sm mx-auto">
            <div className="text-3xl sm:text-4xl mb-2">🎯</div>
            <div className="text-base sm:text-lg font-bold text-blue-800">
              SPIN 버튼을 눌러주세요!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
