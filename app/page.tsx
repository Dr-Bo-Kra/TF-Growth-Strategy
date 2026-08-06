"use client";
import "./drilldowns.css";

import { useEffect, useState, type ReactNode } from "react";

const nav = [
  ["thesis", "01", "Thesis"], ["trajectory", "02", "Trajectory"],
  ["engines", "03", "Growth engines"], ["scenarios", "04", "Scenarios"],
  ["operating", "05", "Operating plan"], ["decisions", "06", "Board decisions"],
] as const;

const money = (value: number) => `$${value.toFixed(1)}M`;

const drilldowns: Record<string, { eyebrow:string; title:string; value:string; summary:string; rows:[string,string][]; assumption:string; action:string; source:string }> = {
  "target-revenue": { eyebrow:"Group trajectory", title:"FY28/29 group revenue", value:"$72.5M", summary:"The revised executive case more than doubles the FY25/26 base through three distinct growth engines.", rows:[["FA / FLA","$34.6M"],["Talent Formula","$26.8M"],["AI Digital","$3.4M"],["Other / acquisition uplift","$7.7M"]], assumption:"29.5% group revenue CAGR from the $33.3M base.", action:"Review entity performance quarterly against the bridge, not only the consolidated total.", source:"Executive analysis · Full P&L summary" },
  "target-margin": { eyebrow:"Profitability", title:"FY28/29 EBITDA margin", value:"23.8%", summary:"Margin expansion is driven by FA operating leverage, AI contribution and the recurring synergy register.", rows:[["FY25/26","9.3%"],["FY26/27","12.3%"],["FY27/28","23.5%"],["FY28/29","23.8%"]], assumption:"Includes $1.65M annual post-integration synergies.", action:"Track pre- and post-synergy EBITDA separately so delivery slippage remains visible.", source:"Executive analysis · Four-year financial trajectory" },
  "synergies": { eyebrow:"Integration", title:"Annual synergy register", value:"$1.65M", summary:"An itemised operating register replaces the single-line budget assumption and assigns accountable owners.", rows:[["Shared services","$480k"],["Technology platforms","$320k"],["Facilities","$240k"],["AI cross-sell","$336k"],["Procurement + recruitment","$274k"]], assumption:"Approximately $690k is expected in Q1-Q2, with the remainder in H2.", action:"Approve named owners and include realised-versus-plan reporting in every Board pack.", source:"Executive analysis · Synergy register" },
  "client-base": { eyebrow:"Distribution", title:"Combined client base", value:"410", summary:"The existing relationships form the distribution advantage for AI Digital, but they become addressable in phases.", rows:[["TF clients","50+ · available first"],["FA clients","180+ · from September"],["Backroom clients","Available post-February"],["Expected AI conversions","~123 phased"]], assumption:"The 30% expected adoption case is not applied to all 410 clients from day one.", action:"Report eligible clients, converted clients and revenue per live client monthly.", source:"Executive analysis · AI adoption model" },
  "revenue-26": { eyebrow:"FY2026/27", title:"Group revenue", value:"$42.0M", summary:"The revised case grows 26.1% year on year, led by TF expansion, FA scale and the first year of AI Digital.", rows:[["FA / FLA","$25.7M"],["Talent Formula","$13.3M"],["AI Digital","$2.1M"],["Year-on-year growth","+26.1%"]], assumption:"FA revenue commences in September; Backroom contribution follows the February acquisition.", action:"Use the $42.0M revised case as the board baseline; do not blend it with the earlier dashboard case.", source:"Executive analysis · Group KPIs" },
  "gp-26": { eyebrow:"FY2026/27", title:"Group gross profit", value:"$15.8M", summary:"The group mix produces a 37.6% gross margin, with AI Digital providing the highest unit margin.", rows:[["Group GP margin","37.6%"],["FA GP margin","30.2%"],["TF GP margin","51.5%"],["AI GP margin","54.6%"]], assumption:"Mix shifts materially in later years as FA digital revenue and AI adoption scale.", action:"Monitor GP per FTE and pricing uplift alongside the headline margin.", source:"Executive analysis · Full P&L summary" },
  "ebitda-26": { eyebrow:"FY2026/27", title:"Post-synergy EBITDA", value:"$5.2M", summary:"The revised case lifts group EBITDA margin to 12.3% after synergies.", rows:[["FA EBITDA","$3.6M"],["AI Digital EBITDA","$0.6M"],["Annual synergy register","$1.65M"],["Group margin","12.3%"]], assumption:"Synergies are phased and must be tracked separately from underlying entity performance.", action:"Require monthly owner-level evidence for every realised synergy.", source:"Executive analysis · Full P&L and synergy register" },
  "fa-engine": { eyebrow:"Growth engine A", title:"FA / FLA FY26/27 revenue", value:"$25.7M", summary:"FA is the group scale engine and the largest contributor to consolidated revenue.", rows:[["FY25/26 revenue","$23.7M"],["FY26/27 revenue","$25.7M"],["FY28/29 revenue","$34.6M"],["FY28/29 EBITDA margin","28.4%"]], assumption:"Headcount reaches 761 in FY26/27 and facilities commitments remain staged.", action:"Alert the Board at 5% and 10% headcount misses; tie leases to 80% attainment.", source:"Dashboard + executive analysis · FA plan" },
  "tf-engine": { eyebrow:"Growth engine B", title:"Talent Formula FY26/27 revenue", value:"$13.3M", summary:"TF is the fastest-growing service engine, powered by geographic expansion and recruitment capability.", rows:[["FY25/26 revenue","$9.6M"],["FY26/27 revenue","$13.3M"],["FY28/29 revenue","$26.8M"],["Four-year CAGR","41.3%"]], assumption:"The UK plan requires a 79% year-on-year increase and stronger named pipeline coverage.", action:"Appoint the UK Growth Lead and reach 1.5× qualified coverage before Q2 lock.", source:"Dashboard + executive analysis · TF plan" },
  "ai-engine": { eyebrow:"Growth engine C", title:"AI Digital FY26/27 revenue", value:"$2.13M", summary:"AI Digital is the highest-margin engine and converts the client base into recurring platform economics.", rows:[["Gross profit","$1.17M"],["Gross margin","54.6%"],["EBITDA","$590k"],["EBITDA margin","27.6%"]], assumption:"Expected case assumes 30% phased adoption across clients available during the year.", action:"Use a six-month gate and pause incremental opex if performance is below the bear case.", source:"Dashboard + executive analysis · AI Digital" },
  "pipeline": { eyebrow:"Leading indicator", title:"Qualified pipeline coverage", value:"1.5×", summary:"Coverage is the Board's early-warning measure for quarterly revenue delivery, particularly in the UK.", rows:[["Current UK coverage","~1.25×"],["Budget-lock threshold","1.5×"],["Existing / expansion","$1.72M committed"],["Active proposals","$1.43M high confidence"]], assumption:"Weighted opportunity values reflect stage confidence and expected close timing.", action:"Show named opportunities and movement in the monthly Board pack.", source:"Executive analysis · UK pipeline validation" },
};

export default function Home() {
  const [active, setActive] = useState("thesis");
  const [scenario, setScenario] = useState<"bear" | "expected" | "stretch">("expected");
  const [selected, setSelected] = useState<string | null>(null);
  const scenarios = {
    bear: { adoption: "15%", clients: "~62", revenue: 1.07, gp: 0.32, ebitda: -0.25, note: "Pause new AI opex if the plan tracks below this case at month six." },
    expected: { adoption: "30%", clients: "~123", revenue: 2.13, gp: 1.165, ebitda: 0.59, note: "Budget case: phased conversion of the addressable combined client base." },
    stretch: { adoption: "45%", clients: "~185", revenue: 3.2, gp: 1.9, ebitda: 1.45, note: "Upside case supported by an accelerated sales hire and faster TF conversion." },
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { threshold: [0.3, 0.55] });
    nav.forEach(([id]) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { window.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [selected]);

  const Drill = ({ id, children, className = "" }: { id:string; children:ReactNode; className?:string }) => <button type="button" className={`drill ${className}`} onClick={() => setSelected(id)} aria-label={`Explore ${drilldowns[id]?.title || "metric"}`}>{children}<i aria-hidden="true">+</i></button>;
  const currentDetail = selected === "ai-scenario" ? {
    eyebrow:`AI Digital · ${scenario} case`, title:"FY26/27 scenario revenue", value:money(scenarios[scenario].revenue), summary:scenarios[scenario].note,
    rows:([["Adoption rate",scenarios[scenario].adoption],["Clients converted",scenarios[scenario].clients],["Gross profit",money(scenarios[scenario].gp)],["EBITDA",scenarios[scenario].ebitda < 0 ? `(${money(Math.abs(scenarios[scenario].ebitda))})` : money(scenarios[scenario].ebitda)]] as [string,string][]),
    assumption:"Eligible clients enter the funnel in phases: TF first, FA from September and Backroom after February.", action:"Compare actual conversions, live customers and revenue per customer with this case every month.", source:"Executive analysis · AI Digital three-scenario adoption model"
  } : selected ? drilldowns[selected] : null;

  return <main>
    <header className="masthead">
      <a className="wordmark" href="#thesis"><img src="/tf-logo-wide.png" alt="Talent Formula" /></a>
      <div className="confidential">Confidential · FY2026-27</div>
      <a className="jump" href="#decisions">Board asks <span>↘</span></a>
    </header>

    <aside className="rail" aria-label="Board plan chapters">
      <div className="rail-line" />
      {nav.map(([id, number, label]) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""}><i>{number}</i><span>{label}</span></a>)}
    </aside>

    <section id="thesis" className="chapter opening">
      <div className="opening-copy">
        <p className="kicker">Board plan · Revised executive case</p>
        <h1>Build the category.<br/><em>Compound the engine.</em></h1>
        <p className="lede">A professional-services platform where specialist offshore accounting, a proven recruitment engine and proprietary AI reinforce one another.</p>
        <div className="signal-row"><div><b>3</b><span>growth engines</span></div><div><Drill id="client-base">410</Drill><span>combined clients</span></div><div><Drill id="synergies">$1.65M</Drill><span>annual synergies</span></div></div>
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
          {[{y:"FY25/26",r:33.3,e:3.1},{y:"FY26/27",r:42.0,e:5.2},{y:"FY27/28",r:58.7,e:13.8},{y:"FY28/29",r:72.5,e:17.3}].map((d,i)=><div className="year" key={d.y}><div className="bars"><button type="button" aria-label={`Explore ${d.y} revenue`} onClick={()=>setSelected(i===1?"revenue-26":"target-revenue")} className="revenue" style={{height:`${d.r/72.5*100}%`}}><span>{money(d.r)}</span></button><button type="button" aria-label={`Explore ${d.y} EBITDA`} onClick={()=>setSelected(i===1?"ebitda-26":"target-margin")} className="ebitda" style={{height:`${Math.max(d.e/17.3*74,6)}%`}}><span>{money(d.e)}</span></button></div><b>{d.y}</b><small>{["9.3%","12.3%","23.5%","23.8%"][i]} margin</small></div>)}
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
    </section>

    <section id="scenarios" className="chapter scenario-section">
      <div className="chapter-label"><span>04</span><p>AI adoption scenarios</p></div>
      <div className="section-intro"><h2>Fund the expected case.<br/><em>Gate the downside.</em></h2><p>Revenue is phased because TF clients are available first, FA clients from September and Backroom clients after the February acquisition.</p></div>
      <div className="scenario-tabs" role="tablist">{(["bear","expected","stretch"] as const).map(s=><button key={s} role="tab" aria-selected={scenario===s} onClick={()=>setScenario(s)} className={scenario===s?"active":""}>{s === "expected" ? "Expected · budget" : s}</button>)}</div>
      <div className="scenario-card">
        <div className="scenario-lead"><span>{scenario} case</span><strong>{scenarios[scenario].adoption}</strong><p>client adoption</p></div>
        <div className="scenario-stat"><small>Clients converted</small><b>{scenarios[scenario].clients}</b></div>
        <div className="scenario-stat"><small>FY26/27 revenue</small><Drill id="ai-scenario">{money(scenarios[scenario].revenue)}</Drill></div>
        <div className="scenario-stat"><small>Gross profit</small><b>{money(scenarios[scenario].gp)}</b></div>
        <div className="scenario-stat"><small>EBITDA</small><b className={scenarios[scenario].ebitda < 0 ? "negative":""}>{scenarios[scenario].ebitda < 0 ? `(${money(Math.abs(scenarios[scenario].ebitda))})` : money(scenarios[scenario].ebitda)}</b></div>
      </div>
      <div className="scenario-note"><b>Management response</b><p>{scenarios[scenario].note}</p></div>
      <div className="pricing"><span>Commercial model</span><div><b>$15,000</b><small>initiation</small></div><i>+</i><div><b>$2,700</b><small>platform / month</small></div><i>+</i><div><b>$1,800</b><small>AI employee / month</small></div></div>
    </section>

    <section id="operating" className="chapter operating-section">
      <div className="chapter-label"><span>05</span><p>Operating plan</p></div>
      <div className="section-intro"><h2>Manage the plan<br/>through <em>leading indicators.</em></h2><p>Financial results are lagging evidence. These checkpoints show whether execution is on course before the P&L confirms it.</p></div>
      <div className="operating-grid">
        <div className="kpi-board">
          {[ ["FLA billing utilisation",">88%"],["Client retention",">92%"],["Net revenue retention",">105%"],["Pipeline coverage","1.5×"],["Win rate",">40%"],["FLA turnover","<18%"],["Time to recruit","<28 days"],["AI active customers","69"] ].map(([label,value],i)=><article key={label}><span>{String(i+1).padStart(2,"0")}</span><p>{label}</p>{label==="Pipeline coverage"?<Drill id="pipeline">{value}</Drill>:<b>{value}</b>}</article>)}
        </div>
        <div className="risk-register"><div className="risk-title"><small>Risk register</small><b>Watch what can break the case</b></div>{[
          ["FLA headcount ramp","High","Each 10% miss ≈ $1.5M revenue exposure"],
          ["UK revenue plan","High","20% miss ≈ $250k EBITDA impact"],
          ["AI adoption","High","Bear case produces ($250k) EBITDA"],
          ["TF gross margin","Medium","53.5% → 45.1% over four years"],
          ["Facilities step-up","Medium","Commit only after 80% headcount milestone"],
        ].map(([risk,level,note])=><article key={risk}><div><b>{risk}</b><em className={level.toLowerCase()}>{level}</em></div><p>{note}</p></article>)}</div>
      </div>
      <div className="synergy-strip"><div><small>Annual synergy register</small><Drill id="synergies">$1.65M</Drill></div><span><b>$480k</b> shared services</span><span><b>$320k</b> technology</span><span><b>$240k</b> facilities</span><span><b>$336k</b> AI cross-sell</span><span><b>$274k</b> procurement + recruitment</span></div>
    </section>

    <section id="decisions" className="chapter decisions-section">
      <div className="chapter-label"><span>06</span><p>Board decisions</p></div>
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
      <div className="close"><div><img src="/tf-logo-mark.png" alt="Talent Formula"/><b>FY2026-27 Board Plan</b></div><p>Scale the platform.<br/>Protect the downside.</p></div>
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
    <footer><span>Confidential · Board privileged</span><span>Prepared August 2026 · Revised executive case</span></footer>
  </main>;
}
