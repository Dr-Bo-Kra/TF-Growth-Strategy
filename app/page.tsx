"use client";
import "./drilldowns.css";
import "./growth.css";
import "./risk-response.css";
import "./priority-evidence.css";
import "./source-preview.css";
import "./moat-evidence.css";
import "./budget-different.css";
import "./serial-legibility.css";
import "./body-legibility.css";
import "./header-legibility.css";
import "./typography-audit.css";
import "./kpi-hover.css";
import "./synergy-realisation.css";
import "./people-readiness.css";
import "./strategy-chat.css";
import "./integration-framework.css";
import "./ai-cost-envelope.css";
import "./rail-contrast.css";
import "./responsive-system.css";
import "./typography-system.css";
import "./scenario-simulator.css";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { integrationActivities } from "./integration-activities";
import ScenarioSimulator from "./scenario-simulator";

const nav = [
  ["thesis", "01", "Thesis"], ["trajectory", "02", "Trajectory"],
  ["engines", "03", "Growth engines"], ["people", "04", "People readiness"],
  ["scenarios", "05", "Scenarios"], ["operating", "06", "Operating plan"],
  ["integration", "07", "Integration"], ["decisions", "08", "Board decisions"],
] as const;

const money = (value: number) => `$${value.toFixed(1)}M`;

const drilldowns: Record<string, { eyebrow:string; title:string; value:string; summary:string; rows:[string,string][]; assumption:string; action:string; source:string }> = {
  "target-revenue": { eyebrow:"Group trajectory", title:"FY28/29 group revenue", value:"$72.5M", summary:"The revised executive case more than doubles the FY25/26 base through three distinct growth engines.", rows:[["FA / FLA","$34.6M"],["Talent Formula","$26.8M"],["AI Digital","$3.4M"],["Other / acquisition uplift","$7.6M"]], assumption:"29.5% group revenue CAGR from the $33.3M base.", action:"Review entity performance quarterly against the bridge, not only the consolidated total.", source:"Executive analysis · Section 07 full P&L summary" },
  "target-margin": { eyebrow:"Profitability", title:"FY28/29 EBITDA margin", value:"23.8%", summary:"Margin expansion is driven by FA operating leverage, AI contribution and the recurring synergy register.", rows:[["FY25/26","9.3%"],["FY26/27","12.3%"],["FY27/28","23.5%"],["FY28/29","23.8%"]], assumption:"Includes $1.65M annual post-integration synergies.", action:"Track pre- and post-synergy EBITDA separately so delivery slippage remains visible.", source:"Executive analysis · Four-year financial trajectory" },
  "revenue-25": { eyebrow:"FY2025/26 base", title:"Group revenue", value:"$33.3M", summary:"The opening year is the reference base for the four-year growth case.", rows:[["FA / FLA","$23.7M"],["Talent Formula","$9.6M"],["AI Digital","—"],["Group EBITDA","$3.1M"]], assumption:"The consolidated table reports $33.336M before chart rounding.", action:"Use this base consistently when calculating growth and margin expansion.", source:"Executive analysis · Section 07 full P&L summary" },
  "revenue-27": { eyebrow:"FY2027/28", title:"Group revenue", value:"$58.7M", summary:"The third year reflects scaled FA delivery, stronger TF geographic contribution and a larger AI Digital revenue base.", rows:[["FA / FLA","$29.9M"],["Talent Formula","$19.0M"],["AI Digital","$3.1M"],["Consolidated total","$58.7M"]], assumption:"The consolidated table reports $58.684M before chart rounding.", action:"Reconcile entity delivery and acquisition contribution to the consolidated total each quarter.", source:"Executive analysis · Section 07 full P&L summary" },
  "ebitda-25": { eyebrow:"FY2025/26 base", title:"Post-synergy EBITDA", value:"$3.1M", summary:"The base year establishes the starting profitability of the combined operating case.", rows:[["Post-synergy EBITDA","$3.114M"],["EBITDA margin","9.3%"],["Annual synergies","—"],["Group revenue","$33.336M"]], assumption:"No recurring integration synergy is included in the base year.", action:"Keep the base-year result unchanged when assessing future operating leverage.", source:"Executive analysis · Sections 07 and 15" },
  "ebitda-27": { eyebrow:"FY2027/28", title:"Post-synergy EBITDA", value:"$13.8M", summary:"Profitability accelerates as FA operating leverage, AI contribution and recurring synergies compound.", rows:[["Pre-synergy EBITDA","$12.158M"],["Annual synergies","$1.650M"],["Post-synergy EBITDA","$13.808M"],["EBITDA margin","23.5%"]], assumption:"The chart rounds the reported $13.808M result to $13.8M.", action:"Separate underlying EBITDA from realised synergies in Board reporting.", source:"Executive analysis · Sections 07 and 10" },
  "ebitda-28": { eyebrow:"FY2028/29", title:"Post-synergy EBITDA", value:"$17.3M", summary:"The final forecast year captures the mature operating leverage of the combined group.", rows:[["Pre-synergy EBITDA","$15.617M"],["Annual synergies","$1.650M"],["Post-synergy EBITDA","$17.267M"],["EBITDA margin","23.8%"]], assumption:"The chart rounds the reported $17.267M result to $17.3M.", action:"Validate that margin growth is supported by entity performance, not only consolidation effects.", source:"Executive analysis · Sections 07, 10 and 15" },
  "synergies": { eyebrow:"Integration", title:"Annual synergy register", value:"$1.65M", summary:"An itemised operating register replaces the single-line budget assumption and assigns accountable owners.", rows:[["Shared services","$480k"],["Technology platforms","$320k"],["Facilities","$240k"],["AI cross-sell","$336k"],["Procurement + recruitment","$274k"]], assumption:"Approximately $690k is expected in Q1-Q2, with the remainder in H2.", action:"Approve named owners and include realised-versus-plan reporting in every Board pack.", source:"Executive analysis · Synergy register" },
  "client-base": { eyebrow:"Distribution", title:"Combined client base", value:"410", summary:"The existing relationships form the distribution advantage for AI Digital, but revenue is recognised as each segment activates.", rows:[["TF clients","50 · 15 target conversions"],["FA clients","180 · 55 target conversions"],["Backroom clients","180 · 54 target conversions"],["Expected year-end active","124 customers"]], assumption:"The 30% adoption assumption produces 124 year-end active customers; Backroom activates from month 7 in the KPI budget model.", action:"Report eligible, pitched, signed, implemented and live customers separately each month.", source:"KPI Analysis · AI Digital corrected and verified" },
  "revenue-26": { eyebrow:"FY2026/27", title:"Group revenue", value:"$42.0M", summary:"The revised case grows 26.1% year on year, led by TF expansion, FA scale and the first year of AI Digital.", rows:[["FA / FLA","$25.7M"],["Talent Formula","$13.3M"],["AI Digital","$2.1M"],["Year-on-year growth","+26.1%"]], assumption:"FA revenue commences in September; Backroom contribution follows the February acquisition.", action:"Use the $42.0M revised case as the board baseline; do not blend it with the earlier dashboard case.", source:"Executive analysis · Group KPIs" },
  "gp-26": { eyebrow:"FY2026/27", title:"Group gross profit", value:"$15.8M", summary:"The group mix produces a 37.6% gross margin, with AI Digital providing the highest unit margin.", rows:[["Group GP margin","37.6%"],["FA GP margin","30.2%"],["TF GP margin","51.5%"],["AI GP margin","54.6%"]], assumption:"Mix shifts materially in later years as FA digital revenue and AI adoption scale.", action:"Monitor GP per FTE and pricing uplift alongside the headline margin.", source:"Executive analysis · Full P&L summary" },
  "ebitda-26": { eyebrow:"FY2026/27", title:"Full-group post-synergy EBITDA", value:"$6.07M", summary:"The full-group result combines approved TF+FA pre-synergy EBITDA, the annual synergy register and separate AI Digital EBITDA, producing a 14.5% margin.", rows:[["FA EBITDA","$3.604M"],["TF EBITDA","$1.183M"],["Consolidation / shared costs","($0.952M)"],["TF + FA pre-synergy EBITDA","$3.835M"],["Annual synergy register","$1.650M"],["TF + FA post-synergy EBITDA","$5.485M"],["AI Digital EBITDA","$0.590M"],["Full-group EBITDA","$6.075M"],["Group margin","14.5%"]], assumption:"AI Digital is separate from the $5.485M TF+FA post-synergy result. The entity EBITDA values reconcile to TF+FA through a $952k consolidation/shared-cost adjustment.", action:"Report FA, TF, consolidation/shared costs, synergies and AI Digital as separate bridge lines every month.", source:"Budget Dashboard FY2026/27 + AI Pricing Model" },
  "fa-engine": { eyebrow:"Growth engine A", title:"FA / FLA FY26/27 revenue", value:"$25.7M", summary:"FA is the group scale engine and the largest contributor to consolidated revenue.", rows:[["FY25/26 revenue","$23.7M"],["FY26/27 revenue","$25.7M"],["FY28/29 revenue","$34.6M"],["FY28/29 EBITDA margin","28.4%"]], assumption:"Headcount reaches 761 in FY26/27 and facilities commitments remain staged.", action:"Alert the Board at 5% and 10% headcount misses; tie leases to 80% attainment.", source:"Dashboard + executive analysis · FA plan" },
  "tf-engine": { eyebrow:"Growth engine B", title:"Talent Formula FY26/27 revenue", value:"$13.3M", summary:"TF is the fastest-growing service engine, powered by geographic expansion and recruitment capability.", rows:[["FY25/26 revenue","$9.6M"],["FY26/27 revenue","$13.3M"],["FY28/29 revenue","$26.8M"],["Four-year CAGR","41.3%"]], assumption:"The UK plan requires a 79% year-on-year increase and stronger named pipeline coverage.", action:"Appoint the UK Growth Lead and reach 1.5× qualified coverage before Q2 lock.", source:"Dashboard + executive analysis · TF plan" },
  "ai-engine": { eyebrow:"Growth engine C", title:"AI Digital FY26/27 revenue", value:"$2.13M", summary:"AI Digital is the highest-margin engine and converts the client base into recurring platform economics.", rows:[["Gross profit","$1.165M"],["Gross margin","54.6%"],["EBITDA","$590k"],["June run-rate MRR","$242,483"]], assumption:"Expected case assumes 124 phased activations: TF and FA from September, Backroom from January.", action:"Gate incremental opex against the monthly conversion funnel and treat September MRR below $150k as an early warning.", source:"AI Pricing Model · Budget-verified totals" },
  "billing-utilisation": { eyebrow:"Benchmark-grounded · high confidence", title:"FLA billing utilisation", value:">88%", summary:"The target sits inside the 85-90% professional-services range, but rapid hiring will depress the blended measure.", rows:[["Target",">88% fully ramped"],["Calculation","Billed days ÷ available days"],["Baseline","Est. 82-85% · validate"],["Owner","COO"]], assumption:"Report blended utilisation and fully-ramped utilisation (>60 days on billing) separately so hiring success is not mistaken for delivery failure.", action:"Review both measures weekly, rebalance work, accelerate allocation and investigate any fully-ramped team below target.", source:"AI Pricing Model · page 3 · FLA Billing Utilisation" },
  "client-retention": { eyebrow:"Benchmark-grounded · high confidence", title:"Client retention", value:">92%", summary:"The group target sits between the 84% professional-services average and the 90-96% range reported for top accounting firms.", rows:[["Group target",">92%"],["FA target",">94%"],["TF target",">88%"],["Baseline","Est. 85-90% · validate"]], assumption:"FA and TF must be reported separately; a blended result can hide deterioration in one entity.", action:"Confirm FY25/26 actuals, track reasons for exit, maintain 120-day renewal plans and escalate at-risk accounts through executive sponsors.", source:"AI Pricing Model · page 5 · Client Retention Rate" },
  "net-revenue-retention": { eyebrow:"Operating guardrail 03", title:"Net revenue retention", value:">105%", summary:"Retention alone is insufficient; the same client cohort must expand enough to offset contraction and churn and still grow by at least 5%.", rows:[["Source threshold",">105%"],["Calculation","Closing cohort revenue ÷ opening cohort revenue"],["Management cadence","Monthly by entity"],["Accountable owner","CCO / CFO"]], assumption:"The threshold is the FY26/27 internal target in Section 11 and includes upsell and expansion within the same client cohort.", action:"Track renewal, contraction and expansion separately; assign cross-sell plays for FA, TF and AI Digital; intervene where cohort NRR falls below 100%.", source:"Executive analysis · Section 11 operational KPIs" },
  "pipeline": { eyebrow:"Sales heuristic · baseline unvalidated", title:"Qualified pipeline coverage", value:"1.5×", summary:"This is a late-stage weighted-pipeline control, not a published benchmark; the current UK estimate is only 1.25×.", rows:[["Target","1.5× late stage"],["UK baseline","1.25×"],["Formula","Weighted pipeline ÷ target"],["Owner","CCO / Sales leads"]], assumption:"At a 40% win rate, 2.5× unweighted coverage is required on average; 1.5× is defensible only for consistently defined 70%+ confidence opportunities.", action:"Standardise stages across TF and FA, export 12 months of CRM actuals and report weekly movement in named opportunities.", source:"AI Pricing Model · page 6 · Pipeline Coverage Ratio" },
  "win-rate": { eyebrow:"Aspirational · benchmark range", title:"Proposal win rate", value:">40%", summary:"The target is at the top of competitive-bid performance and the bottom of the professional-services range.", rows:[["Target",">40%"],["Baseline","Est. 30-35% · validate"],["Formula","Closed-won ÷ proposals"],["Owner","CCO / Sales leads"]], assumption:"Report cold new-logo, referral and existing-account expansion win rates separately; upsell should exceed 60%.", action:"Export CRM actuals, run win-loss reviews, tighten qualification and coach by market and sales motion.", source:"AI Pricing Model · page 6 · Win Rate" },
  "fla-turnover": { eyebrow:"Benchmark-grounded · high confidence", title:"FLA employee turnover", value:"<18%", summary:"The target is within the 15-22% accounting norm and materially below generalist offshore BPO attrition.", rows:[["Target","<18% annualised"],["Baseline","Est. 20-25% · validate"],["Formula","Exits ÷ average headcount"],["Owner","CPO / COO"]], assumption:"Every 1% of turnover is roughly six exits at 620 FTEs; confirm the FY25/26 actual and reason-for-exit mix before presenting.", action:"Use attrition heatmaps, stay interviews, workload and pay reviews, and tighten toward <15% over two years if the baseline supports it.", source:"AI Pricing Model · page 3 · FLA Employee Turnover" },
  "time-to-recruit": { eyebrow:"Budget necessity · aggressive", title:"FLA time to recruit", value:"<28 days", summary:"This target is faster than the 38-45 day finance-role norm because the budget requires 141 net FLA additions in twelve months.", rows:[["Target","<28 days"],["Baseline","Est. 35-45 days · validate"],["Hiring need","620 → 761 FTEs"],["Owner","CPO / Recruitment lead"]], assumption:"The target is achievable only if TF's recruitment engine supports FLA hiring from day one; otherwise 35-40 days is more realistic.", action:"Pre-build talent pools, run about 12 concurrent priority roles, set interview SLAs and escalate roles ageing beyond 21 days.", source:"AI Pricing Model · page 3 · Time to Recruit (FLA)" },
  "gp-fla": { eyebrow:"Internal calculation · budget-derived", title:"GP per FLA FTE", value:"$10.2k", summary:"The expected decline from $11.1k reflects the mid-year cost of adding 141 FTEs before they reach full utilisation.", rows:[["FY25/26","$11.1k"],["FY26/27 target","$10.2k"],["Formula","$7.760M GP ÷ 761"],["Owner","COO / CFO"]], assumption:"Declining GP/FTE is acceptable during the ramp; continued decline after headcount stabilises is a warning signal.", action:"Track monthly alongside ramped utilisation and require the expected productivity inflection in FY27/28.", source:"AI Pricing Model · page 4 · GP per FLA FTE" },
  "gp-tf": { eyebrow:"Internal calculation · budget-derived", title:"GP per TF FTE", value:"$22.1k", summary:"The decline from $26.3k is the earliest signal of TF margin compression as headcount grows faster than billing rates.", rows:[["FY25/26","$26.3k"],["FY26/27 target","$22.1k"],["Formula","$6.848M GP ÷ ~310"],["Alert level","<$20k monthly"]], assumption:"No external benchmark exists for this operating profile.", action:"Use an annual July pricing review with 3-5% rate uplifts and intervene if monthly GP/FTE falls below $20k.", source:"AI Pricing Model · page 4 · GP per TF FTE" },
  "nrr-fa": { eyebrow:"Aspirational · managed-services benchmark", title:"FA managed-services NRR", value:">104%", summary:"Existing FA client revenue must expand by at least 4% through scope, headcount or service-line growth before new logos.", rows:[["Target",">104%"],["Baseline","Est. 100-102% · validate"],["Benchmark range","100-110%"],["Owner","CCO / CFO"]], assumption:"Below 100% means the existing base is shrinking and growth depends entirely on new-client acquisition.", action:"Track expansion, contraction and churn separately and run proactive account plans for every managed client.", source:"AI Pricing Model · page 5 · NRR - FA Managed Services" },
  "nrr-ai": { eyebrow:"Forward target · SaaS benchmark", title:"AI Digital NRR", value:">115%", summary:"Additional AI employees create the expansion lever, but NRR cannot be measured until FY27/28 because FY26/27 is the launch year.", rows:[["Forward target",">115%"],["FY26/27 proxy","Add-ons per active client"],["SaaS median","106%"],["Top quartile","120%+"]], assumption:"This is not a FY26/27 delivered KPI; monthly platform and AI-employee add-ons are the launch-year leading indicator.", action:"Track platform-only versus platform-plus-AI-employee customers from activation and prepare the first cohort NRR in FY27/28.", source:"AI Pricing Model · page 5 · NRR - AI Digital" },
  "ai-active-customers": { eyebrow:"Budget assumption · verified", title:"AI Digital active customers", value:"124", summary:"The 30% adoption target includes 55 FA, 15 TF and 54 Backroom customers, with Backroom activating from January 2027.", rows:[["FA + TF","55 + 15 customers"],["Backroom","54 customers · month 7"],["Total addressable","410 clients"],["Adoption target","30%"]], assumption:"The customer count is budget-verified, but adoption remains unvalidated without pilot data or signed LOIs.", action:"Require evidence from 20-30 warm conversations and report pitched, demo, trial, signed and live customers monthly.", source:"AI Pricing Model · page 7 · AI Digital Active Customers" },
  "ai-mrr": { eyebrow:"Direct from budget · verified", title:"AI Digital June run-rate MRR", value:"$242,483", summary:"The June run-rate comes directly from the budget worksheet after TF and FA activate in September and Backroom activates in January.", rows:[["Sep 26","$179,338"],["Jan-Jun 27","$242,483"],["Platform","$2,700 · all adopters"],["AI employee","$1,800 · 30% of adopters"]], assumption:"The budget uses segment-specific internally derived realised rates; the $15,000 setup fee applies to 30% of adopters and is excluded from MRR.", action:"Track actual MRR against the monthly build; treat September below $150k as the earliest conversion warning.", source:"AI Pricing Model · pages 7-8 · AI Digital MRR Run-Rate" },
};

const kpiEvidence: Record<string, { basis:string; publisher:string; finding:string; url?:string }> = {
  "client-retention": { basis:"Method benchmark; exact threshold is internal", publisher:"ChartMogul · Retention Benchmarks", finding:"Customer retention should be measured on a consistent year-over-year cohort basis. Results vary materially by customer profile, so 92% is a Board guardrail—not a universal industry figure.", url:"https://help.chartmogul.com/article/138-benchmarks" },
  "fla-turnover": { basis:"Labour-market context; not a like-for-like target", publisher:"U.S. Bureau of Labor Statistics · JOLTS 2025", finding:"BLS publishes professional-and-business-services separation rates and defines quits as voluntary departures. Geography and operating model differ, so FLA's own baseline must validate the 18% ceiling.", url:"https://www.bls.gov/news.release/jolts.t20.htm" },
  "billing-utilisation": { basis:"External context; exact threshold is internal", publisher:"SPI Research / Kantata · 2025 PS Maturity Benchmark", finding:"The cross-sector benchmark reports 68.9% billable utilisation. The 88% FLA threshold is therefore a high-volume, fully-ramped capacity target—not a professional-services average.", url:"https://get.kantata.com/rs/677-LEJ-696/images/2025-ps-maturity-benchmark.pdf" },
  "win-rate": { basis:"Direct external benchmark", publisher:"Loopio with APMP · 2024 RFP Trends & Benchmarks", finding:"Research across global proposal teams reported a 43% average RFP win rate for 2023. The >40% control is credible only when all decided proposals use the same denominator.", url:"https://link.loopio.com/hubfs/Content%20Pieces/Reports/2024%20RFP%20Trends%20%26%20Benchmarks%20Report%20%7C%20Loopio%20%28Digital%20Copy%29.pdf" },
  "pipeline": { basis:"External definition; exact multiple is internal", publisher:"Salesforce Help · Pipeline Coverage", finding:"Salesforce defines coverage as open pipeline divided by the remaining quota gap. At a 40% win rate, unweighted coverage requires 2.5×; 1.5× is defensible only for consistently weighted late-stage pipeline.", url:"https://help.salesforce.com/s/articleView?id=release-notes.rn_sales_features_core_forecasts_calculated_cols.htm&language=en_US&type=5" },
  "gp-fla": { basis:"Metric context only; value is internally calculated", publisher:"SPI Research / Kantata · 2025 PS Maturity Benchmark", finding:"External research links workforce utilisation and service profitability, but it does not provide a like-for-like GP-per-FLA figure. $10.2k comes solely from approved GP divided by planned FTE.", url:"https://get.kantata.com/rs/677-LEJ-696/images/2025-ps-maturity-benchmark.pdf" },
  "gp-tf": { basis:"Metric context only; value is internally calculated", publisher:"SPI Research / Kantata · 2025 PS Maturity Benchmark", finding:"Professional-services benchmarks support tracking productivity with margin and utilisation; they do not validate TF's exact $22.1k result, which depends on its service mix and workforce plan.", url:"https://get.kantata.com/rs/677-LEJ-696/images/2025-ps-maturity-benchmark.pdf" },
  "nrr-fa": { basis:"External metric standard; four-point uplift is internal", publisher:"ChartMogul · Retention Benchmarks", finding:"ChartMogul defines NRR as opening recurring revenue plus expansion less contraction and churn, and states that SaaS NRR ideally exceeds 100%. The 104% target adds an internal growth requirement.", url:"https://help.chartmogul.com/article/138-benchmarks" },
  "nrr-ai": { basis:"External principle; 115% is an internal stretch", publisher:"ChartMogul · SaaS Retention Report", finding:"Research across more than 2,500 SaaS businesses shows wide NRR variation. Above 100% means expansion offsets losses; 115% cannot be evidenced until AI Digital has a full renewal cohort.", url:"https://chartmogul.com/reports/saas-retention-the-new-normal/" },
  "time-to-recruit": { basis:"Direct external comparator", publisher:"SHRM · 2025 Recruiting Executives Benchmarking", finding:"SHRM reports a 44-calendar-day median time-to-fill for executive and nonexecutive roles. The <28-day KPI is therefore a materially faster internal target required by the FLA hiring ramp.", url:"https://www.shrm.org/content/dam/en/shrm/research/2025-recruiting-benchmarking-report.pdf" },
  "ai-active-customers": { basis:"No applicable external benchmark", publisher:"Evidence status · Internal adoption model", finding:"124 equals 30% modelled adoption across 410 eligible relationships. Board confidence must come from signed pilots, funnel conversion and live customers—not an unrelated market statistic." },
  "ai-mrr": { basis:"External metric definition; value is internal", publisher:"Stripe · Monthly Recurring Revenue explained", finding:"Stripe defines MRR as predictable monthly recurring income and distinguishes it from one-time setup charges. This supports the treatment of setup revenue, but not the 124-customer assumption.", url:"https://stripe.com/resources/more/what-is-monthly-recurring-revenue" },
};

type ChatMessage = { role:"assistant"|"user"; text:string; sources?:string[]; view?:"financial-changes" };
type VoiceRecognition = {lang:string;continuous:boolean;interimResults:boolean;start:()=>void;stop:()=>void;onresult:((event:{results:ArrayLike<{0:{transcript:string};isFinal:boolean}>})=>void)|null;onerror:((event:{error:string})=>void)|null;onend:(()=>void)|null};

const strategyThemes = [
  { keywords:["dashboard","dashboard comparison","dashboard says","dashboard numbers","reconcile dashboard","40.2","69.4","42.4","72.8","scope"], answer:"The figures reconcile by scope. The TF+FA consolidated model excludes AI Digital and reports $40.2M in FY26/27 and $69.4M in FY28/29. Adding Tech Consolidated / AI Digital produces full-group revenue of approximately $42.4M and $72.8M. The Board page’s $42.0M and $72.5M are rounded presentation figures and are directionally consistent with the full-group totals—not a competing forecast. The implied AI Digital contribution is about $2.2M in FY26/27 and $3.4M in FY28/29.", sources:["TF+FA Consolidated · row 21 · excludes AI Digital", "Tech Consolidated · AI Digital", "C-Level Executive Analysis · rounded full-group presentation"] },
  { keywords:["monthly p&l","monthly revenue","monthly ebitda","september loss","month by month"], answer:"The uploaded dashboard provides the monthly FY26/27 operating profile. Revenue ranges from $2.782M in August to $3.613M in April. September is the only EBITDA-negative month at approximately −$31.9k, after OpEx rises to about $1.139M. EBITDA strengthens to roughly $389k in January and peaks around $394k in April. This is useful as an execution cadence, but it belongs to the dashboard case rather than the revised executive baseline.", sources:["Budget Dashboard FY2026/27 · dashboard (6) · Monthly P&L"] },
  { keywords:["dashboard forecast","dashboard ebitda","dashboard margin","cost structure","dashboard opex"], answer:"In the uploaded dashboard case, FY26/27 gross profit is $15.195M at 37.78%, OpEx is $11.360M and EBITDA is $3.835M at 9.53%. By FY28/29 it forecasts $30.617M gross profit, $13.478M OpEx and $17.139M EBITDA at 24.69%. The dashboard therefore shows strong later operating leverage, but a lower first-year EBITDA than the revised post-synergy Board case.", sources:["Budget Dashboard FY2026/27 · dashboard (6) · Four-year P&L"] },
  { keywords:["why now","timing","market window","shortage"], answer:"The plan is timely because accounting talent shortages are structural, outsourcing adoption is established, and Talent Formula has specialist delivery capacity, a proven recruitment engine and an AI proposition ready at the same time. The 2026 survey adds a representative people signal: 99% participation, 85% overall satisfaction and strong confidence in the company’s direction.", sources:["C-Level Executive Analysis · Why Now", "TF Employee Satisfaction Survey 2026 · Current-year evidence"] },
  { keywords:["why us","advantage","moat","different","win"], answer:"Talent Formula’s advantage is the combination, not any single asset. Accounting specialisation protects quality; the recruitment engine supplies scarce talent; trusted client relationships provide distribution; and AI Digital adds recurring economics. The 2026 survey adds execution evidence: fair workload allocation, effective operating systems and accountability are the strongest employee-reported advantages.", sources:["C-Level Executive Analysis · Why Talent Formula is positioned to win", "TF Employee Satisfaction Survey 2026 · Strengths and opportunities"] },
  { keywords:["culture","people","survey","employee","readiness"], answer:"The 2026 survey records 85% overall satisfaction against an 84% industry score, supported by 99% participation. Employees report strong confidence, leadership and belief that action will follow the survey. The management priorities are fair performance evaluation, open two-way communication and appropriate reward and recognition.", sources:["TF Employee Satisfaction Survey 2026 · 99% participation"] },
  { keywords:["biggest risk","risks","break the case","downside"], answer:"The most material execution risks are FLA headcount delivery, the UK revenue assumption, unproven AI adoption, Talent Formula gross-margin compression, facilities commitments and FX exposure. The plan addresses them with explicit triggers, accountable owners and monthly Board monitoring.", sources:["C-Level Executive Analysis · Risk-adjusted growth case", "AI Pricing Model · Operating guardrails"] },
  { keywords:["budget different","different budget","what is different"], answer:"This budget is different because it connects growth to an operating system: three distinct engines, a phased AI pricing model, twelve leading KPIs, named risk triggers, an itemised $1.65M synergy register and measured people readiness. It also separates sourced facts, calculated targets and assumptions that still require validation.", sources:["C-Level Executive Analysis · Revised executive case", "KPI Analysis FY2026/27", "AI Pricing Model"] },
  { keywords:["ravi","infrastructure cost","it cost","production run cost","gcp cost","ai api cost","technology cost envelope"], answer:"The AUD $27.2k configured production run cost is already embedded within the approved ~$969k AI technology and infrastructure envelope. It is an ‘of which’ disclosure—not incremental expenditure—and must never be added again when calculating EBITDA, margin, cash requirement or break-even. The technical cost schedule covers the configured production GCP environment, AI APIs and Atlassian at 15 users and three tenants; the broader approved envelope also funds engineering, non-production environments, enterprise systems, integrations, support and scale resilience.", sources:["TFX Budget GCP AI · Summary", "TFX Budget GCP AI · Notes & Caveats", "AI Pricing Model · fixed-cost base"] },
];

const dashboardChangeAnswer = `Year-on-year percentage change (FY25/26→FY26/27 | FY26/27→FY27/28 | FY27/28→FY28/29)

REVENUE
TF Australia: +30.9% | +22.6% | +25.3%
TF UK: +88.7% | +69.9% | +56.5%
TF Other: +41.0% | +53.7% | +47.9%
TF total: +48.2% | +42.1% | +40.7%
Frontline Accounting: +8.1% | +16.5% | +15.8%
QGCC: −49.9% | 0.0% | 0.0%
TF+FA total excluding QGCC: +19.6% | +39.3% | +24.3%
Dashboard total including QGCC: +18.1% | +39.0% | +24.2%

PROFIT AND EXPENSE TOTALS
Direct costs: +13.5% | +22.8% | +26.2%
Gross profit: +26.6% | +65.6% | +21.7%
Total OpEx: +27.8% | +10.2% | +7.6%

OPERATING EXPENSE ITEMS
Executive-team salaries: +103.1% | 0.0% | 0.0%
Admin labour: −12.0% | +16.0% | +15.8%
Sales-team salaries: −3.2% | 0.0% | 0.0%
IT-support salaries: +110.8% | +10.0% | +10.0%
Recruitment/HR salaries: +19.7% | +10.0% | +10.0%
Office-operations salaries: +20.0% | +10.1% | +9.9%
Housekeeping/drivers: +18.8% | +10.0% | +10.0%
Salary MV: 0.0% | 0.0% | 0.0%
PF administration charges: +27.3% | +10.0% | +9.7%
PF contributions—admin: +32.0% | +10.0% | +9.7%
Payroll taxes and benefits: 0.0% | +15.9% | +13.2%
Hyderabad office rent: +57.7% | +2.1% | +2.1%
Facilities: +1.4% | +78.1% | +7.7%
Accommodation rent: +118.9% | 0.0% | +2.6%
Rent recharge to Quantaco: −89.1% | 0.0% | 0.0%
Executive marketing: −0.3% | −0.5% | +2.8%
India marketing: +85.8% | 0.0% | 0.0%
Computer licences/software: +61.1% | +5.6% | +7.3%
Marketing software tools: n/m | 0.0% | 0.0%
Computer maintenance/hardware: +8.3% | 0.0% | 0.0%
Computer leases: −97.5% | +2,383.3% | +131.7%
Other operating expenses: −8.5% | +9.9% | +11.3%
Staff amenities: +39.8% | +5.9% | +7.6%
Staff meals: +48.3% | +4.7% | +6.1%
Staff travel: +71.3% | 0.0% | 0.0%
Staff wellbeing: +20.5% | +54.1% | +48.2%
Staff training: +35.7% | 0.0% | 0.0%
Staff taxi: +5.8% | 0.0% | 0.0%
CSR: +130.7% | 0.0% | 0.0%
National events: +20.0% | 0.0% | 0.0%
Directors’ travel: +50.8% | 0.0% | 0.0%
Staff medical insurance: +71.2% | +19.9% | +22.8%
Recruitment professional fees: +69.0% | +24.0% | +26.5%
Staff internet allowances: +58.6% | +6.0% | +7.7%
Leased-line internet: +36.4% | +19.1% | +22.1%
Payroll tax: +130.8% | 0.0% | 0.0%
Legal: n/m | 0.0% | 0.0%
Accounting/auditing: +9.6% | 0.0% | 0.0%
Bank charges: +9.4% | 0.0% | 0.0%
Telephones: +51.8% | 0.0% | 0.0%
Fuel: +39.8% | 0.0% | 0.0%
Fraud insurance: +10.1% | 0.0% | 0.0%
Motor-vehicle lease: +4.7% | 0.0% | 0.0%

n/m means the percentage is not meaningful because the prior-year value was zero. The dashboard revenue schedule covers TF+FA/QGCC; AI Digital is held in Tech Consolidated.`;

function answerStrategy(question:string) {
  const query = question.toLowerCase().replace(/[’']/g, "'");
  const asksAiRevenue = /\bai(?: digital)?\b/.test(query) && /revenue|sales/.test(query);
  if (asksAiRevenue) {
    const asks2728 = /27\s*[\/–-]\s*28|fy\s*27\s*[\/–-]\s*28|2027\s*[\/–-]\s*28/.test(query) || /\bin\s+(?:fy\s*)?28\b/.test(query);
    const asks2627 = /26\s*[\/–-]\s*27|fy\s*26\s*[\/–-]\s*27|2026\s*[\/–-]\s*27/.test(query) || /\bin\s+(?:fy\s*)?27\b/.test(query);
    if (asks2728) return { text:"AI Digital revenue is $3.1M in FY27/28. I interpreted ‘28’ as the financial year ending FY27/28.", sources:["Executive analysis · Section 07 full P&L summary"] };
    if (asks2627) return { text:"AI Digital revenue is $2.13M in FY26/27 (approximately $2.1M). I interpreted ‘27’ as the financial year ending FY26/27.", sources:["AI Pricing Model · FY26/27 expected case", "KPI Analysis · AI Digital adoption scenarios"] };
    return { text:"Which period do you mean: FY26/27 or FY27/28? The approved figures are $2.13M and $3.1M respectively.", sources:["AI Pricing Model · FY26/27 expected case", "Executive analysis · Section 07 full P&L summary"] };
  }
  const asksRevenueChange = /revenue/.test(query) && /change|growth|percentage|percent|%/.test(query);
  if (asksRevenueChange && (/\b27\b/.test(query) || /26\s*[\/–-]\s*27/.test(query)) && (/\b28\b/.test(query) || /27\s*[\/–-]\s*28/.test(query))) {
    return { text:"Group revenue increases from $33.3M to $42.0M in FY26/27, a 26.1% year-on-year increase. It then rises to $58.7M in FY27/28, a 39.8% increase. I treated ‘27 and 28’ as FY26/27 and FY27/28 and used the rounded Board-chart figures.", sources:["Executive analysis · Four-year financial trajectory", "Executive analysis · Section 07 full P&L summary"] };
  }
  const asksAllChanges = query.includes("revenue") && (query.includes("expense") || query.includes("opex")) && (query.includes("change") || query.includes("%") || query.includes("percentage"));
  if (asksAllChanges) return { text:"Complete year-on-year revenue and expense comparison", view:"financial-changes" as const, sources:["Budget Dashboard FY2026/27 · Revenue Breakdown", "Budget Dashboard FY2026/27 · Full OpEx Line-Item Breakdown"] };
  const theme = strategyThemes.map(item => ({ item, score:item.keywords.reduce((score,key)=>score+(query.includes(key)?key.length:0),0) })).sort((a,b)=>b.score-a.score)[0];
  if (theme?.score > 0) return { text:theme.item.answer, sources:theme.item.sources };
  const matches = Object.values(drilldowns).map(item => {
    const haystack = `${item.title} ${item.eyebrow} ${item.summary} ${item.assumption} ${item.action}`.toLowerCase();
    const words = query.split(/\W+/).filter(word=>word.length>3);
    return { item, score:words.reduce((score,word)=>score+(haystack.includes(word)?1:0),0) };
  }).filter(match=>match.score>0).sort((a,b)=>b.score-a.score).slice(0,2);
  if (!matches.length || matches[0].score < 2) return { text:"I don’t have enough grounded evidence to answer that confidently. Please narrow the question by naming the metric, entity or scope, and comparison period. I will not guess or fill gaps with unsupported information.", sources:[] };
  const lead = matches[0].item;
  const supporting = matches[1]?.item;
  return { text:`${lead.title} is ${lead.value}. ${lead.summary} ${lead.assumption} Management response: ${lead.action}${supporting ? ` Related evidence: ${supporting.title} is ${supporting.value}.` : ""}`, sources:[lead.source, ...(supporting ? [supporting.source] : [])] };
}

function FinancialChangesView() {
  const headings = ["REVENUE","PROFIT AND EXPENSE TOTALS","OPERATING EXPENSE ITEMS"];
  const sections:{title:string;rows:{label:string;values:string[]}[]}[] = [];
  let current:{title:string;rows:{label:string;values:string[]}[]} | null = null;
  dashboardChangeAnswer.split("\n").forEach(line=>{
    const clean=line.trim();
    if(headings.includes(clean)){current={title:clean,rows:[]};sections.push(current);return;}
    if(!current||!clean.includes(":"))return;
    const [label,...rest]=clean.split(":");
    current.rows.push({label,values:rest.join(":").trim().split(" | ")});
  });
  const tone=(value:string)=>value.startsWith("+")?"up":value.startsWith("−")||value.startsWith("-")?"down":"flat";
  return <div className="financial-change-view">
    <div className="change-summary">
      <div><small>Total revenue</small><b>+18.1%</b><span>FY26/27</span></div>
      <div><small>TF total</small><b>+48.2%</b><span>FY26/27</span></div>
      <div><small>Total OpEx</small><b>+27.8%</b><span>FY26/27</span></div>
    </div>
    <div className="change-period-key"><span>Period 1<small>25/26→26/27</small></span><span>Period 2<small>26/27→27/28</small></span><span>Period 3<small>27/28→28/29</small></span></div>
    {sections.map(section=><section className="change-section" key={section.title}><h3>{section.title}</h3><div className="change-table-wrap"><table><thead><tr><th>Line item</th><th>P1</th><th>P2</th><th>P3</th></tr></thead><tbody>{section.rows.map(row=><tr key={row.label}><td>{row.label}</td>{row.values.map((value,i)=><td key={i}><span className={tone(value)}>{value}</span></td>)}</tr>)}</tbody></table></div></section>)}
    <p className="change-note"><b>n/m</b> means the prior-year value was zero. Dashboard revenue covers TF+FA/QGCC; AI Digital is held in Tech Consolidated.</p>
  </div>;
}

export default function Home() {
  const [active, setActive] = useState("thesis");
  const [scenario, setScenario] = useState<"bear" | "expected" | "stretch">("expected");
  const [selected, setSelected] = useState<string | null>(null);
  const [growthOpen, setGrowthOpen] = useState(false);
  const [growthTab, setGrowthTab] = useState<"why"|"different"|"market"|"moat"|"priorities"|"risks">("why");
  const [riskOpen, setRiskOpen] = useState<string | null>("FLA headcount scale-up");
  const [priorityOpen, setPriorityOpen] = useState<string | null>("Integrate Frontline Accounting");
  const [moatOpen, setMoatOpen] = useState("Accounting specialisation");
  const [integrationView, setIntegrationView] = useState<"phases"|"workstreams"|"value">("phases");
  const [selectedWorkstream, setSelectedWorkstream] = useState<string | null>(null);
  const [infraOpen, setInfraOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{role:"assistant",text:"Hello, I’m Alan. Start the conversation and speak naturally—or type while we’re connected. I’ll stay within the approved Board evidence and ask a clarifying question when your request is ambiguous."}]);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Ready when you are");
  const realtimePeerRef = useRef<RTCPeerConnection | null>(null);
  const realtimeChannelRef = useRef<RTCDataChannel | null>(null);
  const realtimeStreamRef = useRef<MediaStream | null>(null);
  const realtimeAudioRef = useRef<HTMLAudioElement | null>(null);
  const scenarios = {
    bear: { adoption: "15%", clients: "~62", revenue: 1.066853, gp: 0.582315, ebitda: 0.00723, profitability:"$7k EBITDA · 0.7%", note: "Calculated at half the expected-case revenue and gross profit, less the unchanged $575,085 below-GP cost allocation. The bear case is only marginally above break-even." },
    expected: { adoption: "30%", clients: "124", revenue: 2.133705, gp: 1.16463, ebitda: 0.589545, profitability:"$590k EBITDA", note: "Budget case: 55 FA, 15 TF and 54 Backroom customers, phased through the year." },
    stretch: { adoption: "45%", clients: "~185", revenue: 3.200558, gp: 1.746945, ebitda: 1.17186, profitability:"$1.17M EBITDA · 36.6%", note: "Calculated at 1.5 times the expected-case revenue and gross profit, less the unchanged $575,085 below-GP cost allocation." },
  };
  const cultureEvidence = {
    different:{label:"Why this plan is executable",metric:"85% satisfaction · 99% participation",copy:"The budget is supported by a representative organisational signal—not only market and financial assumptions. Employees report confidence in direction, leadership and follow-through."},
    moat:{label:"A moat competitors cannot buy",metric:"Fair work · effective systems · accountability",copy:"Tools and pricing can be copied more easily than an operating culture that allocates work fairly, enables delivery and acts on underperformance."},
    priorities:{label:"People evidence behind execution",metric:"90% confidence · 89% people-first leadership",copy:"The survey supports the capacity to execute while making the management priorities explicit: fair evaluation, two-way communication and meaningful recognition."},
    risks:{label:"Culture during scale",metric:"Protect the 85% satisfaction signal",copy:"The risk is dilution during rapid hiring and integration. Monitor overall satisfaction, fair evaluation, communication, recognition and visible action as leading indicators."},
  } as const;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { threshold: [0.3, 0.55] });
    nav.forEach(([id]) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setSelected(null); setGrowthOpen(false); setChatOpen(false); setSelectedWorkstream(null); setInfraOpen(false); } };
    window.addEventListener("keydown", close);
    document.body.style.overflow = selected || growthOpen || selectedWorkstream || infraOpen ? "hidden" : "";
    return () => { window.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [selected, growthOpen, selectedWorkstream, infraOpen]);

  const Drill = ({ id, children, className = "" }: { id:string; children:ReactNode; className?:string }) => <button type="button" className={`drill ${className}`} onClick={() => setSelected(id)} aria-label={`Explore ${id === "ai-scenario" ? `${scenario} AI Digital scenario` : drilldowns[id]?.title || "metric"}`}>{children}<i aria-hidden="true">+</i></button>;
  const scenarioReference = {
    bear: { revenue:"$1.07M", gp:"$582k", ebitda:"$7k · 0.7% margin" },
    expected: { revenue:"$2.13M", gp:"$1.165M", ebitda:"$590k" },
    stretch: { revenue:"$3.20M", gp:"$1.747M", ebitda:"$1.172M · 36.6% margin" },
  }[scenario];
  const currentDetail = selected === "ai-scenario" ? {
    eyebrow:`AI Digital · ${scenario} case`, title:"FY26/27 scenario revenue", value:scenarioReference.revenue, summary:scenarios[scenario].note,
    rows:([["Adoption rate",scenarios[scenario].adoption],["Clients converted",scenarios[scenario].clients],["Gross profit",scenarioReference.gp],["EBITDA",scenarioReference.ebitda]] as [string,string][]),
    assumption:"Eligible clients enter the funnel in phases: TF first, FA from September and Backroom from month 7 in the KPI budget model.", action:"Compare actual conversions, live customers, MRR and revenue per customer with this case every month.", source:"KPI Analysis · AI Digital adoption scenarios"
  } : selected ? drilldowns[selected] : null;
  const stopRealtimeVoice = () => {
    realtimeChannelRef.current?.close();
    realtimePeerRef.current?.close();
    realtimeStreamRef.current?.getTracks().forEach(track => track.stop());
    if (realtimeAudioRef.current) realtimeAudioRef.current.srcObject = null;
    realtimeChannelRef.current = null;
    realtimePeerRef.current = null;
    realtimeStreamRef.current = null;
    realtimeAudioRef.current = null;
    setIsListening(false);
    setVoiceStatus("Realtime conversation ended");
  };

  const sendRealtimeText = () => {
    const clean = chatInput.trim();
    const channel = realtimeChannelRef.current;
    if (!clean) return;
    if (!channel || channel.readyState !== "open") {
      setVoiceStatus("Start the conversation first, then you can speak or type.");
      return;
    }
    setChatMessages(items => [...items, { role:"user", text:clean }]);
    channel.send(JSON.stringify({type:"conversation.item.create",item:{type:"message",role:"user",content:[{type:"input_text",text:clean}]}}));
    channel.send(JSON.stringify({type:"response.create"}));
    setChatInput("");
    setVoiceStatus("Alan is thinking…");
  };

  const toggleListening = async () => {
    if (isListening) { stopRealtimeVoice(); return; }
    if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
      setVoiceStatus("Realtime voice requires a current version of Chrome, Edge or Safari.");
      return;
    }
    setVoiceStatus("Connecting securely to Alan…");
    try {
      const tokenResponse = await fetch("https://xryrekfeuknlqmidekww.supabase.co/functions/v1/alan-realtime-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || !tokenData.value) throw new Error(tokenData.error || "Unable to create a realtime session");

      const peer = new RTCPeerConnection();
      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      peer.ontrack = event => { remoteAudio.srcObject = event.streams[0]; };
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      const channel = peer.createDataChannel("oai-events");
      channel.addEventListener("open", () => {
        setIsListening(true);
        setVoiceStatus("Alan is listening — speak naturally and take your time");
      });
      channel.addEventListener("message", event => {
        const message = JSON.parse(event.data) as {type?:string;transcript?:string;error?:{message?:string}};
        if (message.type === "input_audio_buffer.speech_started") setVoiceStatus("Listening…");
        if (message.type === "input_audio_buffer.speech_stopped") setVoiceStatus("Alan is thinking…");
        if (message.type === "conversation.item.input_audio_transcription.completed" && message.transcript?.trim()) {
          setChatMessages(items => [...items, { role:"user", text:message.transcript!.trim() }]);
        }
        if (message.type === "response.output_audio_transcript.done" && message.transcript?.trim()) {
          setChatMessages(items => [...items, { role:"assistant", text:message.transcript!.trim(), sources:["Alan realtime session · approved Board evidence pack"] }]);
        }
        if (message.type === "response.done") setVoiceStatus("Alan is listening — you can continue");
        if (message.type === "error") setVoiceStatus(message.error?.message || "Alan’s realtime session encountered an error");
      });
      channel.addEventListener("close", () => setIsListening(false));

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: { Authorization: `Bearer ${tokenData.value}`, "Content-Type": "application/sdp" }
      });
      if (!sdpResponse.ok) throw new Error("OpenAI could not establish the realtime audio connection");
      await peer.setRemoteDescription({ type:"answer", sdp:await sdpResponse.text() });
      realtimePeerRef.current = peer;
      realtimeChannelRef.current = channel;
      realtimeStreamRef.current = stream;
      realtimeAudioRef.current = remoteAudio;
    } catch (error) {
      stopRealtimeVoice();
      setVoiceStatus(error instanceof Error ? error.message : "Unable to start realtime voice");
    }
  };

  return <main className={`section-${active}`}>
    <header className="masthead">
      <a className="wordmark" href="#thesis"><img src="./tf-logo-wide.png" alt="Talent Formula" /></a>
      <div className="confidential">Confidential · FY2026-27</div>
      <div className="header-actions"><button type="button" onClick={()=>setGrowthOpen(true)}>Growth case <span>+</span></button><a className="jump" href="#decisions">Board asks <span>↘</span></a></div>
    </header>

    <aside className="rail" aria-label="Board plan chapters">
      <div className="rail-line" />
      {nav.map(([id, number, label]) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""}><i>{number}</i><span>{label}</span></a>)}
    </aside>

    <section id="thesis" className="chapter opening">
      <div className="opening-copy">
        <p className="kicker">FY2026–29 · Board growth strategy</p>
        <h1>Scale what already wins.<br/><em>Build what compounds.</em></h1>
        <p className="lede">A disciplined plan to more than double group revenue by combining specialist offshore accounting, a proven recruitment engine and proprietary AI—while protecting delivery quality and cash discipline.</p>
        <div className="signal-row"><div><b>3</b><span>growth engines</span></div><div><Drill id="client-base">410</Drill><span>combined clients</span></div><div><b>85%</b><span>employee satisfaction</span></div><div><Drill id="synergies">$1.65M</Drill><span>annual synergies</span></div></div>
      </div>
      <div className="north-star">
        <div className="ns-top"><span>North star</span><b>FY28/29</b></div>
        <Drill id="target-revenue" className="hero-drill">$72.5M</Drill><p>Group revenue</p>
        <div className="ns-rule"><i/><span>2.2× FY25/26 base</span></div>
        <div className="margin"><span>EBITDA margin</span><Drill id="target-margin">~24%</Drill></div>
      </div>
      <div className="scroll-cue">Scroll to the financial story <span>↓</span></div>
    </section>

    <section id="trajectory" className="chapter trajectory-section">
      <div className="chapter-label"><span>02</span><p>Four-year trajectory</p></div>
      <div className="section-intro"><h2>Growth earns its value<br/>through <em>operating leverage.</em></h2><p>The revised executive case moves from $33.3M to $72.5M in revenue while post-synergy EBITDA expands from $3.1M to $17.3M.</p></div>
      <div className="trajectory-grid">
        <div className="financial-chart">
          {[{y:"FY25/26",r:33.3,e:3.1,rid:"revenue-25",eid:"ebitda-25"},{y:"FY26/27",r:42.0,e:6.075,rid:"revenue-26",eid:"ebitda-26"},{y:"FY27/28",r:58.7,e:13.8,rid:"revenue-27",eid:"ebitda-27"},{y:"FY28/29",r:72.5,e:17.3,rid:"target-revenue",eid:"ebitda-28"}].map((d,i)=><div className="year" key={d.y}><div className="bars"><button type="button" aria-label={`Explore ${d.y} revenue`} onClick={()=>setSelected(d.rid)} className="revenue" style={{height:`${d.r/72.5*100}%`}}><span>{money(d.r)}</span></button><button type="button" aria-label={`Explore ${d.y} EBITDA`} onClick={()=>setSelected(d.eid)} className="ebitda" style={{height:`${Math.max(d.e/17.3*74,6)}%`}}><span>{money(d.e)}</span></button></div><b>{d.y}</b><small>{["9.3%","14.5%","23.5%","23.8%"][i]} margin</small></div>)}
          <div className="legend"><span><i className="rev-dot"/>Revenue</span><span><i className="eb-dot"/>Post-synergy EBITDA</span></div>
        </div>
        <div className="math-stack">
          <article><small>Revenue CAGR</small><strong>29.5%</strong><p>FY25/26 → FY28/29</p></article>
          <article className="dark"><small>Margin expansion</small><strong>+14.5pp</strong><p>Real operating leverage</p></article>
          <article><small>FY26/27 gross profit</small><Drill id="gp-26">$15.8M</Drill><p>37.6% group margin</p></article>
        </div>
      </div>
      <div className="data-note">Source basis: revised executive analysis. Values are AUD; charts use rounded $M figures.</div>
    </section>

    <section id="engines" className="chapter engines-section">
      <div className="chapter-label"><span>03</span><p>Growth engines</p></div>
      <div className="section-intro"><h2>Three businesses.<br/><em>One compounding system.</em></h2><p>Each engine has a distinct role: FA provides scale, TF supplies growth and talent, while AI Digital adds recurring high-margin economics.</p></div>
      <div className="engine-grid">
        <article className="engine fa"><div className="engine-no">A</div><div><span>Frontline Accounting</span><h3>The scale engine</h3><p>Domain-specialist managed services with an established delivery base and a digital margin layer.</p></div><dl><div><dt>FY26/27 revenue</dt><dd><Drill id="fa-engine">$25.7M</Drill></dd></div><div><dt>Headcount</dt><dd>761</dd></div><div><dt>FY28/29 EBITDA margin</dt><dd>28.4%</dd></div></dl></article>
        <article className="engine tf"><div className="engine-no">B</div><div><span>Talent Formula</span><h3>The growth engine</h3><p>A multi-market recruitment capability spanning Australia, the UK and emerging US opportunity.</p></div><dl><div><dt>FY26/27 revenue</dt><dd><Drill id="tf-engine">$13.3M</Drill></dd></div><div><dt>YoY growth</dt><dd>+38.5%</dd></div><div><dt>FY28/29 revenue</dt><dd>$26.8M</dd></div></dl></article>
        <article className="engine ai"><div className="engine-no">C</div><div><span>AI Digital</span><h3>The margin engine</h3><p>Recurring platform revenue distributed through trusted relationships across the combined client base.</p></div><dl><div><dt>FY26/27 revenue</dt><dd><Drill id="ai-engine">$2.13M</Drill></dd></div><div><dt>Gross margin</dt><dd>54.6%</dd></div><div><dt>EBITDA margin</dt><dd>27.6%</dd></div></dl></article>
      </div>
      <div className="flywheel"><b>People</b><span>→</span><b>Client trust</b><span>→</span><b>Data</b><span>→</span><b>Better AI</b><span>→</span><b>Retention</b></div>
      <button className="growth-entry" type="button" onClick={()=>setGrowthOpen(true)}><span>Strategic growth case</span><b>Why this market, why now, and why Talent Formula</b><i>Explore →</i></button>
    </section>

    <section id="people" className="chapter people-section">
      <div className="chapter-label"><span>04</span><p>People readiness</p></div>
      <div className="people-hero">
        <div><p className="people-kicker">2026 employee satisfaction · 99% participation</p><h2>The culture can support the next stage.<br/><em>Management systems must keep pace.</em></h2><p className="people-lede">Near-total participation makes this a highly representative organisational signal. Employees express strong confidence in Talent Formula’s direction and leadership, while asking for greater fairness in evaluation, more open communication and clearer recognition.</p></div>
        <article className="people-score"><small>Overall satisfaction</small><strong>85%</strong><p>Two points below 2025</p><span>1 point above industry</span></article>
      </div>
      <div className="people-proof">
        <article><b>99%</b><span>survey participation</span></article><article><b>85%</b><span>overall satisfaction</span></article><article><b>+1</b><span>point above industry</span></article><article><b>−2</b><span>points year on year</span></article>
      </div>
      <div className="people-grid">
        <section className="people-panel pressure-panel"><div className="panel-head"><small>2026 execution strengths</small><h3>What the growth plan can build on</h3></div>{[["Fair workload distribution","Work is divided fairly across teams"],["Effective systems and processes","The operating environment helps people get work done"],["Accountability for delivery","Underperformance is addressed rather than tolerated"]].map(([label,note])=><article key={label}><div><b>{label}</b></div><p>{note}</p></article>)}</section>
        <section className="people-panel pressure-panel"><div className="panel-head"><small>2026 management priorities</small><h3>What must improve as we scale</h3></div>{[["Fair performance evaluation","Strengthen confidence in how performance is assessed"],["Open two-way communication","Create more visible dialogue between leaders and teams"],["Reward and recognition","Make recognition feel appropriate, consistent and earned"]].map(([label,note])=><article key={label}><div><b>{label}</b></div><p>{note}</p></article>)}</section>
      </div>
      <div className="driver-panel"><div><small>High-impact engagement driver</small><h3>Resources aligned to company goals</h3><p>81% favourable and two points above comparison. This connects employee experience directly to execution: people can see how funding, effort and capacity are directed toward the strategy.</p></div><div className="sentiment"><span style={{width:"81%"}}>81% favourable</span><span style={{width:"16%"}}>16%</span><span style={{width:"3%"}}>3%</span><small>+2 vs comparison</small></div></div>
      <div className="people-actions"><div className="actions-intro"><small>Top engagement drivers</small><h3>Confidence and leadership are carrying the signal</h3></div>{[["01","90% confidence","Talent Formula is positioned to succeed over the next three years · in line with comparison."],["02","89% people-first leadership","Leaders demonstrate that people matter to the company’s success · +2."],["03","84% motivating vision","Leaders communicate a vision that motivates employees · +2."],["04","84% belief in action","Employees expect action to follow the survey · +9."]].map(([no,title,copy])=><article key={title}><span>{no}</span><h4>{title}</h4><p>{copy}</p></article>)}</div>
      <div className="people-board-note"><div><small>Board interpretation</small><p><b>Culture remains supportive, but the advantage is not automatic.</b> Confidence and leadership provide execution capacity; fairness, communication and recognition determine whether that capacity survives rapid growth and integration.</p></div></div>
      <p className="people-source">Source: TF Employee Satisfaction Survey 2026 evidence supplied by management. Participation: 99%; overall satisfaction: 85% versus 84% industry and 87% in 2025. Only current-year figures visible in the supplied evidence are used.</p>
    </section>

    <section id="scenarios" className="chapter scenario-section">
      <div className="chapter-label"><span>05</span><p>AI adoption scenarios</p></div>
      <div className="section-intro"><h2>Fund the expected case.<br/><em>Gate the downside.</em></h2><p>The corrected budget case reaches 124 active customers at year-end, but recognises $2.13M because TF, FA and Backroom activation is phased through the year.</p></div>
      <div className="scenario-tabs" role="tablist">{(["bear","expected","stretch"] as const).map(s=><button key={s} role="tab" aria-selected={scenario===s} onClick={()=>setScenario(s)} className={scenario===s?"active":""}>{s === "expected" ? "Expected · budget" : s}</button>)}</div>
      <div className="scenario-card">
        <div className="scenario-lead"><span>{scenario} case</span><strong>{scenarios[scenario].adoption}</strong><p>client adoption</p></div>
        <div className="scenario-stat"><small>Clients converted</small><b>{scenarios[scenario].clients}</b></div>
        <div className="scenario-stat"><small>FY26/27 revenue</small><Drill id="ai-scenario">${scenarios[scenario].revenue.toFixed(2)}M</Drill></div>
      <div className="scenario-stat"><small>Fixed cost base</small><button type="button" className="infra-entry" onClick={()=>setInfraOpen(true)} aria-label="Explore the complete AI technology cost envelope"><b>~$969k</b><i aria-hidden="true">+</i></button></div>
      <div className="scenario-stat"><small>Profitability</small><b>{scenarios[scenario].profitability}</b></div>
      </div>
      <div className="scenario-note"><b>Management response</b><p>{scenarios[scenario].note}</p></div>
      <div className="pricing"><span>Commercial model</span><div><b>$15,000</b><small>setup · 30% of adopters</small></div><i>+</i><div><b>$2,700</b><small>platform / month · all</small></div><i>+</i><div><b>$1,800</b><small>AI employee · 30%</small></div></div>
      <ScenarioSimulator />
    </section>

    <section id="operating" className="chapter operating-section">
      <div className="chapter-label"><span>06</span><p>Operating plan</p></div>
      <div className="section-intro"><h2>Manage the plan<br/>through <em>leading indicators.</em></h2><p>The KPI set now distinguishes benchmark-grounded targets, budget-derived calculations and unvalidated assumptions. Estimated baselines must be replaced with FY25/26 actuals before Board submission.</p></div>
      <div className="people-kpi-band"><div><small>People readiness</small><b>Culture is a leading indicator of execution capacity.</b></div><article><strong>85%</strong><span>overall satisfaction · protect</span></article><article><strong>90%</strong><span>three-year confidence · maintain</span></article><article><strong>89%</strong><span>people-first leadership · maintain</span></article><article><strong>84%</strong><span>motivating vision · strengthen</span></article><article><strong>84%</strong><span>belief in action · deliver</span></article><a href="#people">Full evidence →</a></div>
      <div className="operating-grid">
        <div className="kpi-board">
          {[ ["Client retention",">92%","client-retention"],["FLA turnover","<18%","fla-turnover"],["FLA billing utilisation",">88%","billing-utilisation"],["Proposal win rate",">40%","win-rate"],["Pipeline coverage","1.5×","pipeline"],["GP per FLA FTE","$10.2k","gp-fla"],["GP per TF FTE","$22.1k","gp-tf"],["FA managed NRR",">104%","nrr-fa"],["AI Digital NRR",">115%","nrr-ai"],["Time to recruit","<28 days","time-to-recruit"],["AI active customers","124","ai-active-customers"],["AI run-rate MRR","$242k","ai-mrr"] ].map(([label,value,id],i)=>{
            const detail = drilldowns[id as keyof typeof drilldowns];
            const evidence = kpiEvidence[id];
            return <article className="kpi-control" key={label} tabIndex={0} aria-describedby={`kpi-detail-${id}`}>
              <span className="kpi-no">{String(i+1).padStart(2,"0")}</span>
              <p className="kpi-name">{label}</p>
              <b className="kpi-target">{value}</b>
              <aside className="kpi-hover-window" id={`kpi-detail-${id}`} role="tooltip">
                <header><div><small>{detail.eyebrow}</small><h3>Rationale and control</h3></div><strong>{detail.value}</strong></header>
                <p><b>Why this threshold:</b> {detail.summary}</p>
                <section className="kpi-evidence" aria-label="External evidence and benchmark status">
                  <small>External evidence</small>
                  <b>{evidence.basis}</b>
                  <p>{evidence.finding}</p>
                  {evidence.url ? <span className="kpi-source-ref"><strong>{evidence.publisher}</strong><em>{evidence.url}</em></span> : <span className="kpi-source-ref"><strong>{evidence.publisher}</strong></span>}
                </section>
                <dl>{detail.rows.map(([term,description])=><div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>
                <div className="kpi-playbook"><small>How management executes</small><p>{detail.action}</p></div>
                <footer><span>{detail.assumption}</span><cite>{detail.source}</cite></footer>
              </aside>
            </article>;
          })}
        </div>
        <div className="kpi-escalation"><span>Escalation rule</span><p><b>Two consecutive misses</b> trigger a named recovery plan, accountable executive and dated corrective actions in the next Board pack.</p></div>
        <div className="risk-register"><div className="risk-title"><small>Risk register</small><b>Watch what can break the case</b></div>{[
          ["FLA headcount ramp","High","Each 10% miss ≈ $1.5M revenue exposure"],
          ["UK revenue plan","High","20% miss ≈ $250k EBITDA impact"],
          ["AI adoption","High","30% remains unvalidated despite positive model economics"],
          ["TF gross margin","Medium","53.5% → 45.1% over four years"],
          ["Facilities step-up","Medium","Commit only after 80% headcount milestone"],
        ].map(([risk,level,note])=><article key={risk}><div><b>{risk}</b><em className={level.toLowerCase()}>{level}</em></div><p>{note}</p></article>)}</div>
      </div>
      <div className="synergy-panel">
        <div className="synergy-total"><small>Annual synergy register</small><strong>$1.65M</strong><p>Recurring value tracked separately from underlying entity EBITDA.</p><div><span><b>42%</b> expected Q1–Q2</span><span><b>58%</b> expected H2</span></div></div>
        <div className="synergy-cards">{[
          ["01","Shared services","$480k","29%","CFO / COO","Consolidate finance, people and group support activity; validate removed or avoided cost."],
          ["02","Technology platforms","$320k","19%","CTO / CFO","Retire overlapping licences and infrastructure; reconcile savings to supplier invoices."],
          ["03","Facilities","$240k","15%","COO","Sequence footprint consolidation after operating milestones so savings do not constrain delivery."],
          ["04","AI cross-sell","$336k","20%","AI GM / CCO","Convert existing relationships into active AI subscriptions and report recurring gross profit realised."],
          ["05","Procurement + recruitment","$274k","17%","CPO / CFO","Combine vendor buying power and internal recruitment capability; track avoided agency and supplier cost."],
        ].map(([no,label,amount,share,owner,execution])=><article className="synergy-card" key={label} tabIndex={0}>
          <span className="synergy-no">{no}</span><div className="synergy-main"><p>{label}</p><div className="synergy-metrics"><strong>{amount}</strong><b className="synergy-share">{share}<small>of register</small></b></div></div>
          <div className="synergy-owner"><small>Proposed owner</small>{owner}</div>
          <aside role="tooltip"><header><small>{share} of annual register</small><strong>{amount}</strong></header><h3>{label}</h3><p>{execution}</p><dl><div><dt>Evidence</dt><dd>Monthly realised-versus-plan</dd></div><div><dt>Governance</dt><dd>Owner sign-off in Board pack</dd></div></dl><footer>Source: Executive analysis · Synergy register</footer></aside>
        </article>)}</div>
        <div className="synergy-governance"><b>Board control</b><p>Report each line monthly as <strong>planned · committed · realised</strong>; do not allow unrealised synergies to mask entity performance.</p></div>
      </div>
    </section>

    <section id="integration" className="chapter integration-section">
      <div className="chapter-label"><span>07</span><p>Integration framework</p></div>
      <div className="integration-intro">
        <div><small>Frontline Accounting integration</small><h2>Turn the acquisition<br/>into <em>controlled value.</em></h2></div>
        <p>The integration framework translates the strategy into sequenced phases, accountable workstreams and evidence-based value governance. It strengthens execution discipline without altering the approved forecast.</p>
      </div>
      <div className="integration-facts" aria-label="Integration framework scale">
        <article><strong>187</strong><span>integration activities</span></article>
        <article><strong>13</strong><span>accountable workstreams</span></article>
        <article><strong>5</strong><span>delivery phases</span></article>
        <article><strong>22</strong><span>value initiatives</span></article>
        <div><b>Framework loaded</b><span>Baseline and evidence pending</span></div>
      </div>
      <div className="integration-switcher" role="tablist" aria-label="Integration framework views">
        {([['phases','01','Delivery phases'],['workstreams','02','Workstream control'],['value','03','Value governance']] as const).map(([id,no,label])=><button key={id} type="button" role="tab" aria-selected={integrationView===id} className={integrationView===id?'active':''} onClick={()=>setIntegrationView(id)}><span>{no}</span>{label}</button>)}
      </div>
      {integrationView==='phases' && <div className="phase-view">
        <header><div><small>Integration sequence</small><h3>Five gates from readiness to run-rate</h3></div><p>Each phase closes only when its evidence is complete; elapsed time alone does not equal progress.</p></header>
        <div className="phase-track">{[
          ['P0','Pre-close → Day 0','Confirm governance, risks, owners and Day 1 readiness.','Readiness signed'],
          ['P1','Day 1–30','Protect customers, people, cash and uninterrupted delivery.','Stability proven'],
          ['P2','Day 31–100','Align operating processes and lock validated initiatives.','Baselines approved'],
          ['P3','Months 4–6','Execute integration waves and verify early benefits.','Evidence accepted'],
          ['P4','Months 7–12','Embed the operating model and sustain annual run-rate.','Benefits sustained'],
        ].map(([phase,time,copy,gate])=><article key={phase}><span>{phase}</span><small>{time}</small><h4>{copy}</h4><b>{gate}</b></article>)}</div>
        <div className="integration-control"><b>Board control</b><p>Report phase completion by evidence accepted, decisions closed and risks retired—not by a subjective percentage-complete estimate.</p></div>
      </div>}
      {integrationView==='workstreams' && <div className="workstream-view">
        <header><div><small>Accountability architecture</small><h3>Every activity has an operating home</h3></div><p>Task count shows the breadth of the framework, not completion status.</p></header>
        <div className="workstream-grid">{[
          'Governance & PMO','Synergy Management','Customer & Revenue Protection','Operations','HR & Organisation','Technology','Security & Compliance','Finance & Working Capital','Procurement & Facilities','Quality & Continuous Improvement','Sales & Go-to-Market','Legal & Corporate','Communications & Change'
        ].map((label,i)=>{const count=integrationActivities.filter(item=>item.workstream===label).length;return <button type="button" key={label} onClick={()=>setSelectedWorkstream(label)} aria-label={`View ${count} activities for ${label}`}><span>{String(i+1).padStart(2,'0')}</span><h4>{label}</h4><strong>{count}</strong><small>activities</small><i aria-hidden="true">View all →</i></button>})}</div>
      </div>}
      {integrationView==='value' && <div className="value-view">
        <header><div><small>Benefits discipline</small><h3>Count value only when it is evidenced</h3></div><p>The existing synergy figure remains a Board target until initiative baselines and financial proof are populated.</p></header>
        <div className="value-ledger">
          <aside><small>Targeted annual run-rate</small><strong>$1.65M</strong><p>Existing Board target · validation required</p></aside>
          <div>{[
            ['Separate the value','Cost · revenue · working capital'],['Track the state','Planned · committed · realised'],['Prove the economics','Gross benefit · replacement cost · one-time cost · net value'],['Accept the evidence','Named owner · finance sign-off · source document'],['Protect the forecast','Show underlying EBITDA separately from integration value']
          ].map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><div><b>{title}</b><p>{copy}</p></div></article>)}</div>
        </div>
        <div className="integration-warning"><b>Framework readiness</b><p>The control structure is established. Baselines, phasing, owners, realised benefits and supporting evidence must be confirmed before progress or value realisation is reported.</p></div>
      </div>}
      <div className="integration-source">Source: FA Integration &amp; Synergy Framework · operating structure only · financial values pending validation</div>
      {selectedWorkstream && <div className="activity-layer" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedWorkstream(null)}}>
        <aside className="activity-drawer" role="dialog" aria-modal="true" aria-labelledby="activity-title">
          <header><div><small>Integration workstream</small><h3 id="activity-title">{selectedWorkstream}</h3><p>{integrationActivities.filter(item=>item.workstream===selectedWorkstream).length} activities defined in the integration framework</p></div><button type="button" onClick={()=>setSelectedWorkstream(null)} aria-label="Close activity list">×</button></header>
          <div className="activity-key"><span>Task</span><span>Phase</span><span>Priority</span><span>Owner</span></div>
          <div className="activity-list">{integrationActivities.filter(item=>item.workstream===selectedWorkstream).map(item=><article key={item.id}>
            <div className="activity-id"><b>{item.id}</b><span>{item.phase}</span></div>
            <div className="activity-copy"><h4>{item.action}</h4><dl><div><dt>Timing</dt><dd>{item.timing}</dd></div><div><dt>Priority</dt><dd>{item.priority}</dd></div><div><dt>Accountable owner</dt><dd>{item.owner}</dd></div><div><dt>Deliverable</dt><dd>{item.deliverable || 'To be confirmed'}</dd></div></dl></div>
          </article>)}</div>
          <footer><b>Framework scope</b><p>These activities define the execution architecture for the FA integration. This view explains the framework; it does not report implementation progress.</p></footer>
        </aside>
      </div>}
    </section>

    <section id="decisions" className="chapter decisions-section">
      <div className="chapter-label"><span>08</span><p>Board decisions</p></div>
      <div className="decision-intro"><p>The ask is not approval of a static forecast.</p><h2>Approve the controls<br/>that make the ambition <em>investable.</em></h2></div>
      <div className="decision-list">
        {[
          ["Approve the synergy register","Assign owners and add monthly reporting to the Board pack.","Now"],
          ["Appoint a UK Growth Lead","Build named pipeline coverage to 1.5× before Q2 budget lock.","Aug 2026"],
          ["Launch the AI review gate","Review adoption at month six; pause new opex if below bear case.","Q1 FY27"],
          ["Stage facilities commitments","Require 80%+ FLA headcount achievement before the next lease tranche.","FY26/27"],
          ["Commission the downside case","Model -20% UK revenue, -15% FLA headcount and 15% AI adoption.","Next Board"],
        ].map(([title,copy,timing],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p><b>{timing}</b></article>)}
      </div>
      <div className="close"><div><img src="./tf-logo-mark.png" alt="Talent Formula"/><b>FY2026-27 Board Plan</b></div><p>Scale the platform.<br/>Protect the downside.</p></div>
    </section>
    {currentDetail && <div className="drawer-layer" role="presentation" onMouseDown={(event)=>{if(event.target===event.currentTarget)setSelected(null)}}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <button className="drawer-close" type="button" onClick={()=>setSelected(null)} aria-label="Close detail panel">×</button>
        <div className="drawer-head"><small>{currentDetail.eyebrow}</small><h2 id="drawer-title">{currentDetail.title}</h2><strong>{currentDetail.value}</strong><p>{currentDetail.summary}</p></div>
        <div className="drawer-rows">{currentDetail.rows.map(([label,value])=><div key={label}><span>{label}</span><b>{value}</b></div>)}</div>
        <div className="drawer-callout"><small>Key assumption</small><p>{currentDetail.assumption}</p></div>
        <div className="drawer-action"><small>Board implication</small><p>{currentDetail.action}</p></div>
        <div className="drawer-source">Source: {currentDetail.source}</div>
      </aside>
    </div>}
    {infraOpen && <div className="infra-layer" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setInfraOpen(false)}}>
      <aside className="infra-drawer" role="dialog" aria-modal="true" aria-labelledby="infra-title">
        <header><div><small>AI Digital · cost evidence</small><h2 id="infra-title">Complete AI technology<br/>cost envelope.</h2></div><button type="button" onClick={()=>setInfraOpen(false)} aria-label="Close technology cost detail">×</button></header>
        <div className="infra-scroll">
          <section className="infra-relationship">
            <article><small>Approved fixed-cost base</small><strong>~$969k</strong><p>Complete AI technology and infrastructure envelope</p></article>
            <i aria-hidden="true">includes</i>
            <article className="embedded"><small>Configured production run cost</small><strong>AUD $27.2k</strong><p>Technical cost schedule · 15 users · 3 tenants</p></article>
          </section>
          <div className="infra-control"><b>Included—not incremental</b><p>The AUD $27.2k is already contained within the ~$969k approved envelope. It must not be added again to expenditure, EBITDA, cash requirement or break-even.</p></div>
          <section className="infra-breakdown"><header><div><small>Embedded cost composition</small><h3>What the configured platform costs to run</h3></div><p>Annual AUD · using the source model’s 1.52 AUD/USD assumption</p></header><div>{[
            ['GCP infrastructure','$20.3k','74.8%'],['Anthropic API','$4.0k','14.7%'],['Atlassian','$1.9k','7.0%'],['Gemini API','$0.5k','2.0%'],['OpenAI API','$0.4k','1.5%']
          ].map(([label,value,share])=><article key={label}><span>{label}</span><b>{value}</b><small>{share}</small></article>)}</div></section>
          <section className="gcp-composition"><header><small>Inside the GCP component</small><h3>Compute is the dominant platform driver</h3></header><div>{[
            ['Compute',81.2,'$905/mo'],['Network',8.3,'$92/mo'],['Data',6.3,'$70/mo'],['Operations',3.2,'$36/mo'],['Storage',0.8,'$9/mo'],['Security',0.1,'$1/mo']
          ].map(([label,share,value])=><article key={label as string}><div><b>{label}</b><span>{value}</span></div><i><em style={{width:`${share}%`}}/></i><small>{share}% of GCP</small></article>)}</div></section>
          <section className="infra-scope"><article><small>The configured production estimate covers</small><ul><li>Production GCP environment</li><li>Anthropic, OpenAI and Gemini APIs</li><li>Jira and Confluence licences</li><li>15 users and three tenants</li></ul></article><article><small>The complete envelope additionally covers</small><ul><li>Engineering and platform capability</li><li>Non-production environments</li><li>Enterprise systems and integrations</li><li>Support, security and scale resilience</li></ul></article></section>
          <section className="infra-resilience"><header><small>Scale and resilience considerations</small><h3>What management must validate before commitment</h3></header><div><span>Cloud SQL sizing</span><span>Database failover</span><span>Redis failover</span><span>Zonal GKE exposure</span><span>Supplier pricing</span><span>Beyond-25-seat resizing</span></div></section>
          <div className="infra-insight"><b>Board insight</b><p>The present configured run cost is predominantly fixed cloud compute. The larger financial commitment is the broader capability required to build, secure, integrate, support and scale the commercial platform.</p></div>
          <footer>Source: TFX_Budget_GCP_AI_Aug2026 · Summary, GCP Resources and Notes &amp; Caveats. Supporting detail only; approved financial results remain unchanged.</footer>
        </div>
      </aside>
    </div>}
    {growthOpen && <div className="growth-layer" role="dialog" aria-modal="true" aria-labelledby="growth-title">
      <div className="growth-shell">
        <header className="growth-head"><div><small>Strategic growth case</small><h2 id="growth-title">Why this business can win.</h2></div><button type="button" onClick={()=>setGrowthOpen(false)} aria-label="Close growth case">×</button></header>
        <nav className="growth-tabs" aria-label="Growth case sections">{([
          ["why","Why now"],["different","Why different"],["market","Market"],["moat","Why us"],["priorities","Priorities"],["risks","Risks"]
        ] as const).map(([id,label],i)=><button key={id} type="button" className={growthTab===id?"active":""} onClick={()=>setGrowthTab(id)}><span>0{i+1}</span>{label}</button>)}</nav>
        <div className="growth-body">
          {growthTab==="why" && <section className="growth-why"><div className="growth-title"><small>Why now</small><h3>Three structural forces<br/>are converging <em>at once.</em></h3><p>The opportunity is not simply budget growth. It is a time-bound market window where talent scarcity, AI adoption and outsourcing demand reinforce the group model.</p></div><div className="force-grid">
            <article><span>01</span><b>Accountant shortage</b><strong>~10%</strong><p>decline in the US accounting workforce from 2019-2024, with similar structural gaps across Australia and the UK.</p></article>
            <article><span>02</span><b>AI adoption inflection</b><strong>41%</strong><p>projected CAGR for AI in accounting through 2030 as firms seek AI-enabled delivery partners.</p></article>
            <article><span>03</span><b>Outsourcing acceleration</b><strong>30-35%</strong><p>of small and mid-size US CPA firms now use offshore outsourcing, with adoption accelerating.</p></article>
          </div><div className="timing-strip"><b>The window</b><p>Clients want cost relief and automation together. Competitors typically offer one or the other; Talent Formula is assembling both under one contract.</p></div><div className="people-evidence"><small>Why Talent Formula is ready now</small><b>85% satisfaction · 99% participation</b><p>The current survey shows strong confidence in direction and leadership, supported by fair workload allocation, effective systems and accountability.</p><a href="#people" onClick={()=>setGrowthOpen(false)}>People readiness →</a></div></section>}
          {growthTab==="different" && <section className="budget-different"><div className="growth-title"><small>Why this budget is different</small><h3>Not an extrapolation.<br/>A <em>new operating system.</em></h3><p>Most budgets extend yesterday's run rate. This one brings three growth engines online together and changes how the group creates revenue, margin and strategic value.</p></div><div className="difference-hero"><div><small>The shift</small><h4>From three adjacent businesses<br/>to one reinforcing platform.</h4></div><strong>3×</strong><p>growth engines operating simultaneously for the first time</p></div><div className="difference-grid">
            <article><span>01</span><div><small>FA / FLA</small><h4>Scale plus a digital margin layer</h4><p>Managed-service headcount grows on top of proven delivery infrastructure, while digital revenue expands margin without requiring the same increase in physical delivery cost.</p></div><b>620 → 761 FTEs</b></article>
            <article><span>02</span><div><small>Talent Formula</small><h4>Geographic growth, not just volume growth</h4><p>The recruitment engine moves beyond the existing base into the UK and emerging US opportunity, diversifying revenue and improving access to higher-rate markets.</p></div><b>+38.5% YoY</b></article>
            <article><span>03</span><div><small>AI Digital</small><h4>Recurring platform economics</h4><p>The group converts existing relationships into subscription-style revenue through a proprietary platform rather than relying only on labour-linked service growth.</p></div><b>54.6% GP margin</b></article>
            <article><span>04</span><div><small>Acquisition advantage</small><h4>Distribution arrives with the assets</h4><p>FA and Backroom add clients, delivery capability and workflow access. AI Digital can be sold into trusted relationships instead of building a customer base from zero.</p></div><b>410 clients</b></article>
          </div><div className="difference-bottom"><div><small>What the Board is underwriting</small><p>A team that has already built the delivery capability, client relationships and AI infrastructure needed to execute the plan.</p></div><div><small>What the Board is not underwriting</small><p>A concept-stage start-up, a financial-engineering story or growth that depends on a single business unit.</p></div><div className="result"><small>The intended result</small><strong>$33.3M → $72.5M</strong><p>with EBITDA margin moving from 9.3% to approximately 24%.</p></div></div><div className="difference-source">Internal reference: Executive analysis · Sections 01, 03, 04, 05 and 12</div></section>}
          {growthTab==="market" && <section className="growth-market"><div className="growth-title"><small>Market opportunity</small><h3>Large markets.<br/><em>Minimal penetration.</em></h3><p>The growth plan sits at the intersection of accounting services, offshore delivery and AI-enabled workflows.</p></div><div className="market-grid">
            <article className="market-hero"><small>Global AI in accounting</small><div><strong>$6.7B</strong><span>2025</span><i>→</i><strong>$37.6B</strong><span>2030</span></div><p>41% CAGR · the fastest-growing layer in the group opportunity.</p></article>
            <article><small>Australia accounting services</small><strong>$33.7B</strong><p>F&A BPO sub-market grows from $797M to $1.32B by 2030.</p></article>
            <article><small>UK accounting services</small><strong>$51B</strong><p>TF's $4.9M plan represents roughly 0.01% penetration.</p></article>
            <article><small>Global F&A outsourcing</small><strong>$54.8B</strong><p>Projected to reach $81.25B by 2030.</p></article>
            <article><small>Offshore enterprise share</small><strong>56%</strong><p>of F&A outsourcing revenue is already offshore-deployed.</p></article>
          </div><div className="market-note">Market figures reflect the research cited in the supplied executive analysis and should be source-checked before external publication.</div></section>}
          {growthTab==="moat" && <section className="growth-moat"><div className="growth-title"><small>Why Talent Formula</small><h3>A model competitors<br/>cannot easily <em>replicate.</em></h3><p>The advantage is the combination: select each capability to see the operational proof and why it creates defensible value.</p></div><div className="moat-selector">
            {[
              ["Accounting specialisation","761 FLA specialists","We do not serve every industry—we go deep in accounting. FA/FLA's 761 specialist offshore accountants are trained on local compliance frameworks and delivery requirements.","Generalist offshore providers cannot match the same domain depth and quality consistency.","Specialisation supports premium pricing, stronger client trust and higher retention."],
              ["Proven delivery","600+ placements","FA has already placed and managed 600+ offshore accounting FTEs across ANZ firms at scale. Hiring pipelines, onboarding systems and quality frameworks are built and operational.","The budget is scaling an engine that already runs; it is not underwriting start-up execution risk.","Existing infrastructure shortens time to revenue and lowers the risk of the 620-to-761 headcount ramp."],
              ["AI-first operating model","54.6% gross margin","AI Digital is embedded in how the group services clients rather than sold as an unrelated bolt-on. The platform is already deployed across the FA and TF client base.","Every deployment produces workflow learning: more clients create more data, better automation and stronger retention.","A high-margin digital layer can compound on top of the existing delivery base at low marginal cost."],
              ["Recruitment engine","AUD · UK · US","TF can source, assess and place accounting talent across Australia, the UK and emerging US markets. This capability directly supports FA's planned scale to 968 FTEs in FY27/28.","Speed and cross-market reach create a practical moat that captive or local providers struggle to reproduce.","The same engine supports organic growth, acquisition integration and new-market entry."],
              ["Client relationships & implementation","410 combined clients","FA's 180+ managed-service clients, TF's 50+ active clients and the Backroom client base create a combined distribution channel for AI Digital.","The group is upselling trusted relationships rather than acquiring SaaS customers through cold prospecting.","Near-zero incremental customer-acquisition cost makes AI adoption more defensible than a greenfield SaaS model."],
              ["People + AI integration","One integrated contract","Talent Formula combines specialist offshore accounting talent with a purpose-built AI platform in one operating model and one client proposition.","Pure-play staffing lacks proprietary automation; pure-play SaaS lacks domain delivery capability and implementation depth.","Clients receive expert humans and intelligent automation together, increasing value, stickiness and share of wallet."],
              ["Culture built for execution","85% satisfied","The 2026 employee survey records 85% overall satisfaction with 99% participation. Fair workload allocation, effective systems and accountability are the leading strengths.","Tools and pricing can be copied more easily than an operating culture that enables delivery and addresses underperformance.","The group can pursue FA scale, geographic growth and AI adoption from a position of strong confidence—provided fairness, communication and recognition improve."]
            ].map(([title,proof,detail,difference,value],i)=><button key={title} type="button" className={moatOpen===title?"active":""} onClick={()=>setMoatOpen(title)}><span>{String(i+1).padStart(2,"0")}</span><b>{title}</b><small>{proof}</small><i>→</i></button>)}
          </div>{[
              ["Accounting specialisation","761 FLA specialists","We do not serve every industry—we go deep in accounting. FA/FLA's 761 specialist offshore accountants are trained on local compliance frameworks and delivery requirements.","Generalist offshore providers cannot match the same domain depth and quality consistency.","Specialisation supports premium pricing, stronger client trust and higher retention."],
              ["Proven delivery","600+ placements","FA has already placed and managed 600+ offshore accounting FTEs across ANZ firms at scale. Hiring pipelines, onboarding systems and quality frameworks are built and operational.","The budget is scaling an engine that already runs; it is not underwriting start-up execution risk.","Existing infrastructure shortens time to revenue and lowers the risk of the 620-to-761 headcount ramp."],
              ["AI-first operating model","54.6% gross margin","AI Digital is embedded in how the group services clients rather than sold as an unrelated bolt-on. The platform is already deployed across the FA and TF client base.","Every deployment produces workflow learning: more clients create more data, better automation and stronger retention.","A high-margin digital layer can compound on top of the existing delivery base at low marginal cost."],
              ["Recruitment engine","AUD · UK · US","TF can source, assess and place accounting talent across Australia, the UK and emerging US markets. This capability directly supports FA's planned scale to 968 FTEs in FY27/28.","Speed and cross-market reach create a practical moat that captive or local providers struggle to reproduce.","The same engine supports organic growth, acquisition integration and new-market entry."],
              ["Client relationships & implementation","410 combined clients","FA's 180+ managed-service clients, TF's 50+ active clients and the Backroom client base create a combined distribution channel for AI Digital.","The group is upselling trusted relationships rather than acquiring SaaS customers through cold prospecting.","Near-zero incremental customer-acquisition cost makes AI adoption more defensible than a greenfield SaaS model."],
              ["People + AI integration","One integrated contract","Talent Formula combines specialist offshore accounting talent with a purpose-built AI platform in one operating model and one client proposition.","Pure-play staffing lacks proprietary automation; pure-play SaaS lacks domain delivery capability and implementation depth.","Clients receive expert humans and intelligent automation together, increasing value, stickiness and share of wallet."],
              ["Culture built for execution","85% satisfied","The 2026 employee survey records 85% overall satisfaction with 99% participation. Fair workload allocation, effective systems and accountability are the leading strengths.","Tools and pricing can be copied more easily than an operating culture that enables delivery and addresses underperformance.","The group can pursue FA scale, geographic growth and AI adoption from a position of strong confidence—provided fairness, communication and recognition improve."]
            ].filter(([title])=>title===moatOpen).map(([title,proof,detail,difference,value])=><div className="moat-stage" key={title}><div className="moat-stage-head"><small>Selected advantage</small><h4>{title}</h4><strong>{proof}</strong></div><div className="moat-stage-grid"><div><small>Operational proof</small><p>{detail}</p></div><div><small>Why it is different</small><p>{difference}</p></div><div className="value"><small>Strategic value</small><p>{value}</p></div></div></div>)}<div className="moat-proof"><span>More clients</span><i>→</i><span>More workflow data</span><i>→</i><span>Better AI</span><i>→</i><span>Higher retention</span></div></section>}
          {growthTab==="priorities" && <section className="growth-priorities"><div className="growth-title"><small>FY2027 priorities</small><h3>Turn the thesis into<br/><em>sequenced execution.</em></h3><p>Growth depends on a small number of linked moves. Expand each priority to see why it matters, the evidence behind it and the proof point the Board should require.</p></div><div className="priority-evidence-list">
            {[
              ["Integrate Frontline Accounting","Realise the $1.65M synergy register and establish one operating model.","Owner-level monthly reporting","The acquisition case depends on shared services, technology, facilities and cross-sell benefits becoming operating reality—not remaining spreadsheet assumptions.","Executive analysis · Sections 05, 07 and 10","McKinsey reports that effective implementation of the combined operating model makes organisations more likely to meet or exceed cost and revenue synergy targets.","McKinsey · Unlocking merger value through operating model design","https://www.mckinsey.com/capabilities/m-and-a/our-insights/unlocking-merger-value-through-operating-model-design"],
              ["Scale AI Digital","Convert 30% of the phased addressable client base.","124 active customers","AI Digital is the highest-margin engine and creates recurring revenue from relationships the group already owns. The target comprises 55 FA, 15 TF and 54 Backroom customers.","KPI Analysis · AI Digital corrected and verified","Thomson Reuters finds professional-services firms are moving beyond individual AI use toward organisation-wide strategy, workforce planning and client conversations.","Thomson Reuters · 2025 Generative AI in Professional Services","https://www.thomsonreuters.com/en/reports/2025-generative-ai-in-professional-services-report"],
              ["Accelerate UK growth","Grow from $2.7M to $4.9M with named pipeline.","1.5× coverage","The UK is TF's most immediate international scale opportunity and improves geographic and rate mix, but the 79% growth plan needs disciplined pipeline coverage.","Executive analysis · Sections 05, 08 and 12","ICAEW research finds UK accountants remain in high demand and that mid-tier firms are actively seeking specialist talent while integrating AI into delivery models.","ICAEW · UK accountants remain in high demand","https://www.icaew.com/about-icaew/news/2026-news-releases/uk-accountants-still-in-high-demand-despite-ai-jobs-shift-icaew-report-finds"],
              ["Enter the US","Use the accountant shortage and India delivery base to win the first client.","$1M by FY27/28","The US provides the largest expansion runway and lets the group reuse its recruitment, offshore-delivery and accounting-specialisation capabilities rather than build a new engine.","Executive analysis · Sections 03, 05, 06 and 14","The U.S. Bureau of Labor Statistics projects about 124,200 accountant and auditor openings annually from 2024-2034, with demand supported by complexity and globalisation.","U.S. BLS · Accountants and Auditors Outlook","https://www.bls.gov/ooh/business-and-financial/accountants-and-auditors.htm"],
              ["Expand EBITDA","Move from 9.3% to 12.3% in FY26/27, then beyond 23%.","Pre/post-synergy bridge","Revenue growth alone does not validate the model. Margin expansion proves FA operating leverage, AI economics and integration benefits are compounding as intended.","Executive analysis · Sections 05, 07 and 15","McKinsey research on large deals highlights persistent synergy governance and financial transparency as core conditions for converting strategic ambition into measurable value.","McKinsey · Keys to success in a large-deal merger","https://www.mckinsey.com/capabilities/m-and-a/our-insights/post-close-excellence-in-large-deal-m-and-a"],
              ["Build leadership","Create entity P&L ownership and management capacity for a $72M group.","Clear accountable owners","A business scaling across three entities, acquisitions and geographies will outrun informal decision-making. Leadership capacity is the control system for every other priority.","Executive analysis · Sections 05, 10, 11 and 14","McKinsey's integration research links tailored leadership capability-building with stronger planning, value capture, cultural integration and readiness for the next growth horizon.","McKinsey · The role of leadership in merger integration","https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/equipping-leaders-for-merger-integration-success"]
            ].map(([title,copy,proof,why,internalRef,evidence,source,url],i)=><article key={title} className={priorityOpen===title?"open":""}><button type="button" className="priority-summary" onClick={()=>setPriorityOpen(priorityOpen===title?null:title)} aria-expanded={priorityOpen===title}><span>{String(i+1).padStart(2,"0")}</span><div><h4>{title}</h4><p>{copy}</p></div><b>{proof}</b><i>{priorityOpen===title?"−":"+"}</i></button>{priorityOpen===title&&<div className="priority-detail"><div className="why"><small>Why it is important</small><p>{why}</p></div><div><small>Internal reference</small><p>{internalRef}</p></div><div className="evidence"><small>External evidence</small><p>{evidence}</p><div className="source-hover"><button type="button" className="source-trigger" aria-describedby={`source-${i}`}>{source} <span>ⓘ</span></button><aside id={`source-${i}`} className="source-window" role="tooltip"><div><small>Reference preview</small><b>{source}</b></div><p>{evidence}</p><dl><dt>Publisher</dt><dd>{source.split(" · ")[0]}</dd><dt>Source address</dt><dd>{url}</dd></dl><em>This reference is shown inside the board plan. No new tab will open.</em></aside></div></div></div>}</article>)}
          </div></section>}
          {growthTab==="risks" && <section className="growth-risks"><div className="growth-title"><small>Risk-adjusted growth</small><h3>Ambition with<br/><em>explicit controls.</em></h3><p>The case remains investable only if the Board sees the downside early and management has predetermined responses.</p></div><div className="risk-response-list">
            {[
              ["FLA headcount scale-up","High","620 → 761; each 10% shortfall implies roughly $1.5M of revenue risk.","Headcount is 5% below monthly plan or billing utilisation falls below 88%.","COO + CPO","Deploy TF's recruitment engine, review the vacancy funnel weekly, prioritise revenue-critical roles and hold discretionary hiring elsewhere.","Monthly headcount-versus-plan dashboard; 10% miss escalated to the Board."],
              ["UK revenue assumption","High","79% year-on-year growth with current pipeline around 1.25×.","Qualified coverage remains below 1.5× or a named opportunity slips by more than 30 days.","UK Growth Lead + CCO","Rebalance toward committed client expansion, accelerate referral channels and adjust UK hiring or spend to the revised close profile.","Named opportunities, weighted coverage and close-date movement reported monthly."],
              ["AI adoption uncertainty","High","The verified model remains EBITDA-positive at 15% adoption, but the 30% budget case has no pilot or signed-LOI evidence.","September MRR is below $150k or conversion evidence does not support the 30% case.","CCO + CTO","Stage incremental AI opex against pitched, demo, trial, signed and live-customer evidence; concentrate product effort on the highest-conversion segments.","Monthly activation funnel, MRR, active customers, add-on mix and churn."],
              ["TF gross-margin compression","Medium","Margin trends from 53.5% to 45.1% over four years.","GP per FTE misses plan for two months or entity margin falls more than 2pp below budget.","TF CEO + CFO","Apply 3-5% annual rate uplifts, improve UK mix, review low-margin contracts and align delivery headcount to contracted demand.","Monthly GP per FTE, billing rate, utilisation and client-level contribution."],
              ["Facilities step-change","Medium","Cost rises from $587k to $1.046M to support 968 FTEs.","FLA headcount is below 80% of the milestone required for the next lease tranche.","COO + CFO","Delay the fixed commitment, use flexible space as a buffer and phase fit-out only against contracted or near-contracted demand.","Lease gates included in the monthly headcount and capacity review."],
              ["FX exposure","Medium","Material GBP/AUD and INR/AUD exposure with flat-rate planning assumptions.","GBP/AUD or INR/AUD moves beyond the approved 5% sensitivity band.","CFO","Implement rolling six-month GBP/AUD cover, match currency inflows and outflows where possible and reprice exposed contracts at renewal.","Quarterly hedged-versus-unhedged position and 5% sensitivity in every Board pack."]
            ].map(([title,level,risk,trigger,owner,response,monitoring])=><article key={title} className={riskOpen===title?"open":""}><button type="button" className="risk-summary" onClick={()=>setRiskOpen(riskOpen===title?null:title)} aria-expanded={riskOpen===title}><span><h4>{title}</h4><em className={level.toLowerCase()}>{level}</em></span><p>{risk}</p><i>{riskOpen===title?"−":"+"}</i></button>{riskOpen===title&&<div className="risk-response"><div><small>Trigger</small><p>{trigger}</p></div><div><small>Accountable owner</small><p>{owner}</p></div><div className="response-main"><small>How we address it</small><p>{response}</p></div><div><small>Board monitoring</small><p>{monitoring}</p></div></div>}</article>)}
          </div></section>}
          {growthTab in cultureEvidence && <div className="people-evidence"><small>{cultureEvidence[growthTab as keyof typeof cultureEvidence].label}</small><b>{cultureEvidence[growthTab as keyof typeof cultureEvidence].metric}</b><p>{cultureEvidence[growthTab as keyof typeof cultureEvidence].copy}</p><a href="#people" onClick={()=>setGrowthOpen(false)}>Explore people readiness →</a></div>}
        </div>
        <footer className="growth-foot"><span>Use the tabs to move through the growth case</span><button type="button" onClick={()=>setGrowthOpen(false)}>Return to board plan</button></footer>
      </div>
    </div>}
    <button type="button" className="chat-launcher" onClick={()=>setChatOpen(true)} aria-label="Talk with Alan"><span>A</span><b>Talk with Alan</b></button>
    {chatOpen && <div className="chat-scrim" onMouseDown={(event)=>{if(event.target===event.currentTarget){stopRealtimeVoice();setChatOpen(false)}}}>
      <aside className="strategy-chat" role="dialog" aria-modal="true" aria-labelledby="strategy-chat-title">
        <header><div><small>Alan · Realtime Board conversation</small><h2 id="strategy-chat-title">Talk with Alan</h2><p>A natural, continuous conversation grounded in the approved Board evidence.</p><div className="grounded-badge"><i/>Realtime grounded mode · asks before assuming</div></div><div className="chat-head-actions"><button type="button" onClick={()=>{stopRealtimeVoice();setChatOpen(false)}} aria-label="Close Alan">×</button></div></header>
        <div className="conversation-control"><button type="button" className={isListening?"active":""} onClick={toggleListening}><i aria-hidden="true"/>{isListening?"End conversation":"Start conversation"}</button><span>{voiceStatus}</span></div>
        <div className="chat-thread" aria-live="polite">{chatMessages.map((message,index)=><article key={`${message.role}-${index}`} className={`${message.role}${message.view?" has-view":""}`}><small>{message.role==="assistant"?"Alan":"You"}</small>{message.view==="financial-changes"?<FinancialChangesView/>:<p>{message.text}</p>}{message.sources?.length?<div className="chat-sources"><b>Evidence</b>{message.sources.map(source=><span key={source}>{source}</span>)}</div>:null}</article>)}</div>
        <form onSubmit={(event)=>{event.preventDefault();sendRealtimeText()}}><label htmlFor="strategy-question">Type during the conversation</label><div><textarea id="strategy-question" value={chatInput} onChange={event=>setChatInput(event.target.value)} placeholder={isListening?"Type a follow-up, or simply keep speaking…":"Start the conversation to speak or type…"} rows={2} disabled={!isListening}/><button type="submit" disabled={!isListening||!chatInput.trim()}>Send →</button></div><small>Low-eagerness turn detection lets you pause naturally. You can interrupt Alan at any time.</small></form>
      </aside>
    </div>}
    <footer><span>Confidential · Board privileged</span><span>Prepared August 2026 · FY2026–29 growth strategy</span></footer>
  </main>;
}
