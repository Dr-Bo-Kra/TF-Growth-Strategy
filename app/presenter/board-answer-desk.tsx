"use client";

import {useMemo,useState} from "react";

type Scope="TF"|"FA"|"AI Digital"|"Group";
type Metric="Revenue"|"OPEX"|"EBITDA"|"Gross profit"|"Gross margin"|"Average FTE"|"Revenue / FTE"|"EBITDA / FTE";
type Year="FY25/26"|"FY26/27"|"FY27/28"|"FY28/29";
type Value={value:number;quality:"exact"|"rounded";source:string;kind:"money"|"fte"|"percent"};

const scopes:Scope[]=["TF","FA","AI Digital","Group"];
const metrics:Metric[]=["Revenue","OPEX","EBITDA","Gross profit","Gross margin","Average FTE","Revenue / FTE","EBITDA / FTE"];
const years:Year[]=["FY25/26","FY26/27","FY27/28","FY28/29"];
const status:Record<Year,string>={"FY25/26":"Actual","FY26/27":"Approved budget","FY27/28":"Forecast","FY28/29":"Forecast"};

/* Historical mixed-source model retained temporarily for diff traceability only.
const legacyBase:Partial<Record<Scope,Partial<Record<Metric,Partial<Record<Year,Value>>>>>>={
  TF:{
    Revenue:{"FY25/26":{value:10.315906,quality:"exact",source:"TF Budget Forecast · operating-model revenue",kind:"money"},"FY26/27":{value:13.646785,quality:"exact",source:"TF Budget Forecast · operating-model revenue",kind:"money"},"FY27/28":{value:19.388691,quality:"exact",source:"TF Budget Forecast · operating-model revenue",kind:"money"},"FY28/29":{value:27.171264,quality:"exact",source:"TF Budget Forecast · operating-model revenue",kind:"money"}},
    OPEX:{"FY25/26":{value:4.464198,quality:"exact",source:"TF Budget Forecast · Opex Grand Total",kind:"money"},"FY26/27":{value:5.665363,quality:"exact",source:"TF Budget Forecast · Opex Grand Total",kind:"money"},"FY27/28":{value:5.984956,quality:"exact",source:"TF Budget Forecast · Opex Grand Total",kind:"money"},"FY28/29":{value:6.400846,quality:"exact",source:"TF Budget Forecast · Opex Grand Total",kind:"money"}},
    EBITDA:{"FY25/26":{value:.673220,quality:"exact",source:"TF Budget Forecast · EBITDA",kind:"money"},"FY26/27":{value:1.183021,quality:"exact",source:"TF Budget Forecast · EBITDA",kind:"money"},"FY27/28":{value:3.207846,quality:"exact",source:"TF Budget Forecast · EBITDA",kind:"money"},"FY28/29":{value:5.701258,quality:"exact",source:"TF Budget Forecast · EBITDA",kind:"money"}},
    "Gross profit":{"FY25/26":{value:5.137418,quality:"exact",source:"TF Budget Forecast · Gross Profit",kind:"money"},"FY26/27":{value:6.848383,quality:"exact",source:"TF Budget Forecast · Gross Profit",kind:"money"},"FY27/28":{value:9.192802,quality:"exact",source:"TF Budget Forecast · Gross Profit",kind:"money"},"FY28/29":{value:12.102104,quality:"exact",source:"TF Budget Forecast · Gross Profit",kind:"money"}},
    "Average FTE":{"FY25/26":{value:195,quality:"exact",source:"KPI Analysis · TF GP per average FTE baseline",kind:"fte"},"FY26/27":{value:310,quality:"rounded",source:"KPI Analysis · TF GP per average FTE target",kind:"fte"}}
  },
  FA:{
    Revenue:{"FY25/26":{value:23.738,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"},"FY26/27":{value:25.672456,quality:"exact",source:"FA budget · approved entity revenue",kind:"money"},"FY27/28":{value:29.902,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"},"FY28/29":{value:34.627,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"}},
    OPEX:{"FY25/26":{value:4.428,quality:"rounded",source:"Derived: $6.867M GP less $2.439M EBITDA",kind:"money"},"FY26/27":{value:4.155399,quality:"exact",source:"Derived: $7.759914M GP less $3.604515M EBITDA",kind:"money"}},
    EBITDA:{"FY25/26":{value:2.439,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"},"FY26/27":{value:3.604515,quality:"exact",source:"FA budget · approved entity EBITDA",kind:"money"},"FY27/28":{value:9.733,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"},"FY28/29":{value:11.572,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"}},
    "Gross profit":{"FY25/26":{value:6.867,quality:"rounded",source:"KPI Analysis · FA GP per FTE baseline",kind:"money"},"FY26/27":{value:7.759914,quality:"exact",source:"FA budget · approved Gross Profit",kind:"money"}},
    "Average FTE":{"FY25/26":{value:620,quality:"exact",source:"KPI Analysis · FA GP per average FTE baseline",kind:"fte"},"FY26/27":{value:761,quality:"exact",source:"KPI Analysis · FA GP per average FTE target",kind:"fte"},"FY27/28":{value:968,quality:"exact",source:"KPI Analysis · FA productivity outlook",kind:"fte"}}
  },
  Group:{
    Revenue:{"FY25/26":{value:33.336,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"},"FY26/27":{value:41.999,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"},"FY27/28":{value:58.684,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"},"FY28/29":{value:72.470,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"}},
    OPEX:{"FY25/26":{value:8.886464,quality:"rounded",source:"Derived: consolidated GP less full-group EBITDA",kind:"money"},"FY26/27":{value:9.717079,quality:"rounded",source:"Derived: consolidated GP less revised full-group EBITDA",kind:"money"},"FY27/28":{value:10.863088,quality:"rounded",source:"Derived: consolidated GP less reconciled full-group EBITDA",kind:"money"},"FY28/29":{value:12.698656,quality:"rounded",source:"Derived: consolidated GP less reconciled full-group EBITDA",kind:"money"}},
    EBITDA:{"FY25/26":{value:3.114496,quality:"exact",source:"Executive analysis · base-year EBITDA",kind:"money"},"FY26/27":{value:6.074545,quality:"exact",source:"Approved bridge: $3.835M TF+FA + $1.650M synergy + $0.590M AI",kind:"money"},"FY27/28":{value:15.133924,quality:"rounded",source:"Reconciled: $13.808M TF+FA post-synergy + $1.326M AI",kind:"money"},"FY28/29":{value:18.753324,quality:"rounded",source:"Reconciled: $17.267M TF+FA post-synergy + $1.486M AI",kind:"money"}},
    "Gross profit":{"FY25/26":{value:12.000960,quality:"rounded",source:"Executive analysis · 36.0% consolidated GP margin",kind:"money"},"FY26/27":{value:15.791624,quality:"rounded",source:"Executive analysis · 37.6% consolidated GP margin",kind:"money"},"FY27/28":{value:25.997012,quality:"rounded",source:"Executive analysis · 44.3% consolidated GP margin",kind:"money"},"FY28/29":{value:31.451980,quality:"rounded",source:"Executive analysis · 43.4% consolidated GP margin",kind:"money"}}
  },
  "AI Digital":{
    Revenue:{"FY25/26":{value:0,quality:"exact",source:"AI Pricing Model · pre-launch base",kind:"money"},"FY26/27":{value:2.133705,quality:"exact",source:"AI Pricing Model · expected case",kind:"money"},"FY27/28":{value:3.142,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"},"FY28/29":{value:3.409,quality:"rounded",source:"Executive analysis · full P&L summary",kind:"money"}},
    OPEX:{"FY26/27":{value:.575085,quality:"exact",source:"Derived: $1.164630M GP less $0.589545M EBITDA",kind:"money"},"FY27/28":{value:.750938,quality:"rounded",source:"Derived from published AI GP and EBITDA margins",kind:"money"},"FY28/29":{value:.749980,quality:"rounded",source:"Derived from published AI GP and EBITDA margins",kind:"money"}},
    EBITDA:{"FY25/26":{value:0,quality:"exact",source:"AI Pricing Model · pre-launch base",kind:"money"},"FY26/27":{value:.589545,quality:"exact",source:"AI Pricing Model · expected case",kind:"money"},"FY27/28":{value:1.325924,quality:"rounded",source:"Derived: $3.142M revenue × 42.2% EBITDA margin",kind:"money"},"FY28/29":{value:1.486324,quality:"rounded",source:"Derived: $3.409M revenue × 43.6% EBITDA margin",kind:"money"}},
    "Gross profit":{"FY26/27":{value:1.164630,quality:"exact",source:"AI Pricing Model · expected case",kind:"money"},"FY27/28":{value:2.076862,quality:"rounded",source:"Derived: $3.142M revenue × 66.1% GP margin",kind:"money"},"FY28/29":{value:2.236304,quality:"rounded",source:"Derived: $3.409M revenue × 65.6% GP margin",kind:"money"}}
  }
};

*/
const mv=(value:number,source:string,kind:Value["kind"]="money"):Value=>({value,quality:"exact",source,kind});
const yr=<T,>(a:T,b:T,c:T,d:T):Record<Year,T>=>({"FY25/26":a,"FY26/27":b,"FY27/28":c,"FY28/29":d});
const tfRev=yr(10.31590647042639,13.64686997210254,19.388691072366405,27.17126407236641);
const tfGp=yr(5.137417836416024,6.78677774164654,9.192801870971054,12.102104370971058);
const tfOpex=yr(4.464197611945767,5.61940390815206,5.984955791641385,6.400846331422508);
const tfEbitda=yr(.6732202244702568,1.16737383349448,3.2078460793296685,5.70125803954855);
const tfFte=yr(197.08333333333334,241.91666666666666,338.5,471);
const faRev=yr(23.75584142710095,25.672456056708313,35.37297952521662,40.68807858311977);
const faGp=yr(6.866949317100946,7.759914276904024,14.741781652674757,17.134799271712523);
const faOpex=yr(4.427495159999999,4.1553997493403805,5.00892169039228,5.563135291931846);
const faEbitda=yr(2.4394541571009466,3.6045145275636436,9.732859962282477,11.571663979780678);
const faFte:Partial<Record<Year,Value>>={"FY26/27":mv(711.4166666666666,"FA Budget Forecast · AVERAGE(X3:AI3)","fte"),"FY27/28":mv(879.5,"FA Budget Forecast · AVERAGE(AP3:BA3)","fte"),"FY28/29":mv(1118.3333333333333,"FA Budget Forecast · AVERAGE(BH3:BS3)","fte")};
const aiRev=yr(0,2.133705,3.14188875,3.4088023125);
const aiGp=yr(0,1.16463,2.07590625,2.2362215625);
const aiOpex=yr(0,.575085,.75012,.75012);
const aiEbitda=yr(0,.589545,1.32578625,1.4861015625);
const groupRev=yr(34.054371800426395,42.358888529074726,59.04402444758304,72.82955426798617);
const groupGp=yr(12.006188910107248,16.359813829270433,27.23355792364582,32.85355185518356);
const groupOpex=yr(8.891692771945769,10.28523079356678,11.621638483155785,12.578582647865202);
const groupEbitda=yr(3.1144961381614786,6.074583035703654,15.611919440490036,20.27496920731836);
const map=(values:Record<Year,number>,source:(year:Year)=>string,kind:Value["kind"]="money")=>Object.fromEntries(years.map(year=>[year,mv(values[year],source(year),kind)])) as Record<Year,Value>;
const base:Partial<Record<Scope,Partial<Record<Metric,Partial<Record<Year,Value>>>>>>={
  TF:{Revenue:map(tfRev,y=>`TF Budget Forecast · ${y} operating-model revenue (Gross Profit ÷ Gross Profit %)`),OPEX:map(tfOpex,y=>`TF Budget Forecast · ${y} Opex Grand Total`),EBITDA:map(tfEbitda,y=>`TF Budget Forecast · ${y} EBITDA`),"Gross profit":map(tfGp,y=>`TF Budget Forecast · ${y} Gross Profit`),"Average FTE":map(tfFte,y=>`TF Budget Forecast · ${y} average of 12 monthly headcount values`,"fte")},
  FA:{Revenue:map(faRev,y=>`FA Budget Forecast · ${y} operating-model revenue (Gross Profit ÷ Gross Profit %)`),OPEX:map(faOpex,y=>`FA Budget Forecast · ${y} Opex Grand Total`),EBITDA:map(faEbitda,y=>`FA Budget Forecast · ${y} EBITDA`),"Gross profit":map(faGp,y=>`FA Budget Forecast · ${y} Gross Profit`),"Average FTE":faFte},
  "AI Digital":{Revenue:map(aiRev,y=>y==="FY25/26"?"Pre-launch: AI Digital did not exist":"Tech Consolidated · Total Sales"),OPEX:map(aiOpex,y=>y==="FY25/26"?"Pre-launch: AI Digital did not exist; OPEX is zero":"Tech Consolidated · Infrastructure Costs Grand Total"),EBITDA:map(aiEbitda,y=>y==="FY25/26"?"Pre-launch: AI Digital did not exist":"Tech Consolidated · EBITDA"),"Gross profit":map(aiGp,y=>y==="FY25/26"?"Pre-launch: AI Digital did not exist":"Tech Consolidated · Gross Profit")},
  Group:{Revenue:map(groupRev,y=>`Excel consolidation: TF+FA revenue + AI Digital revenue · ${y}`),OPEX:map(groupOpex,y=>`Excel consolidation: TF+FA post-synergy OPEX + AI Digital OPEX · ${y}`),EBITDA:map(groupEbitda,y=>`Excel consolidation: TF+FA post-synergy EBITDA + AI Digital EBITDA · ${y}`),"Gross profit":map(groupGp,y=>`Excel consolidation: TF+FA Gross Profit + AI Digital Gross Profit · ${y}`)}
};

const auditNotes=[
  "Excel workbooks are the sole numerical source; narrative reports provide context only.",
  "TF includes every revenue line in its operating model, including lines omitted from the executive analysis.",
  "TF and FA entity views use their standalone operating models. Group uses the consolidated model, which also contains QGCC/other revenue and consolidation/shared costs; it is not a simple sum of the entity views.",
  "AI Digital did not exist in FY25/26, so Revenue, Gross profit, OPEX and EBITDA are zero for that period.",
  "Group OPEX and EBITDA include the $1.650M annual synergy from FY26/27 onward; no synergy is applied to FY25/26."
];

const modelIssues=scopes.flatMap(scope=>years.flatMap(year=>{
  const gp=base[scope]?.["Gross profit"]?.[year],opex=base[scope]?.OPEX?.[year],ebitda=base[scope]?.EBITDA?.[year];
  if(!gp||!opex||!ebitda)return[];
  return Math.abs(gp.value-opex.value-ebitda.value)>.001?[`${scope} ${year}: GP − OPEX does not reconcile to EBITDA`]:[];
}));

function valueFor(scope:Scope,metric:Metric,year:Year):Value|undefined{
  if(metric==="Gross margin"){
    const gp=base[scope]?.["Gross profit"]?.[year],revenue=base[scope]?.Revenue?.[year];
    if(!gp||!revenue||revenue.value===0)return undefined;
    return{value:gp.value/revenue.value*100,quality:gp.quality==="rounded"||revenue.quality==="rounded"?"rounded":"exact",source:`Calculated from ${gp.source} and ${revenue.source}`,kind:"percent"};
  }
  if(metric==="Revenue / FTE"||metric==="EBITDA / FTE"){
    const numerator=base[scope]?.[metric==="Revenue / FTE"?"Revenue":"EBITDA"]?.[year];
    const fte=base[scope]?.["Average FTE"]?.[year];
    if(!numerator||!fte||fte.value===0)return undefined;
    return{value:numerator.value*1_000_000/fte.value,quality:numerator.quality==="rounded"||fte.quality==="rounded"?"rounded":"exact",source:`Calculated from ${numerator.source} and ${fte.source}`,kind:"money"};
  }
  return base[scope]?.[metric]?.[year];
}
const fmt=(v:Value)=>v.kind==="fte"?`${v.value.toFixed(0)} FTE`:v.kind==="percent"?`${v.value.toFixed(2)}%`:v.value>=.1?`$${v.value.toFixed(3)}M`:`$${(v.value*1000).toFixed(1)}k`;
const fmtDelta=(n:number,kind:Value["kind"])=>`${n>=0?"+":"−"}${kind==="fte"?`${Math.abs(n).toFixed(0)} FTE`:kind==="percent"?`${Math.abs(n).toFixed(2)} pp`:`$${Math.abs(n).toFixed(3)}M`}`;
const pct=(a:number,b:number)=>a===0?null:(b-a)/a*100;

export default function BoardAnswerDesk(){
  const[selectedScopes,setScopes]=useState<Scope[]>(["TF"]);
  const[selectedMetrics,setMetrics]=useState<Metric[]>(["Revenue","Average FTE","Revenue / FTE"]);
  const[selectedYears,setYears]=useState<Year[]>(years);
  const toggle=<T extends string>(value:T,current:T[],setter:(next:T[])=>void)=>setter(current.includes(value)?current.filter(item=>item!==value):[...current,value]);
  const rows=useMemo(()=>selectedScopes.flatMap(scope=>selectedMetrics.map(metric=>{
    const values=selectedYears.map(year=>({year,value:valueFor(scope,metric,year)}));
    const first=values[0]?.value,last=values.at(-1)?.value;
    const change=first&&last&&values.length>1?last.value-first.value:null;
    const growth=first&&last&&values.length>1?pct(first.value,last.value):null;
    const intervals=values.length>1?years.indexOf(values.at(-1)!.year)-years.indexOf(values[0].year):0;
    const cagr=first&&last&&intervals>1&&first.value>0&&last.value>=0?(Math.pow(last.value/first.value,1/intervals)-1)*100:null;
    return{scope,metric,values,change,growth,cagr,kind:first?.kind||last?.kind};
  })),[selectedScopes,selectedMetrics,selectedYears]);
  const sources=[...new Set(rows.flatMap(row=>row.values.flatMap(v=>v.value?[v.value.source]:[])))];
  const missing=rows.reduce((total,row)=>total+row.values.filter(v=>!v.value).length,0);
  const toggleAllScopes=()=>setScopes(selectedScopes.length===scopes.length?[]:scopes);

  return <section className="answer-desk" aria-labelledby="answer-desk-title">
    <header><div><small>BoardLens evidence grid</small><h2 id="answer-desk-title">Choose. Compare. Answer.</h2></div><span>Grounded calculations · no guessing</span></header>
    <div className={`audit-banner ${modelIssues.length?"fail":"pass"}`}><b>{modelIssues.length?"Model check failed":"Internal P&L checks passed"}</b><span>Reconciled against the source models · {auditNotes.length} definition notes remain</span></div>
    <div className="decision-grid">
      <div className="selector-block"><div><b>01 · Entity</b><button type="button" onClick={toggleAllScopes}>{selectedScopes.length===scopes.length?"Clear all":"Compare all"}</button></div><div className="selector-options">{scopes.map(scope=><button type="button" aria-pressed={selectedScopes.includes(scope)} className={selectedScopes.includes(scope)?"selected":""} onClick={()=>toggle(scope,selectedScopes,setScopes)} key={scope}>{scope}</button>)}</div></div>
      <div className="selector-block"><div><b>02 · Measure</b><span>Select one or more</span></div><div className="selector-options">{metrics.map(metric=><button type="button" aria-pressed={selectedMetrics.includes(metric)} className={selectedMetrics.includes(metric)?"selected":""} onClick={()=>toggle(metric,selectedMetrics,setMetrics)} key={metric}>{metric}</button>)}</div></div>
      <div className="selector-block years"><div><b>03 · Period</b><span>One year shows value; multiple years show movement</span></div><div className="selector-options">{years.map(year=><button type="button" aria-pressed={selectedYears.includes(year)} className={selectedYears.includes(year)?"selected":""} onClick={()=>setYears(selectedYears.includes(year)?selectedYears.filter(item=>item!==year):years.filter(item=>selectedYears.includes(item)||item===year))} key={year}><strong>{year}</strong><small>{status[year]}</small></button>)}</div></div>
    </div>
    {!selectedScopes.length||!selectedMetrics.length||!selectedYears.length?<div className="empty-result">Select at least one entity, measure and period.</div>:<article className="grid-results">
      <div className="result-summary"><div><small>Board answer</small><h3>{rows.length} comparison{rows.length===1?"":"s"} ready</h3></div><div className={missing?"warning":"complete"}>{missing?`${missing} evidence gap${missing===1?"":"s"}`:"All selected values sourced"}</div></div>
      <div className="result-table-wrap"><table><thead><tr><th>Entity</th><th>Measure</th>{selectedYears.map(year=><th key={year}>{year}<small>{status[year]}</small></th>)}{selectedYears.length>1?<><th>Increase / decrease</th><th>Total change</th>{selectedYears.length>2?<th>CAGR</th>:null}</>:null}</tr></thead><tbody>{rows.map(row=><tr key={`${row.scope}-${row.metric}`}><th>{row.scope}</th><td>{row.metric}</td>{row.values.map(({year,value})=><td key={year}>{value?<><strong>{fmt(value)}</strong>{value.quality==="rounded"?<small>Approximate / derived</small>:null}</>:<span className="unavailable">Not in reconciled evidence</span>}</td>)}{selectedYears.length>1?<><td className={row.change!==null&&row.change<0?"negative":"positive"}>{row.change!==null&&row.kind?fmtDelta(row.change,row.kind):"—"}</td><td className={row.growth!==null&&row.growth<0?"negative":"positive"}>{row.growth===null?"n/m":`${row.growth>=0?"+":"−"}${Math.abs(row.growth).toFixed(1)}%`}</td>{selectedYears.length>2?<td className={row.cagr!==null&&row.cagr<0?"negative":"positive"}>{row.cagr===null?"n/m":`${row.cagr>=0?"+":"−"}${Math.abs(row.cagr).toFixed(1)}%`}</td>:null}</>:null}</tr>)}</tbody></table></div>
      <div className="answer-panels"><div><b>Calculation logic</b><p>Absolute change = ending value − starting value.<br/>Total change % = absolute change ÷ starting value.<br/>CAGR = (ending ÷ starting)^(1 ÷ years) − 1.<br/>Per-FTE measures use average—not closing—FTE.</p></div><div><b>Board interpretation</b><p>{selectedMetrics.includes("Average FTE")&&selectedMetrics.some(m=>m.includes("/ FTE"))?"This separates growth delivered by adding capacity from growth delivered through productivity.":"Add Average FTE and a per-FTE measure to distinguish capacity growth from productivity."}</p></div><div><b>Evidence control</b><p>{missing?"Missing or conflicting combinations remain visibly unavailable. No substitute values have been inferred.":"Every displayed number traces to the reconciled evidence listed below."}</p></div></div>
      <details className="audit-notes"><summary>Review definition and source notes ({auditNotes.length})</summary>{auditNotes.map(note=><p key={note}>{note}</p>)}</details>
      <details className="source-list"><summary>View sources used ({sources.length})</summary>{sources.map(source=><span key={source}>{source}</span>)}</details>
    </article>}
  </section>;
}
