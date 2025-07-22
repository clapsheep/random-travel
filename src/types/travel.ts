export interface TravelDestination {
  id: string;
  name: string;
  region: string;
  category: TravelCategory;
  budget: BudgetRange;
  description: string;
  imageUrl: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const TravelCategory = {
  NATURE: "자연",
  CULTURE: "문화",
  FOOD: "맛집",
  HEALING: "힐링",
  ADVENTURE: "모험",
  ROMANTIC: "로맨틱",
} as const;

export type TravelCategory =
  (typeof TravelCategory)[keyof typeof TravelCategory];

export const BudgetRange = {
  LOW: "저예산",
  MEDIUM: "보통",
  HIGH: "고급",
} as const;

export type BudgetRange = (typeof BudgetRange)[keyof typeof BudgetRange];

export interface SelectionStep {
  id: string;
  title: string;
  description: string;
  options: SelectionOption[];
  type: "region" | "destination" | "accommodation" | "budget" | "final";
}

export interface SelectionOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
  weight?: number; // 룰렛에서 당첨 확률 조정용
}

export interface GameState {
  currentStep: number;
  selections: Record<string, string>;
  isSpinning: boolean;
  finalDestination?: TravelDestination;
}
