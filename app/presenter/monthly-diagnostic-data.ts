export type MonthStatus = "Actual" | "Forecast";
export type DiagnosticMetric = "EBITDA" | "Revenue" | "Gross profit" | "OPEX";

export type MonthlyResult = {
  id: string;
  label: string;
  financialYear: "FY25/26" | "FY26/27";
  status: MonthStatus;
  headcount: number;
  revenue: number;
  grossProfit: number;
  opex: number;
  ebitda: number;
  source: string;
};

const source = "2607-TF Budget Forecast FY2026-27 Actuals @July 2026 · TF Only 290526";

// Monetary values are stored in dollars. FY25/26 and July FY26/27 are actuals.
// August 2026 onward remains forecast and is visibly labelled as such in the UI.
export const tfMonthlyResults: MonthlyResult[] = [
  {id:"2025-07",label:"Jul 2025",financialYear:"FY25/26",status:"Actual",headcount:170,revenue:772700.0406,grossProfit:363572.0921,opex:382400.9589,ebitda:-18828.8668,source:`${source} · C4, C19, C39, C115, C120`},
  {id:"2025-08",label:"Aug 2025",financialYear:"FY25/26",status:"Actual",headcount:185,revenue:811464.4645,grossProfit:374224.1443,opex:346297.0831,ebitda:27927.0612,source:`${source} · D4, D19, D39, D115, D120`},
  {id:"2025-09",label:"Sep 2025",financialYear:"FY25/26",status:"Actual",headcount:186,revenue:818813.1659,grossProfit:387404.5323,opex:373477.6005,ebitda:13926.9318,source:`${source} · E4, E19, E39, E115, E120`},
  {id:"2025-10",label:"Oct 2025",financialYear:"FY25/26",status:"Actual",headcount:189,revenue:853435.4003,grossProfit:415793.4441,opex:372105.5248,ebitda:43687.9193,source:`${source} · F4, F19, F39, F115, F120`},
  {id:"2025-11",label:"Nov 2025",financialYear:"FY25/26",status:"Actual",headcount:196,revenue:968247.9640,grossProfit:520360.9640,opex:594534.8733,ebitda:-74173.9092,source:`${source} · G4, G19, G39, G115, G120`},
  {id:"2025-12",label:"Dec 2025",financialYear:"FY25/26",status:"Actual",headcount:198,revenue:844979.9100,grossProfit:398995.8967,opex:359524.7706,ebitda:39471.1261,source:`${source} · H4, H19, H39, H115, H120`},
  {id:"2026-01",label:"Jan 2026",financialYear:"FY25/26",status:"Actual",headcount:202,revenue:894785.9500,grossProfit:459957.8200,opex:373358.1700,ebitda:86599.6500,source:`${source} · I4, I19, I39, I115, I120`},
  {id:"2026-02",label:"Feb 2026",financialYear:"FY25/26",status:"Actual",headcount:204,revenue:820326.2500,grossProfit:391128.3963,opex:333612.4250,ebitda:57515.9713,source:`${source} · J4, J19, J39, J115, J120`},
  {id:"2026-03",label:"Mar 2026",financialYear:"FY25/26",status:"Actual",headcount:212,revenue:864623.7877,grossProfit:439268.9177,opex:365887.2797,ebitda:73381.6380,source:`${source} · K4, K19, K39, K115, K120`},
  {id:"2026-04",label:"Apr 2026",financialYear:"FY25/26",status:"Actual",headcount:214,revenue:884132.9814,grossProfit:460026.9828,opex:340042.7195,ebitda:119984.2633,source:`${source} · L4, L19, L39, L115, L120`},
  {id:"2026-05",label:"May 2026",financialYear:"FY25/26",status:"Actual",headcount:214,revenue:859578.9300,grossProfit:445658.4800,opex:358083.1300,ebitda:87575.3500,source:`${source} · M4, M19, M39, M115, M120`},
  {id:"2026-06",label:"Jun 2026",financialYear:"FY25/26",status:"Actual",headcount:195,revenue:922817.6260,grossProfit:481026.1660,opex:264873.0766,ebitda:216153.0894,source:`${source} · N4, N19, N39, N115, N120`},
  {id:"2026-07",label:"Jul 2026",financialYear:"FY26/27",status:"Actual",headcount:205,revenue:893418.0058,grossProfit:407378.7658,opex:456810.2850,ebitda:-49431.5192,source:`${source} · V4, V19, V39, V115, V120`},
  {id:"2026-08",label:"Aug 2026",financialYear:"FY26/27",status:"Forecast",headcount:215,revenue:1011228.8060,grossProfit:512258.5705,opex:481876.3874,ebitda:30382.1831,source:`${source} · W4, W19, W39, W115, W120`},
  {id:"2026-09",label:"Sep 2026",financialYear:"FY26/27",status:"Forecast",headcount:223,revenue:1050386.4060,grossProfit:530145.7705,opex:421902.1905,ebitda:108243.5801,source:`${source} · X4, X19, X39, X115, X120`},
  {id:"2026-10",label:"Oct 2026",financialYear:"FY26/27",status:"Forecast",headcount:231,revenue:1089544.0060,grossProfit:548032.9705,opex:507849.6821,ebitda:40183.2885,source:`${source} · Y4, Y19, Y39, Y115, Y120`},
  {id:"2026-11",label:"Nov 2026",financialYear:"FY26/27",status:"Forecast",headcount:239,revenue:1128701.6060,grossProfit:565920.1705,opex:451589.0892,ebitda:114331.0813,source:`${source} · Z4, Z19, Z39, Z115, Z120`},
  {id:"2026-12",label:"Dec 2026",financialYear:"FY26/27",status:"Forecast",headcount:242,revenue:1143385.7060,grossProfit:572627.8705,opex:439773.8787,ebitda:132853.9918,source:`${source} · AA4, AA19, AA39, AA115, AA120`},
  {id:"2027-01",label:"Jan 2027",financialYear:"FY26/27",status:"Forecast",headcount:244,revenue:1153175.1060,grossProfit:577099.6705,opex:445145.9303,ebitda:131953.7403,source:`${source} · AB4, AB19, AB39, AB115, AB120`},
  {id:"2027-02",label:"Feb 2027",financialYear:"FY26/27",status:"Forecast",headcount:246,revenue:1162964.5060,grossProfit:581571.4705,opex:487058.6048,ebitda:94512.8657,source:`${source} · AC4, AC19, AC39, AC115, AC120`},
  {id:"2027-03",label:"Mar 2027",financialYear:"FY26/27",status:"Forecast",headcount:253,revenue:1197227.4060,grossProfit:597222.7705,opex:498720.1943,ebitda:98502.5762,source:`${source} · AD4, AD19, AD39, AD115, AD120`},
  {id:"2027-04",label:"Apr 2027",financialYear:"FY26/27",status:"Forecast",headcount:261,revenue:1236385.0060,grossProfit:615109.9705,opex:468667.2244,ebitda:146442.7462,source:`${source} · AE4, AE19, AE39, AE115, AE120`},
  {id:"2027-05",label:"May 2027",financialYear:"FY26/27",status:"Forecast",headcount:268,revenue:1270647.9060,grossProfit:630761.2705,opex:483622.8286,ebitda:147138.4420,source:`${source} · AF4, AF19, AF39, AF115, AF120`},
  {id:"2027-06",label:"Jun 2027",financialYear:"FY26/27",status:"Forecast",headcount:276,revenue:1309805.5060,grossProfit:648648.4705,opex:476387.6129,ebitda:172260.8576,source:`${source} · AG4, AG19, AG39, AG115, AG120`},
];

export type AccountMovement = {label:string; base:number; current:number; source:string; group:"Revenue"|"Cost of revenue"|"OPEX"};

// Ranked June-to-July movements from the revised workbook. Revenue movements
// flow positively to EBITDA; cost-of-revenue and OPEX movements flow inversely.
export const juneToJulyMovements: AccountMovement[] = [
  {label:"Marketing",base:-26436,current:93972.73,group:"OPEX",source:`${source} · N69 → V69`},
  {label:"Director travel",base:-45929.72,current:21675.85,group:"OPEX",source:`${source} · N112 → V112`},
  {label:"Australia revenue",base:572601.62,current:517999.9415,group:"Revenue",source:`${source} · N7 → V7`},
  {label:"AI consulting fees",base:0,current:37500,group:"Cost of revenue",source:`${source} · N27 → V27`},
  {label:"Other revenue",base:62882.27,current:86333.3236,group:"Revenue",source:`${source} · N9 → V9`},
  {label:"Sales-team salaries",base:44869.34,current:25855.795,group:"OPEX",source:`${source} · N72 → V72`},
  {label:"UK revenue",base:247850.9160,current:265751.6207,group:"Revenue",source:`${source} · N8 → V8`},
  {label:"QGCC revenue",base:39482.82,current:23333.12,group:"Revenue",source:`${source} · N12 → V12`},
  {label:"Annual-leave expense",base:0,current:-10870.9,group:"OPEX",source:`${source} · N58 → V58`},
  {label:"Outsourced-staff PF / allowances",base:39673.46,current:49398.75,group:"Cost of revenue",source:`${source} · N26 → V26`},
];

export const metricValue = (month:MonthlyResult, metric:DiagnosticMetric) => {
  if(metric === "Revenue") return month.revenue;
  if(metric === "Gross profit") return month.grossProfit;
  if(metric === "OPEX") return month.opex;
  return month.ebitda;
};

export function buildDiagnostic(baseMonth:MonthlyResult,currentMonth:MonthlyResult){
  const grossProfitImpact=currentMonth.grossProfit-baseMonth.grossProfit;
  const opexImpact=-(currentMonth.opex-baseMonth.opex);
  const ebitdaMovement=currentMonth.ebitda-baseMonth.ebitda;
  const accountMovements=baseMonth.id==="2026-06"&&currentMonth.id==="2026-07"
    ? juneToJulyMovements.map(item=>{const change=item.current-item.base;return {...item,change,ebitdaImpact:item.group==="Revenue"?change:-change}}).sort((a,b)=>Math.abs(b.ebitdaImpact)-Math.abs(a.ebitdaImpact))
    : [];
  return {grossProfitImpact,opexImpact,ebitdaMovement,accountMovements,reconciles:Math.abs(grossProfitImpact+opexImpact-ebitdaMovement)<1};
}
