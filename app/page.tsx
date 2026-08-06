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
  const [growthOpen, setGrowthOpen] = useState(false);
  const [growthTab, setGrowthTab] = useState<"why"|"different"|"market"|"moat"|"priorities"|"risks">("why");
  const [riskOpen, setRiskOpen] = useState<string | null>("FLA headcount scale-up");
  const [priorityOpen, setPriorityOpen] = useState<string | null>("Integrate Frontline Accounting");
  const [moatOpen, setMoatOpen] = useState("Accounting specialisation");
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
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setSelected(null); setGrowthOpen(false); } };
    window.addEventListener("keydown", close);
    document.body.style.overflow = selected || growthOpen ? "hidden" : "";
    return () => { window.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [selected, growthOpen]);

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
      <div className="header-actions"><button type="button" onClick={()=>setGrowthOpen(true)}>Growth case <span>+</span></button><a className="jump" href="#decisions">Board asks <span>↘</span></a></div>
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
      <button className="growth-entry" type="button" onClick={()=>setGrowthOpen(true)}><span>Strategic growth case</span><b>Why this market, why now, and why Talent Formula</b><i>Explore →</i></button>
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
          </div><div className="timing-strip"><b>The window</b><p>Clients want cost relief and automation together. Competitors typically offer one or the other; Talent Formula is assembling both under one contract.</p></div></section>}
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
              ["People + AI integration","One integrated contract","Talent Formula combines specialist offshore accounting talent with a purpose-built AI platform in one operating model and one client proposition.","Pure-play staffing lacks proprietary automation; pure-play SaaS lacks domain delivery capability and implementation depth.","Clients receive expert humans and intelligent automation together, increasing value, stickiness and share of wallet."]
            ].map(([title,proof,detail,difference,value],i)=><button key={title} type="button" className={moatOpen===title?"active":""} onClick={()=>setMoatOpen(title)}><span>{String(i+1).padStart(2,"0")}</span><b>{title}</b><small>{proof}</small><i>→</i></button>)}
          </div>{[
              ["Accounting specialisation","761 FLA specialists","We do not serve every industry—we go deep in accounting. FA/FLA's 761 specialist offshore accountants are trained on local compliance frameworks and delivery requirements.","Generalist offshore providers cannot match the same domain depth and quality consistency.","Specialisation supports premium pricing, stronger client trust and higher retention."],
              ["Proven delivery","600+ placements","FA has already placed and managed 600+ offshore accounting FTEs across ANZ firms at scale. Hiring pipelines, onboarding systems and quality frameworks are built and operational.","The budget is scaling an engine that already runs; it is not underwriting start-up execution risk.","Existing infrastructure shortens time to revenue and lowers the risk of the 620-to-761 headcount ramp."],
              ["AI-first operating model","54.6% gross margin","AI Digital is embedded in how the group services clients rather than sold as an unrelated bolt-on. The platform is already deployed across the FA and TF client base.","Every deployment produces workflow learning: more clients create more data, better automation and stronger retention.","A high-margin digital layer can compound on top of the existing delivery base at low marginal cost."],
              ["Recruitment engine","AUD · UK · US","TF can source, assess and place accounting talent across Australia, the UK and emerging US markets. This capability directly supports FA's planned scale to 968 FTEs in FY27/28.","Speed and cross-market reach create a practical moat that captive or local providers struggle to reproduce.","The same engine supports organic growth, acquisition integration and new-market entry."],
              ["Client relationships & implementation","410 combined clients","FA's 180+ managed-service clients, TF's 50+ active clients and the Backroom client base create a combined distribution channel for AI Digital.","The group is upselling trusted relationships rather than acquiring SaaS customers through cold prospecting.","Near-zero incremental customer-acquisition cost makes AI adoption more defensible than a greenfield SaaS model."],
              ["People + AI integration","One integrated contract","Talent Formula combines specialist offshore accounting talent with a purpose-built AI platform in one operating model and one client proposition.","Pure-play staffing lacks proprietary automation; pure-play SaaS lacks domain delivery capability and implementation depth.","Clients receive expert humans and intelligent automation together, increasing value, stickiness and share of wallet."]
            ].filter(([title])=>title===moatOpen).map(([title,proof,detail,difference,value])=><div className="moat-stage" key={title}><div className="moat-stage-head"><small>Selected advantage</small><h4>{title}</h4><strong>{proof}</strong></div><div className="moat-stage-grid"><div><small>Operational proof</small><p>{detail}</p></div><div><small>Why it is different</small><p>{difference}</p></div><div className="value"><small>Strategic value</small><p>{value}</p></div></div></div>)}<div className="moat-proof"><span>More clients</span><i>→</i><span>More workflow data</span><i>→</i><span>Better AI</span><i>→</i><span>Higher retention</span></div></section>}
          {growthTab==="priorities" && <section className="growth-priorities"><div className="growth-title"><small>FY2027 priorities</small><h3>Turn the thesis into<br/><em>sequenced execution.</em></h3><p>Growth depends on a small number of linked moves. Expand each priority to see why it matters, the evidence behind it and the proof point the Board should require.</p></div><div className="priority-evidence-list">
            {[
              ["Integrate Frontline Accounting","Realise the $1.65M synergy register and establish one operating model.","Owner-level monthly reporting","The acquisition case depends on shared services, technology, facilities and cross-sell benefits becoming operating reality—not remaining spreadsheet assumptions.","Executive analysis · Sections 05, 07 and 10","McKinsey reports that effective implementation of the combined operating model makes organisations more likely to meet or exceed cost and revenue synergy targets.","McKinsey · Unlocking merger value through operating model design","https://www.mckinsey.com/capabilities/m-and-a/our-insights/unlocking-merger-value-through-operating-model-design"],
              ["Scale AI Digital","Convert 30% of the phased addressable client base.","69 active customers","AI Digital is the highest-margin engine and creates recurring revenue from relationships the group already owns. Delaying conversion leaves the strongest operating leverage unrealised.","Executive analysis · Sections 03, 09 and 12","Thomson Reuters finds professional-services firms are moving beyond individual AI use toward organisation-wide strategy, workforce planning and client conversations.","Thomson Reuters · 2025 Generative AI in Professional Services","https://www.thomsonreuters.com/en/reports/2025-generative-ai-in-professional-services-report"],
              ["Accelerate UK growth","Grow from $2.7M to $4.9M with named pipeline.","1.5× coverage","The UK is TF's most immediate international scale opportunity and improves geographic and rate mix, but the 79% growth plan needs disciplined pipeline coverage.","Executive analysis · Sections 05, 08 and 12","ICAEW research finds UK accountants remain in high demand and that mid-tier firms are actively seeking specialist talent while integrating AI into delivery models.","ICAEW · UK accountants remain in high demand","https://www.icaew.com/about-icaew/news/2026-news-releases/uk-accountants-still-in-high-demand-despite-ai-jobs-shift-icaew-report-finds"],
              ["Enter the US","Use the accountant shortage and India delivery base to win the first client.","$1M by FY27/28","The US provides the largest expansion runway and lets the group reuse its recruitment, offshore-delivery and accounting-specialisation capabilities rather than build a new engine.","Executive analysis · Sections 03, 05, 06 and 14","The U.S. Bureau of Labor Statistics projects about 124,200 accountant and auditor openings annually from 2024-2034, with demand supported by complexity and globalisation.","U.S. BLS · Accountants and Auditors Outlook","https://www.bls.gov/ooh/business-and-financial/accountants-and-auditors.htm"],
              ["Expand EBITDA","Move from 9.3% to 12.3% in FY26/27, then beyond 23%.","Pre/post-synergy bridge","Revenue growth alone does not validate the model. Margin expansion proves FA operating leverage, AI economics and integration benefits are compounding as intended.","Executive analysis · Sections 05, 07 and 15","McKinsey research on large deals highlights persistent synergy governance and financial transparency as core conditions for converting strategic ambition into measurable value.","McKinsey · Post-close excellence in large-deal M&A","https://www.mckinsey.com/capabilities/m-and-a/our-insights/post-close-excellence-in-large-deal-m-and-a"],
              ["Build leadership","Create entity P&L ownership and management capacity for a $72M group.","Clear accountable owners","A business scaling across three entities, acquisitions and geographies will outrun informal decision-making. Leadership capacity is the control system for every other priority.","Executive analysis · Sections 05, 10, 11 and 14","McKinsey's integration research links tailored leadership capability-building with stronger planning, value capture, cultural integration and readiness for the next growth horizon.","McKinsey · Equipping leaders for merger integration success","https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/equipping-leaders-for-merger-integration-success"]
            ].map(([title,copy,proof,why,internalRef,evidence,source,url],i)=><article key={title} className={priorityOpen===title?"open":""}><button type="button" className="priority-summary" onClick={()=>setPriorityOpen(priorityOpen===title?null:title)} aria-expanded={priorityOpen===title}><span>{String(i+1).padStart(2,"0")}</span><div><h4>{title}</h4><p>{copy}</p></div><b>{proof}</b><i>{priorityOpen===title?"−":"+"}</i></button>{priorityOpen===title&&<div className="priority-detail"><div className="why"><small>Why it is important</small><p>{why}</p></div><div><small>Internal reference</small><p>{internalRef}</p></div><div className="evidence"><small>External evidence</small><p>{evidence}</p><div className="source-hover"><button type="button" className="source-trigger" aria-describedby={`source-${i}`}>{source} <span>ⓘ</span></button><aside id={`source-${i}`} className="source-window" role="tooltip"><div><small>Reference preview</small><b>{source}</b></div><p>{evidence}</p><dl><dt>Publisher</dt><dd>{source.split(" · ")[0]}</dd><dt>Source address</dt><dd>{url}</dd></dl><em>This reference is shown inside the board plan. No new tab will open.</em></aside></div></div></div>}</article>)}
          </div></section>}
          {growthTab==="risks" && <section className="growth-risks"><div className="growth-title"><small>Risk-adjusted growth</small><h3>Ambition with<br/><em>explicit controls.</em></h3><p>The case remains investable only if the Board sees the downside early and management has predetermined responses.</p></div><div className="risk-response-list">
            {[
              ["FLA headcount scale-up","High","620 → 761; each 10% shortfall implies roughly $1.5M of revenue risk.","Headcount is 5% below monthly plan or billing utilisation falls below 88%.","COO + CPO","Deploy TF's recruitment engine, review the vacancy funnel weekly, prioritise revenue-critical roles and hold discretionary hiring elsewhere.","Monthly headcount-versus-plan dashboard; 10% miss escalated to the Board."],
              ["UK revenue assumption","High","79% year-on-year growth with current pipeline around 1.25×.","Qualified coverage remains below 1.5× or a named opportunity slips by more than 30 days.","UK Growth Lead + CCO","Rebalance toward committed client expansion, accelerate referral channels and adjust UK hiring or spend to the revised close profile.","Named opportunities, weighted coverage and close-date movement reported monthly."],
              ["AI adoption uncertainty","High","Bear case at 15% adoption produces approximately ($250k) EBITDA.","Conversion tracks below the 15% bear case at the month-six gate.","CCO + CTO","Pause incremental AI opex, focus product effort on live-client retention and highest-conversion segments, then rebase the FY27/28 plan.","Monthly eligible-client funnel, active customers, revenue per client and churn."],
              ["TF gross-margin compression","Medium","Margin trends from 53.5% to 45.1% over four years.","GP per FTE misses plan for two months or entity margin falls more than 2pp below budget.","TF CEO + CFO","Apply 3-5% annual rate uplifts, improve UK mix, review low-margin contracts and align delivery headcount to contracted demand.","Monthly GP per FTE, billing rate, utilisation and client-level contribution."],
              ["Facilities step-change","Medium","Cost rises from $587k to $1.046M to support 968 FTEs.","FLA headcount is below 80% of the milestone required for the next lease tranche.","COO + CFO","Delay the fixed commitment, use flexible space as a buffer and phase fit-out only against contracted or near-contracted demand.","Lease gates included in the monthly headcount and capacity review."],
              ["FX exposure","Medium","Material GBP/AUD and INR/AUD exposure with flat-rate planning assumptions.","GBP/AUD or INR/AUD moves beyond the approved 5% sensitivity band.","CFO","Implement rolling six-month GBP/AUD cover, match currency inflows and outflows where possible and reprice exposed contracts at renewal.","Quarterly hedged-versus-unhedged position and 5% sensitivity in every Board pack."]
            ].map(([title,level,risk,trigger,owner,response,monitoring])=><article key={title} className={riskOpen===title?"open":""}><button type="button" className="risk-summary" onClick={()=>setRiskOpen(riskOpen===title?null:title)} aria-expanded={riskOpen===title}><span><h4>{title}</h4><em className={level.toLowerCase()}>{level}</em></span><p>{risk}</p><i>{riskOpen===title?"−":"+"}</i></button>{riskOpen===title&&<div className="risk-response"><div><small>Trigger</small><p>{trigger}</p></div><div><small>Accountable owner</small><p>{owner}</p></div><div className="response-main"><small>How we address it</small><p>{response}</p></div><div><small>Board monitoring</small><p>{monitoring}</p></div></div>}</article>)}
          </div></section>}
        </div>
        <footer className="growth-foot"><span>Use the tabs to move through the growth case</span><button type="button" onClick={()=>setGrowthOpen(false)}>Return to board plan</button></footer>
      </div>
    </div>}
    <footer><span>Confidential · Board privileged</span><span>Prepared August 2026 · Revised executive case</span></footer>
  </main>;
}
