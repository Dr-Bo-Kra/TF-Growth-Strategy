"use client";
import { useEffect, useState } from "react";

const sections = ["brief", "dashboard", "report"] as const;
type Section = (typeof sections)[number];
const decisions = [
  ["01", "Approve synergy register", "$1.65M p.a. with named owners and monthly tracking"],
  ["02", "Gate AI Digital at month six", "Track bear, expected and stretch adoption cases"],
  ["03", "Unlock UK execution", "Appoint a Growth Lead and reach 1.5x pipeline cover"],
  ["04", "Stage fixed-cost commitments", "Tie facilities expansion to 80%+ FLA headcount attainment"],
];
const risks = [
  ["FLA scale-up", "High", "620 to 761 FTEs", "Monthly 5% / 10% alerts"],
  ["UK growth", "High", "+79% YoY plan", "Named pipeline and 1.5x coverage"],
  ["AI adoption", "High", "30% expected case", "Six-month review gate"],
  ["TF margin", "Medium", "53.5% to 45.1%", "3-5% annual pricing review"],
];

export default function Home() {
  const [active, setActive] = useState<Section>("brief");
  const [presenting, setPresenting] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const index = sections.indexOf(active);
      if (event.key === "ArrowRight" || event.key === "PageDown") setActive(sections[Math.min(index + 1, sections.length - 1)]);
      if (event.key === "ArrowLeft" || event.key === "PageUp") setActive(sections[Math.max(index - 1, 0)]);
      if (event.key === "Escape") setPresenting(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
  const startPresentation = async () => {
    setPresenting(true);
    await document.documentElement.requestFullscreen?.().catch(() => undefined);
  };
  return (
    <main className={presenting ? "shell presenting" : "shell"}>
      <header className="topbar">
        <button className="brand" onClick={() => setActive("brief")} aria-label="Open executive brief"><span className="brandmark">TF</span><span><strong>FY2026-27 Board Pack</strong><small>Talent Formula Group</small></span></button>
        <nav aria-label="Presentation sections">
          <button className={active === "brief" ? "active" : ""} onClick={() => setActive("brief")}>Executive brief</button>
          <button className={active === "dashboard" ? "active" : ""} onClick={() => setActive("dashboard")}>Operating dashboard</button>
          <button className={active === "report" ? "active" : ""} onClick={() => setActive("report")}>Full analysis</button>
        </nav>
        <button className="present" onClick={startPresentation}>Present <span>↗</span></button>
      </header>
      {active === "brief" && <section className="brief">
        <div className="hero"><div><div className="eyebrow"><span>Confidential</span> Board submission · Revised executive case</div><h1>Scale the platform.<br/><em>Protect the downside.</em></h1><p>One board-ready view of the group’s growth plan, the operating engine behind it, and the decisions required to execute with discipline.</p></div><div className="hero-metric"><small>FY28/29 group revenue</small><strong>$72.5M</strong><span>2.2x FY25/26 base</span><div className="trajectory"><i/><i/><i/><i/></div><div className="years"><span>FY25/26</span><span>FY28/29</span></div></div></div>
        <div className="metrics"><article><small>FY26/27 revenue</small><strong>$42.0M</strong><span className="positive">↑ 26.1% YoY</span></article><article><small>Gross profit</small><strong>$15.8M</strong><span>37.6% margin</span></article><article><small>Post-synergy EBITDA</small><strong>$5.2M</strong><span className="positive">↑ 2.9pp margin</span></article><article><small>AI Digital revenue</small><strong>$2.1M</strong><span>54.6% gross margin</span></article><article><small>FLA headcount</small><strong>761</strong><span className="watch">Key execution lever</span></article></div>
        <div className="grid"><section className="panel decisions"><div className="panel-head"><div><small>Board agenda</small><h2>Decisions requested</h2></div><span>4 items</span></div>{decisions.map(([n,title,copy]) => <article key={n}><b>{n}</b><div><h3>{title}</h3><p>{copy}</p></div><span>→</span></article>)}</section><section className="panel risks"><div className="panel-head"><div><small>Execution focus</small><h2>Risk radar</h2></div><span>Monthly review</span></div><div className="risk-head"><span>Risk</span><span>Exposure</span><span>Control</span></div>{risks.map(([risk,level,exposure,control]) => <article key={risk}><div><b>{risk}</b><em className={level === "High" ? "high" : "medium"}>{level}</em></div><span>{exposure}</span><span>{control}</span></article>)}</section></div>
        <div className="source-note"><b>Basis of presentation</b><span>The executive PDF is the revised board case. The detailed dashboard remains available as the operating view and may contain earlier planning assumptions.</span></div>
      </section>}
      {active === "dashboard" && <section className="frame-page"><div className="frame-head"><div><small>Detailed operating view</small><h1>Budget dashboard</h1><p>Interactive entity, monthly and headcount analysis from the original model.</p></div><a href="/dashboard.html" target="_blank">Open in new window ↗</a></div><iframe src="/dashboard.html" title="FY2026-27 budget dashboard" /></section>}
      {active === "report" && <section className="frame-page report-page"><div className="frame-head"><div><small>13-page board narrative</small><h1>C-Level executive analysis</h1><p>Strategy, market context, scenarios, synergies, risks and recommendations.</p></div><a href="/executive-analysis.pdf" target="_blank">Download PDF ↓</a></div><object data="/executive-analysis.pdf#view=FitH" type="application/pdf"><p>Your browser cannot show the PDF. <a href="/executive-analysis.pdf">Download it here.</a></p></object></section>}
      <footer><span>Talent Formula Group · FY2026-27</span><span>Use ← → keys to navigate</span><span>{sections.indexOf(active)+1} / {sections.length}</span></footer>
    </main>
  );
}
