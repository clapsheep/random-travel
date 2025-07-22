import type {
  TravelDestination,
  GameState,
  SelectionOption,
} from "../types/travel";
import { allTravelDestinations } from "../data/destinations";
import { gameSteps } from "../data/gameSteps";

/**
 * 선택된 조건에 맞는 여행지를 필터링합니다
 */
export function filterDestinations(
  selections: Record<string, string>
): TravelDestination[] {
  const { region, destination } = selections;

  return allTravelDestinations.filter((destinationItem: TravelDestination) => {
    // 지역이 선택되었다면 반드시 일치해야 함
    if (region && destinationItem.region !== region) {
      return false;
    }

    // 특정 여행지가 선택되었다면 반드시 일치해야 함
    if (destination && destinationItem.name !== destination) {
      return false;
    }

    return true;
  });
}

/**
 * 특정 지역의 장소들을 가져옵니다
 */
export function getDestinationsByRegion(region: string): TravelDestination[] {
  return allTravelDestinations.filter(
    (destination: TravelDestination) => destination.region === region
  );
}

/**
 * 지역별 장소들을 SelectionOption 형태로 변환합니다
 */
export function getDestinationOptions(region: string): SelectionOption[] {
  const destinations = getDestinationsByRegion(region);
  return destinations.map((destination) => ({
    id: destination.id,
    label: destination.name,
    value: destination.name,
    icon: getCategoryIcon(destination.category),
  }));
}

/**
 * 카테고리에 따른 아이콘을 반환합니다
 */
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    자연: "🌿",
    문화: "🏛️",
    맛집: "🍽️",
    힐링: "🧘",
    모험: "🗺️",
    로맨틱: "💕",
  };
  return iconMap[category] || "📍";
}

/**
 * 랜덤하게 여행지를 선택합니다
 */
export function selectRandomDestination(
  destinations: TravelDestination[]
): TravelDestination | null {
  if (destinations.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * destinations.length);
  return destinations[randomIndex];
}

/**
 * 스핀 휠 애니메이션을 위한 랜덤 지연 시간을 생성합니다
 */
export function getRandomSpinDelay(): number {
  return Math.random() * 2000 + 1000; // 1-3초
}

/**
 * 게임 상태를 초기화합니다
 */
export function initializeGameState(): GameState {
  return {
    currentStep: 0,
    selections: {},
    isSpinning: false,
    finalDestination: undefined,
  };
}

/**
 * 다음 단계로 진행할 수 있는지 확인합니다
 */
export function canProceedToNextStep(
  currentStep: number,
  selections: Record<string, string>
): boolean {
  // 현재 단계가 유효한지 확인
  if (currentStep < 0 || currentStep >= gameSteps.length) {
    return false;
  }

  const currentStepId = gameSteps[currentStep].id;
  const hasSelection = selections[currentStepId] !== undefined;

  console.log("canProceedToNextStep 디버그:", {
    currentStep,
    currentStepId,
    selections,
    hasSelection,
  });

  return hasSelection;
}

/**
 * 최종 여행지를 결정합니다
 */
export function determineFinalDestination(
  selections: Record<string, string>
): TravelDestination | null {
  console.log("determineFinalDestination 디버그:", {
    selections,
  });

  const filteredDestinations = filterDestinations(selections);

  console.log("필터링된 여행지들:", {
    count: filteredDestinations.length,
    destinations: filteredDestinations.map((d) => ({
      name: d.name,
      region: d.region,
    })),
  });

  if (filteredDestinations.length === 0) {
    console.log("조건에 맞는 여행지가 없어서 전체에서 랜덤 선택");
    // 조건에 맞는 여행지가 없으면 전체에서 랜덤 선택
    return selectRandomDestination(allTravelDestinations);
  }

  const finalDestination = selectRandomDestination(filteredDestinations);
  console.log("최종 선택된 여행지:", finalDestination?.name);

  return finalDestination;
}
