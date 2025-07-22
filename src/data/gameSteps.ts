import type { SelectionStep } from "../types/travel";

export const gameSteps: SelectionStep[] = [
  {
    id: "region",
    title: "어느 지역으로 여행가고 싶어요?",
    description: "전국 13개 지역 중 운명의 여행지를 선택해보세요!",
    type: "region",
    options: [
      { id: "gangwon", label: "강원도", value: "강원도", icon: "⛰️" },
      { id: "chungbuk", label: "충청북도", value: "충청북도", icon: "🍃" },
      { id: "chungnam", label: "충청남도", value: "충청남도", icon: "🌾" },
      { id: "daejeon", label: "대전광역시", value: "대전광역시", icon: "🏮" },
      { id: "gyeongbuk", label: "경상북도", value: "경상북도", icon: "🏛️" },
      { id: "daegu", label: "대구광역시", value: "대구광역시", icon: "🏙️" },
      { id: "gyeongnam", label: "경상남도", value: "경상남도", icon: "🏖️" },
      { id: "busan", label: "부산광역시", value: "부산광역시", icon: "🌊" },
      { id: "ulsan", label: "울산광역시", value: "울산광역시", icon: "🏭" },
      { id: "jeonbuk", label: "전라북도", value: "전라북도", icon: "🍊" },
      { id: "jeonnam", label: "전라남도", value: "전라남도", icon: "🌺" },
      {
        id: "jeju",
        label: "제주특별자치도",
        value: "제주특별자치도",
        icon: "🏝️",
      },
    ],
  },
  {
    id: "destination",
    title: "해당 지역의 어떤 장소를 가고 싶어요?",
    description: "선택한 지역의 특별한 1박2일 여행지를 결정해보세요!",
    type: "destination",
    options: [], // 동적으로 채워질 예정
  },
  {
    id: "accommodation",
    title: "어떤 숙소에서 머물고 싶어요?",
    description: "하룻밤을 보낼 숙소 타입을 선택해보세요!",
    type: "accommodation",
    options: [
      { id: "hotel", label: "호텔", value: "호텔", icon: "🏨", weight: 3 },
      { id: "pension", label: "펜션", value: "펜션", icon: "🏡", weight: 3 },
      { id: "motel", label: "모텔", value: "모텔", icon: "🏩", weight: 2 },
      {
        id: "guesthouse",
        label: "게스트하우스",
        value: "게스트하우스",
        icon: "🏠",
        weight: 2,
      },
      {
        id: "camping",
        label: "캠핑/글램핑",
        value: "캠핑",
        icon: "🏕️",
        weight: 2,
      },
      { id: "chabak", label: "차박", value: "차박", icon: "🚐", weight: 1 },
    ],
  },
  {
    id: "budget",
    title: "회비는 얼마로 할까요?",
    description: "1인당 여행 회비를 룰렛으로 결정해보세요!",
    type: "budget",
    options: [
      { id: "budget_5", label: "5만원", value: "5만원", icon: "💰" },
      { id: "budget_10", label: "10만원", value: "10만원", icon: "💵" },
      { id: "budget_15", label: "15만원", value: "15만원", icon: "💸" },
      { id: "budget_20", label: "20만원", value: "20만원", icon: "💎" },
    ],
  },
];
