"use client";

import { useMemo, useState } from "react";
import { approvedResult, approvedScenario, calculateScenario, solveGoal, type GoalMetric, type ScenarioInputs } from "./boardlens-model";

type Entity = "Group" | "TF" | "FA" | "AI Digital";
type ResultMetric = "Revenue" | "Gross profit" | "OPEX" | "EBITDA" | "EBITDA margin";
type Driver = { key: keyof ScenarioInputs; label: string; min: number; max: number; step: number; unit: string; source: string };
type MonthInput = { month: string; locked: boolean; tfFte: number; faFte: number; faUtilisation: number; aiAdoption: number; synergy: number };
type SavedScenario = { name: string; inputs: ScenarioInputs };

const drivers: Record<Exclude<Entity,"Group"> | "Group controls", Driver[]> = {
  TF: [
    {key:"tfAverageFte",label:"TF average headcount",min:180,max:280,step:1,unit:" FTE",source:"TF Budget Forecast · FY26/27 average monthly headcount"},
    {key:"tfUtilisation",label:"Revenue realisation",min:70,max:110,step:1,unit:"%",source:"100% = approved deployment and utilisation"},
    {key:"tfPrice",label:"Pricing",min:90,max:115,step:1,unit:"%",source:"100% = approved average pricing"},
    {key:"tfGrossMargin",label:"Gross margin",min:42,max:58,step:.1,unit:"%",source:"Updated TF Budget Forecast · approved 49.73%"},
    {key:"tfOpexChange",label:"OPEX change",min:-1.2,max:1.2,step:.05,unit:"M",source:"Management action versus updated $5.619M"},
  ],
  FA: [
    {key:"faAverageFte",label:"FA average headcount",min:550,max:850,step:1,unit:" FTE",source:"FA Budget Forecast · FY26/27 average monthly headcount"},
    {key:"faUtilisation",label:"Billing utilisation",min:75,max:95,step:1,unit:"%",source:"Approved operating guardrail: 88%"},
    {key:"faPrice",label:"Pricing",min:90,max:115,step:1,unit:"%",source:"100% = approved average billing rate"},
    {key:"faGrossMargin",label:"Gross margin",min:25,max:36,step:.1,unit:"%",source:"FA Budget Forecast · approved 30.23%"},
    {key:"faOpexChange",label:"OPEX change",min:-1,max:1,step:.05,unit:"M",source:"Management action versus approved $4.155M"},
  ],
  "AI Digital": [
    {key:"aiAdoption",label:"Client adoption",min:0,max:50,step:1,unit:"%",source:"AI Pricing Model · approved case 30%"},
    {key:"aiPrice",label:"Pricing",min:80,max:120,step:1,unit:"%",source:"100% = approved commercial model"},
    {key:"aiGrossMargin",label:"Gross margin",min:40,max:70,step:.1,unit:"%",source:"AI Pricing Model · approved 54.58%"},
    {key:"aiOpexChange",label:"OPEX change",min:-.3,max:.8,step:.025,unit:"M",source:"Change versus approved $575k infrastructure allocation"},
  ],
  "Group controls": [
    {key:"synergyRealisation",label:"Synergy realised",min:0,max:110,step:5,unit:"%",source:"Integration framework · approved annual register $1.650M"},
  ],
};

const allDrivers=Object.values(drivers).flat();
const goalMetrics: Array<{value:GoalMetric;label:string}>=[
  {value:"groupEbitda",label:"Group EBITDA"},{value:"groupRevenue",label:"Group revenue"},{value:"tfEbitda",label:"TF EBITDA"},{value:"faEbitda",label:"FA EBITDA"},{value:"aiEbitda",label:"AI Digital EBITDA"},
];
const months=["Jul 26","Aug 26","Sep 26","Oct 26","Nov 26","Dec 26","Jan 27","Feb 27","Mar 27","Apr 27","May 27","Jun 27"];
const actualsThrough=Date.UTC(2026,5,30);
const initialMonths:MonthInput[]=months.map((month,index)=>({month,locked:Date.UTC(2026+(index+6>=12?1:0),(index+6)%12,1)<=actualsThrough,tfFte:242,faFte:711,faUtilisation:88,aiAdoption:30,synergy:100}));
const builtInScenarios:SavedScenario[]=[
  {name:"Freeze TF hiring",inputs:{...approvedScenario,tfAverageFte:205}},
  {name:"Combined downside",inputs:{...approvedScenario,tfAverageFte:220,tfUtilisation:92,faAverageFte:650,faUtilisation:82,aiAdoption:15,synergyRealisation:60}},
];
const savedScenarioKey="boardlens-saved-scenarios-v1";
const money=(n:number)=>`${n<0?"−":""}$${Math.abs(n).toFixed(3)}M`;
const signed=(n:number)=>`${n>=0?"+":"−"}$${Math.abs(n).toFixed(3)}M`;
const pct=(n:number)=>`${n>=0?"+":"−"}${Math.abs(n).toFixed(1)}%`;
const average=(values:number[])=>values.reduce((sum,value)=>sum+value,0)/values.length;

export default function BoardLensScenarioEngine(){
  const [inputs,setInputs]=useState<ScenarioInputs>(approvedScenario);
  const [entity,setEntity]=useState<Entity>("Group");
  const [resultMetric,setResultMetric]=useState<ResultMetric>("EBITDA");
  const [view,setView]=useState<"annual"|"monthly">("annual");
  const [showMethod,setShowMethod]=useState(true);
  const [goalMetric,setGoalMetric]=useState<GoalMetric>("groupEbitda");
  const [goalDriver,setGoalDriver]=useState<keyof ScenarioInputs>("tfPrice");
  const [goalTarget,setGoalTarget]=useState(6.5);
  const [monthly,setMonthly]=useState<MonthInput[]>(initialMonths);
  const [savedScenarios,setSavedScenarios]=useState<SavedScenario[]>(()=>{try{if(typeof window!=="undefined"){const stored=window.localStorage.getItem(savedScenarioKey);if(stored)return JSON.parse(stored) as SavedScenario[];}}catch{/* Local persistence remains optional. */}return[];});
  const [saveOpen,setSaveOpen]=useState(false);
  const [scenarioName,setScenarioName]=useState("");
  const result=useMemo(()=>calculateScenario(inputs),[inputs]);
  const selected=entity==="Group"?result.group:result.entities[entity];
  const approved=entity==="Group"?approvedResult.group:approvedResult.entities[entity];
  const revenueDelta=selected.revenue-approved.revenue;
  const ebitdaDelta=selected.ebitda-approved.ebitda;
  const revenueGrowth=approved.revenue?revenueDelta/approved.revenue*100:0;
  const ebitdaGrowth=approved.ebitda?ebitdaDelta/Math.abs(approved.ebitda)*100:0;
  const chosenDriver=allDrivers.find(driver=>driver.key===goalDriver)!;
  const goal=useMemo(()=>solveGoal(inputs,goalMetric,goalDriver,goalTarget,chosenDriver.min,chosenDriver.max),[inputs,goalMetric,goalDriver,goalTarget,chosenDriver]);
  const update=(key:keyof ScenarioInputs,value:number)=>setInputs(current=>({...current,[key]:value}));
  const updateMonth=(index:number,key:keyof Omit<MonthInput,"month"|"locked">,value:number)=>setMonthly(current=>current.map((item,itemIndex)=>itemIndex===index&&!item.locked?{...item,[key]:value}:item));
  const applyMonthly=()=>setInputs(current=>({...current,tfAverageFte:average(monthly.map(item=>item.tfFte)),faAverageFte:average(monthly.map(item=>item.faFte)),faUtilisation:average(monthly.map(item=>item.faUtilisation)),aiAdoption:average(monthly.map(item=>item.aiAdoption)),synergyRealisation:average(monthly.map(item=>item.synergy))}));
  const persistSaved=(next:SavedScenario[])=>{setSavedScenarios(next);try{window.localStorage.setItem(savedScenarioKey,JSON.stringify(next));}catch{/* Continue without persistence when storage is unavailable. */}};
  const saveCurrent=()=>{const name=scenarioName.trim();if(!name)return;persistSaved([...savedScenarios.filter(item=>item.name.toLowerCase()!==name.toLowerCase()),{name,inputs:{...inputs}}]);setScenarioName("");setSaveOpen(false)};
  const removeSaved=(name:string)=>persistSaved(savedScenarios.filter(item=>item.name!==name));
  const displayValue=()=>{
    if(resultMetric==="Revenue")return money(selected.revenue);
    if(resultMetric==="Gross profit")return money(selected.grossProfit);
    if(resultMetric==="OPEX")return money(selected.opex);
    if(resultMetric==="EBITDA")return money(selected.ebitda);
    return `${(selected.ebitda/Math.max(selected.revenue,.0001)*100).toFixed(1)}%`;
  };

  return <section className="lens-engine" aria-labelledby="lens-engine-title">
    <header><div><small>BoardLens scenario engine</small><h2 id="lens-engine-title">Change the driver. See the consequence.</h2><p>FY26/27 management sensitivity · Excel-controlled approved case</p></div><div className="lens-scenario-actions"><button type="button" onClick={()=>setInputs(approvedScenario)}>Reset to approved case</button><details><summary>Saved scenarios <span>▾</span></summary><div>{[...builtInScenarios,...savedScenarios].map((scenario,index)=><div key={`${scenario.name}-${index}`}><button type="button" onClick={event=>{setInputs(scenario.inputs);(event.currentTarget.closest("details") as HTMLDetailsElement|null)?.removeAttribute("open")}}><b>{scenario.name}</b><small>{index<builtInScenarios.length?"Built-in scenario":"Your saved scenario"}</small></button>{index>=builtInScenarios.length?<button type="button" className="delete" aria-label={`Delete ${scenario.name}`} onClick={()=>removeSaved(scenario.name)}>×</button>:null}</div>)}{!savedScenarios.length?<p>Your saved scenarios will appear here.</p>:null}</div></details><button type="button" className="save-scenario" onClick={()=>setSaveOpen(value=>!value)}>Save current scenario</button>{saveOpen?<div className="scenario-save-form"><label htmlFor="scenario-name">Scenario name</label><input id="scenario-name" value={scenarioName} onChange={event=>setScenarioName(event.target.value)} onKeyDown={event=>{if(event.key==="Enter")saveCurrent()}} placeholder="e.g. UK delay + lower hiring"/><button type="button" disabled={!scenarioName.trim()} onClick={saveCurrent}>Save</button><button type="button" onClick={()=>setSaveOpen(false)}>Cancel</button></div>:null}</div></header>

    <section className="lens-question-builder" aria-label="Driver question builder"><div><b>Entity</b>{(["Group","TF","FA","AI Digital"] as Entity[]).map(item=><button type="button" key={item} className={entity===item?"active":""} onClick={()=>setEntity(item)}>{item}</button>)}</div><div><b>Measure</b>{(["Revenue","Gross profit","OPEX","EBITDA","EBITDA margin"] as ResultMetric[]).map(item=><button type="button" key={item} className={resultMetric===item?"active":""} onClick={()=>setResultMetric(item)}>{item}</button>)}</div><div><b>View</b><button type="button" className={view==="annual"?"active":""} onClick={()=>setView("annual")}>Annual</button><button type="button" className={view==="monthly"?"active":""} onClick={()=>setView("monthly")}>Monthly phasing</button></div></section>
    <div className="lens-query-answer"><span>{entity} · {resultMetric} · FY26/27 scenario</span><strong>{displayValue()}</strong><p>Change from approved: {resultMetric==="Revenue"?signed(revenueDelta):resultMetric==="EBITDA"?signed(ebitdaDelta):"shown in the scorecard and calculation bridge below"}.</p></div>

    <div className="lens-scorecard">
      <article><small>{entity} revenue</small><strong>{money(selected.revenue)}</strong><span className={revenueDelta<0?"bad":"good"}>{signed(revenueDelta)} · {pct(revenueGrowth)}</span></article>
      <article><small>Gross profit</small><strong>{money(selected.grossProfit)}</strong><span>{(selected.grossProfit/Math.max(selected.revenue,.0001)*100).toFixed(1)}% margin</span></article>
      <article><small>OPEX</small><strong>{money(selected.opex)}</strong><span>{signed(selected.opex-approved.opex)} vs approved</span></article>
      <article className="primary"><small>{entity} EBITDA</small><strong>{money(selected.ebitda)}</strong><span className={ebitdaDelta<0?"bad":"good"}>{signed(ebitdaDelta)} · {pct(ebitdaGrowth)}</span></article>
    </div>

    {view==="monthly"?<section className="lens-monthly"><header><div><small>Monthly phasing</small><h3>Completed driver months lock when the complete driver pack is loaded.</h3><p>TF’s July operating P&amp;L is now available in the Monthly Diagnostic. This driver grid remains editable because July FA headcount, FA utilisation and synergy actuals have not yet been supplied.</p></div><button type="button" onClick={applyMonthly}>Apply monthly averages to scenario</button></header><div className="lens-month-table"><table><thead><tr><th>Month</th><th>Status</th><th>TF FTE</th><th>FA FTE</th><th>FA utilisation</th><th>AI adoption</th><th>Synergy realised</th></tr></thead><tbody>{monthly.map((item,index)=><tr key={item.month} className={item.locked?"locked":""}><th>{item.month}</th><td>{item.locked?"Actual · locked":"Forecast · editable"}</td><td><input aria-label={`${item.month} TF FTE`} disabled={item.locked} type="number" value={item.tfFte} onChange={event=>updateMonth(index,"tfFte",Number(event.target.value))}/></td><td><input aria-label={`${item.month} FA FTE`} disabled={item.locked} type="number" value={item.faFte} onChange={event=>updateMonth(index,"faFte",Number(event.target.value))}/></td><td><input aria-label={`${item.month} FA utilisation`} disabled={item.locked} type="number" value={item.faUtilisation} onChange={event=>updateMonth(index,"faUtilisation",Number(event.target.value))}/><span>%</span></td><td><input aria-label={`${item.month} AI adoption`} disabled={item.locked} type="number" value={item.aiAdoption} onChange={event=>updateMonth(index,"aiAdoption",Number(event.target.value))}/><span>%</span></td><td><input aria-label={`${item.month} synergy realised`} disabled={item.locked} type="number" value={item.synergy} onChange={event=>updateMonth(index,"synergy",Number(event.target.value))}/><span>%</span></td></tr>)}</tbody></table></div></section>:<div className="lens-body">
      <div className="lens-controls">{(Object.keys(drivers) as Array<keyof typeof drivers>).map(group=><section key={group}><h3>{group}</h3>{drivers[group].map(driver=><label key={driver.key}><span><b>{driver.label}</b><output>{driver.unit==="M"?signed(inputs[driver.key]):`${inputs[driver.key]}${driver.unit}`}</output></span><input type="range" min={driver.min} max={driver.max} step={driver.step} value={inputs[driver.key]} onChange={event=>update(driver.key,Number(event.target.value))}/><small>{driver.source}</small></label>)}</section>)}</div>
      <div className="lens-analysis"><section className="lens-answer"><small>Answer to the Board</small>{inputs.tfAverageFte===205&&inputs.tfUtilisation===100&&inputs.tfPrice===100?<><h3>Freezing TF hiring reduces TF EBITDA to {money(result.entities.TF.ebitda)}.</h3><p>That is {signed(result.entities.TF.ebitda-approvedResult.entities.TF.ebitda)} against the approved case. Group EBITDA becomes {money(result.group.ebitda)}.</p></>:<><h3>{entity} EBITDA becomes {money(selected.ebitda)}.</h3><p>Revenue changes by {signed(revenueDelta)} and EBITDA changes by {signed(ebitdaDelta)} versus the approved FY26/27 case.</p></>}</section>
        <section className="lens-goal"><small>Goal-seek</small><h3>What must change to reach the target?</h3><div><label>Outcome<select value={goalMetric} onChange={event=>setGoalMetric(event.target.value as GoalMetric)}>{goalMetrics.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label>Target ($M)<input type="number" step="0.1" value={goalTarget} onChange={event=>setGoalTarget(Number(event.target.value))}/></label><label>Driver<select value={goalDriver} onChange={event=>setGoalDriver(event.target.value as keyof ScenarioInputs)}>{allDrivers.map(driver=><option key={driver.key} value={driver.key}>{driver.label}</option>)}</select></label></div>{goal.reachable&&goal.value!==null?<p><b>{chosenDriver.label} must be {goal.value.toFixed(chosenDriver.step<1?2:1)}{chosenDriver.unit}</b> to produce approximately {money(goal.result!)}. <button type="button" onClick={()=>update(goalDriver,goal.value!)}>Apply this solution</button></p>:<p className="unreachable">The target is outside this driver’s tested range ({money(goal.range[0])} to {money(goal.range[1])}). Change the driver, broaden the assumption range or use multiple levers.</p>}</section>
        <section className="lens-bridge"><header><b>Group EBITDA bridge</b><span>{money(result.group.ebitda)}</span></header><div><span>TF EBITDA</span><b>{money(result.entities.TF.ebitda)}</b></div><div><span>FA EBITDA</span><b>{money(result.entities.FA.ebitda)}</b></div><div><span>Shared consolidation cost</span><b>−{money(result.bridge.sharedConsolidationCost)}</b></div><div><span>Realised synergies</span><b>{money(result.bridge.synergy)}</b></div><div><span>AI Digital EBITDA</span><b>{money(result.bridge.aiEbitda)}</b></div></section>
        <section className="lens-formula"><button type="button" onClick={()=>setShowMethod(value=>!value)} aria-expanded={showMethod}>Calculation and sources <span>{showMethod?"−":"+"}</span></button>{showMethod?<div><p><b>TF revenue</b> = [$10.700M freeze-hiring anchor + (average FTE − 205) × ${Math.round(result.mechanics.tfRevenuePerIncrementalFte*1_000_000).toLocaleString()}] × revenue realisation × pricing.</p><p><b>TF EBITDA</b> = revenue × gross margin − approved OPEX − committed-cost drag − management OPEX change.</p><p><b>FA revenue</b> = $25.672M × headcount factor × utilisation factor × pricing factor.</p><p><b>AI revenue</b> = $2.134M × adoption factor × pricing factor.</p><p><b>Group EBITDA</b> = TF EBITDA + FA EBITDA − $0.953M shared consolidation cost + realised synergies + AI Digital EBITDA.</p><small>Sources: TF Budget Forecast; FA Budget Forecast; Tech Consolidated; TF+FA Consolidated; Board Q&amp;A headcount scenario. The $10.700M / 205-FTE freeze anchor and $271k committed-cost drag are explicit management-scenario calibrations, not actuals.</small></div>:null}</section>
      </div>
    </div>}
  </section>;
}
