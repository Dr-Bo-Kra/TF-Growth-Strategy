"use client";

import {useState} from "react";
import {buildDiagnostic,DiagnosticMetric,metricValue,tfMonthlyResults} from "./monthly-diagnostic-data";
import "./monthly-performance-diagnostic.css";

const metrics:DiagnosticMetric[]=["EBITDA","Revenue","Gross profit","OPEX"];
const money=(value:number)=>`${value<0?"−":""}$${Math.abs(value)>=1_000_000?`${(Math.abs(value)/1_000_000).toFixed(2)}M`:`${(Math.abs(value)/1000).toFixed(1)}k`}`;
const signed=(value:number)=>`${value>=0?"+":"−"}$${Math.abs(value)>=1_000_000?`${(Math.abs(value)/1_000_000).toFixed(2)}M`:`${(Math.abs(value)/1000).toFixed(1)}k`}`;
const signedPercent=(value:number)=>`${value>=0?"+":"−"}${Math.abs(value).toFixed(1)}%`;

export default function MonthlyPerformanceDiagnostic(){
  const [currentId,setCurrentId]=useState("2026-07");
  const [baseId,setBaseId]=useState("2026-06");
  const [metric,setMetric]=useState<DiagnosticMetric>("EBITDA");
  const current=tfMonthlyResults.find(item=>item.id===currentId)!;
  const base=tfMonthlyResults.find(item=>item.id===baseId)!;
  // Recalculate directly from the selected IDs on every render. This is
  // intentionally not memoised: some desktop webviews restore a select's
  // visible option before React state, which previously left a stale bridge.
  const diagnostic=buildDiagnostic(base,current);
  const currentValue=metricValue(current,metric);
  const baseValue=metricValue(base,metric);
  const movement=currentValue-baseValue;
  const movementPercent=baseValue===0?null:movement/Math.abs(baseValue)*100;
  const maxBridge=Math.max(Math.abs(base.ebitda),Math.abs(diagnostic.grossProfitImpact),Math.abs(diagnostic.opexImpact),Math.abs(current.ebitda),1);
  const gpShare=diagnostic.ebitdaMovement?Math.abs(diagnostic.grossProfitImpact/diagnostic.ebitdaMovement)*100:0;
  const opexShare=diagnostic.ebitdaMovement?Math.abs(diagnostic.opexImpact/diagnostic.ebitdaMovement)*100:0;
  const isJulyBridge=base.id==="2026-06"&&current.id==="2026-07";
  const boardAnswer=isJulyBridge
    ? `July EBITDA was ${money(current.ebitda)}, down ${money(Math.abs(diagnostic.ebitdaMovement))} from June. ${opexShare.toFixed(0)}% of the deterioration came from higher OPEX and ${gpShare.toFixed(0)}% from lower gross profit. The largest adverse movements were marketing, the unwind of June’s director-travel credit, lower Australia revenue and the start of AI consulting costs.`
    : `${current.label} ${metric} was ${money(currentValue)}, a ${movement>=0?"increase":"decrease"} of ${money(Math.abs(movement))} versus ${base.label}. ${metric==="EBITDA"?`The movement reconciles to ${signed(diagnostic.grossProfitImpact)} from gross profit and ${signed(diagnostic.opexImpact)} from OPEX.`:"Select EBITDA to view the profit bridge."}`;

  return <section className="monthly-diagnostic" aria-labelledby="monthly-diagnostic-title">
    <header>
      <div><small>Monthly performance diagnostic</small><h2 id="monthly-diagnostic-title">Ask why. See the bridge.</h2><p>Actuals remain locked. Forecast months are clearly labelled and never presented as reported performance.</p></div>
      <div className={`diagnostic-control ${diagnostic.reconciles?"pass":"fail"}`}><b>{diagnostic.reconciles?"Bridge reconciled":"Check required"}</b><span>Approved-source controlled · TF operating P&amp;L</span></div>
    </header>
    <div className="diagnostic-selectors">
      <label><span>01 · Entity</span><select value="TF" disabled><option>TF</option></select><small>FA, AI Digital and Group follow after their monthly actuals are loaded.</small></label>
      <label><span>02 · Measure</span><select value={metric} onChange={event=>setMetric(event.target.value as DiagnosticMetric)}>{metrics.map(item=><option key={item}>{item}</option>)}</select><small>Change this choice without losing the selected periods.</small></label>
      <label><span>03 · Reported month</span><select key={`current-${currentId}`} value={currentId} onInput={event=>setCurrentId(event.currentTarget.value)} onChange={event=>setCurrentId(event.currentTarget.value)}>{tfMonthlyResults.map(item=><option value={item.id} key={item.id}>{item.label} · {item.status}</option>)}</select><small>{current.source}</small></label>
      <label><span>04 · Compare with</span><select key={`base-${baseId}`} value={baseId} onInput={event=>setBaseId(event.currentTarget.value)} onChange={event=>setBaseId(event.currentTarget.value)}>{tfMonthlyResults.filter(item=>item.id!==currentId).map(item=><option value={item.id} key={item.id}>{item.label} · {item.status}</option>)}</select><small>{base.source}</small></label>
    </div>
    <div className="diagnostic-answer">
      <div className="answer-lead"><small>{metric} · {current.status}</small><strong>{money(currentValue)}</strong><span className={movement<0?"down":"up"}>{movement<0?"↓":"↑"} {money(Math.abs(movement))} · {movementPercent===null?"n/m":signedPercent(movementPercent)}</span></div>
      <div className="answer-narrative"><small>What to say</small><p>{boardAnswer}</p><button type="button" onClick={()=>navigator.clipboard?.writeText(boardAnswer)}>Copy board answer</button></div>
    </div>
    <article className="ebitda-bridge">
      <div className="bridge-heading"><div><small>Calculation</small><h3>{base.label} → {current.label}</h3></div><code>{money(base.ebitda)} {signed(diagnostic.grossProfitImpact)} {signed(diagnostic.opexImpact)} = {money(current.ebitda)}</code></div>
      <div className="waterfall" aria-label={`EBITDA bridge from ${base.label} to ${current.label}`}>
        {[
          {label:`${base.label} EBITDA`,value:base.ebitda,tone:"total"},
          {label:"Gross-profit movement",value:diagnostic.grossProfitImpact,tone:diagnostic.grossProfitImpact>=0?"positive":"negative"},
          {label:"OPEX movement",value:diagnostic.opexImpact,tone:diagnostic.opexImpact>=0?"positive":"negative"},
          {label:`${current.label} EBITDA`,value:current.ebitda,tone:"total"},
        ].map(item=><div className="waterfall-item" key={item.label}><div className="waterfall-plot"><div className={`waterfall-bar ${item.tone}`} style={{height:`${Math.max(12,Math.abs(item.value)/maxBridge*150)}px`}}><b>{signed(item.value)}</b></div></div><span>{item.label}</span></div>)}
      </div>
      <div className="bridge-proof"><div><span>Gross profit</span><b>{money(base.grossProfit)} → {money(current.grossProfit)}</b><small>{signed(diagnostic.grossProfitImpact)} EBITDA impact</small></div><div><span>OPEX</span><b>{money(base.opex)} → {money(current.opex)}</b><small>{signed(diagnostic.opexImpact)} EBITDA impact</small></div><div><span>Gross margin</span><b>{(base.grossProfit/base.revenue*100).toFixed(1)}% → {(current.grossProfit/current.revenue*100).toFixed(1)}%</b><small>{signedPercent((current.grossProfit/current.revenue-base.grossProfit/base.revenue)*100).replace("%"," pp")}</small></div><div><span>Headcount</span><b>{base.headcount} → {current.headcount}</b><small>{current.headcount-base.headcount>=0?"+":""}{current.headcount-base.headcount} people</small></div></div>
    </article>
    <article className="driver-ranking">
      <div className="driver-heading"><div><small>Account-level evidence</small><h3>{isJulyBridge?"What moved the result":"Top-level bridge available"}</h3></div><p>{isJulyBridge?"Ranked by absolute EBITDA effect from the revised workbook. Negative June expenses are credits or reversals and remain visible.":"Account-level movements are shown only when both selected periods are supported by a directly comparable approved source."}</p></div>
      {diagnostic.accountMovements.length?<div className="driver-table-wrap"><table><thead><tr><th>Account</th><th>{base.label}</th><th>{current.label}</th><th>EBITDA impact</th><th>Interpretation</th></tr></thead><tbody>{diagnostic.accountMovements.map(item=>{const impact=item.ebitdaImpact;return <tr key={item.label}><th>{item.label}<small>{item.group}</small></th><td>{money(item.base)}</td><td>{money(item.current)}</td><td className={impact<0?"negative":"positive"}>{signed(impact)}</td><td>{item.group!=="Revenue"&&item.base<0?"June credit/reversal unwound":"Period movement"}<small>{item.source}</small></td></tr>})}</tbody></table></div>:<div className="driver-empty">No unsupported account-level explanation has been invented for this comparison.</div>}
    </article>
    <details className="diagnostic-source"><summary>View calculation and evidence controls</summary><p>EBITDA movement = gross-profit movement − OPEX movement. June and July actuals come from “2607-TF Budget Forecast FY2026-27 Actuals @July 2026”, sheet “TF Only 290526”. July uses V19 revenue, V39 gross profit, V115 OPEX and V120 EBITDA. The workbook includes the $3.6k July FX loss within OPEX, so its EBITDA is −$49.4k and supersedes the earlier management-report presentation. August 2026 onward remains forecast.</p></details>
  </section>;
}
