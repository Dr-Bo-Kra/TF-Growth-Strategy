export type ScenarioInputs = {
  tfAverageFte: number;
  tfUtilisation: number;
  tfPrice: number;
  tfGrossMargin: number;
  tfOpexChange: number;
  faAverageFte: number;
  faUtilisation: number;
  faPrice: number;
  faGrossMargin: number;
  faOpexChange: number;
  aiAdoption: number;
  aiPrice: number;
  aiGrossMargin: number;
  aiOpexChange: number;
  synergyRealisation: number;
};

export const approvedScenario: ScenarioInputs = {
  tfAverageFte: 241.9167,
  tfUtilisation: 100,
  tfPrice: 100,
  tfGrossMargin: 49.7314,
  tfOpexChange: 0,
  faAverageFte: 711.4167,
  faUtilisation: 88,
  faPrice: 100,
  faGrossMargin: 30.227,
  faOpexChange: 0,
  aiAdoption: 30,
  aiPrice: 100,
  aiGrossMargin: 54.581,
  aiOpexChange: 0,
  synergyRealisation: 100,
};

const baseline = {
  tfRevenue: 13.646870,
  tfGrossProfit: 6.786778,
  tfOpex: 5.619404,
  faRevenue: 25.672456,
  faGrossProfit: 7.759914,
  faOpex: 4.155400,
  aiRevenue: 2.133705,
  aiGrossProfit: 1.164630,
  aiOpex: 0.575085,
  synergy: 1.650000,
  consolidationRevenue: 0.905943,
  consolidationGrossProfit: 0.586887,
  sharedConsolidationCost: 0.952535,
};

const tfFreezeFte = 205;
const tfFreezeRevenue = 10.700;
const tfRevenuePerIncrementalFte = (baseline.tfRevenue - tfFreezeRevenue) / (approvedScenario.tfAverageFte - tfFreezeFte);
const freezeCommittedCost = 0.271;

export function calculateScenario(input: ScenarioInputs) {
  const tfCapacityRevenue = tfFreezeRevenue + (input.tfAverageFte - tfFreezeFte) * tfRevenuePerIncrementalFte;
  const tfRevenue = Math.max(0, tfCapacityRevenue * input.tfUtilisation / 100 * input.tfPrice / 100);
  const tfGrossProfit = tfRevenue * input.tfGrossMargin / 100;
  const tfCommittedCost = input.tfAverageFte < approvedScenario.tfAverageFte
    ? (approvedScenario.tfAverageFte - input.tfAverageFte) / (approvedScenario.tfAverageFte - tfFreezeFte) * freezeCommittedCost
    : 0;
  const tfOpex = baseline.tfOpex + tfCommittedCost + input.tfOpexChange;
  const tfEbitda = tfGrossProfit - tfOpex;

  const faRevenue = baseline.faRevenue * input.faAverageFte / approvedScenario.faAverageFte * input.faUtilisation / approvedScenario.faUtilisation * input.faPrice / 100;
  const faGrossProfit = faRevenue * input.faGrossMargin / 100;
  const faOpex = baseline.faOpex + input.faOpexChange;
  const faEbitda = faGrossProfit - faOpex;

  const aiRevenue = baseline.aiRevenue * input.aiAdoption / approvedScenario.aiAdoption * input.aiPrice / 100;
  const aiGrossProfit = aiRevenue * input.aiGrossMargin / 100;
  const aiOpex = baseline.aiOpex + input.aiOpexChange;
  const aiEbitda = aiGrossProfit - aiOpex;

  const synergy = baseline.synergy * input.synergyRealisation / 100;
  const groupRevenue = tfRevenue + faRevenue + aiRevenue + baseline.consolidationRevenue;
  const groupGrossProfit = tfGrossProfit + faGrossProfit + aiGrossProfit + baseline.consolidationGrossProfit;
  const preSynergyEbitda = tfEbitda + faEbitda - baseline.sharedConsolidationCost;
  const groupEbitda = preSynergyEbitda + synergy + aiEbitda;
  const groupOpex = groupGrossProfit - groupEbitda;

  return {
    entities: {
      TF: { revenue: tfRevenue, grossProfit: tfGrossProfit, opex: tfOpex, ebitda: tfEbitda },
      FA: { revenue: faRevenue, grossProfit: faGrossProfit, opex: faOpex, ebitda: faEbitda },
      "AI Digital": { revenue: aiRevenue, grossProfit: aiGrossProfit, opex: aiOpex, ebitda: aiEbitda },
    },
    group: { revenue: groupRevenue, grossProfit: groupGrossProfit, opex: groupOpex, ebitda: groupEbitda, margin: groupRevenue ? groupEbitda / groupRevenue * 100 : 0 },
    bridge: { preSynergyEbitda, synergy, aiEbitda, sharedConsolidationCost: baseline.sharedConsolidationCost },
    mechanics: { tfCapacityRevenue, tfRevenuePerIncrementalFte, tfCommittedCost },
  };
}

export const approvedResult = calculateScenario(approvedScenario);

export type GoalMetric = "groupEbitda" | "groupRevenue" | "tfEbitda" | "faEbitda" | "aiEbitda";

export function metricValue(input: ScenarioInputs, metric: GoalMetric) {
  const result = calculateScenario(input);
  if (metric === "groupEbitda") return result.group.ebitda;
  if (metric === "groupRevenue") return result.group.revenue;
  if (metric === "tfEbitda") return result.entities.TF.ebitda;
  if (metric === "faEbitda") return result.entities.FA.ebitda;
  return result.entities["AI Digital"].ebitda;
}

export function solveGoal(input: ScenarioInputs, metric: GoalMetric, driver: keyof ScenarioInputs, target: number, min: number, max: number) {
  const atMin = metricValue({ ...input, [driver]: min }, metric);
  const atMax = metricValue({ ...input, [driver]: max }, metric);
  const lowResult = Math.min(atMin, atMax);
  const highResult = Math.max(atMin, atMax);
  if (target < lowResult || target > highResult) return { reachable: false, value: null, result: null, range: [lowResult, highResult] as const };
  const increasing = atMax >= atMin;
  let low = min;
  let high = max;
  for (let index = 0; index < 70; index++) {
    const middle = (low + high) / 2;
    const outcome = metricValue({ ...input, [driver]: middle }, metric);
    if ((outcome < target) === increasing) low = middle;
    else high = middle;
  }
  const value = (low + high) / 2;
  return { reachable: true, value, result: metricValue({ ...input, [driver]: value }, metric), range: [lowResult, highResult] as const };
}
