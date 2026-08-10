"use client";

import { useMemo, useState, type CSSProperties } from "react";

type Inputs = {
  flaCapacity: number;
  utilisation: number;
  ukPlan: number;
  aiAdoption: number;
  synergy: number;
};

const approved: Inputs = { flaCapacity: 100, utilisation: 88, ukPlan: 100, aiAdoption: 30, synergy: 100 };

const presets: Record<"downside" | "approved" | "upside", Inputs> = {
  downside: { flaCapacity: 85, utilisation: 82, ukPlan: 80, aiAdoption: 15, synergy: 60 },
  approved,
  upside: { flaCapacity: 105, utilisation: 91, ukPlan: 115, aiAdoption: 45, synergy: 100 },
};

const money = (value: number) => `${value < 0 ? "−" : ""}$${Math.abs(value).toFixed(2)}M`;
const signedMoney = (value: number) => `${value >= 0 ? "+" : "−"}$${Math.abs(value).toFixed(2)}M`;

export default function ScenarioSimulator() {
  const [inputs, setInputs] = useState<Inputs>(approved);
  const [open, setOpen] = useState(false);

  const result = useMemo(() => {
    const base = {
      revenue: 42.0,
      grossProfit: 15.8,
      ebitda: 5.15,
      faRevenue: 25.7,
      aiRevenue: 2.133705,
      aiGrossProfit: 1.16463,
      aiEbitda: 0.589545,
      synergy: 1.65,
    };

    const adjustedFaRevenue = base.faRevenue * (inputs.flaCapacity / 100) * (inputs.utilisation / 88);
    const faRevenueDelta = adjustedFaRevenue - base.faRevenue;
    const faGrossProfitDelta = faRevenueDelta * 0.302;

    const ukRevenueDelta = ((inputs.ukPlan - 100) / 20) * 1.25;
    const ukGrossProfitDelta = ukRevenueDelta * 0.515;
    const ukEbitdaDelta = ((inputs.ukPlan - 100) / 20) * 0.25;

    const aiScale = inputs.aiAdoption / 30;
    const aiRevenue = base.aiRevenue * aiScale;
    const aiGrossProfit = base.aiGrossProfit * aiScale;
    const aiEbitda = aiGrossProfit - 0.575085;

    const synergyValue = base.synergy * (inputs.synergy / 100);
    const revenue = base.revenue + faRevenueDelta + ukRevenueDelta + (aiRevenue - base.aiRevenue);
    const grossProfit = base.grossProfit + faGrossProfitDelta + ukGrossProfitDelta + (aiGrossProfit - base.aiGrossProfit);
    const ebitda = base.ebitda + faGrossProfitDelta + ukEbitdaDelta + (aiEbitda - base.aiEbitda) + (synergyValue - base.synergy);

    const bridge = [
      { label: "FA capacity + utilisation", value: faGrossProfitDelta },
      { label: "UK plan", value: ukEbitdaDelta },
      { label: "AI adoption", value: aiEbitda - base.aiEbitda },
      { label: "Synergy realisation", value: synergyValue - base.synergy },
    ];

    const alerts = [
      inputs.flaCapacity < 90 ? "FLA capacity is below the 90% early-warning level." : null,
      inputs.utilisation < 85 ? "Billing utilisation is below the professional-services control range." : null,
      inputs.ukPlan < 90 ? "UK delivery is more than 10% below plan." : null,
      inputs.aiAdoption < 20 ? "AI adoption is near the marginal break-even case." : null,
      inputs.synergy < 80 ? "Less than 80% of the synergy register is realised." : null,
      ebitda / revenue < 0.1 ? "Group EBITDA margin falls below 10%." : null,
    ].filter(Boolean) as string[];

    return { revenue, grossProfit, ebitda, margin: (ebitda / revenue) * 100, bridge, alerts };
  }, [inputs]);

  const update = (key: keyof Inputs, value: number) => setInputs(current => ({ ...current, [key]: value }));
  const deltaRevenue = result.revenue - 42.0;
  const deltaEbitda = result.ebitda - 5.15;

  return <section className={`board-simulator ${open ? "open" : ""}`} aria-labelledby="simulator-title">
    <button className="simulator-entry" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
      <span><small>Board decision simulator</small><b id="simulator-title">Stress-test the FY26/27 case</b></span>
      <span className="simulator-entry-result"><small>Modelled EBITDA</small><strong>{money(result.ebitda)}</strong><i>{open ? "−" : "+"}</i></span>
    </button>

    {open ? <div className="simulator-workspace">
      <header className="simulator-header">
        <div><small>Interactive management model</small><h3>Move the five assumptions that can change the case.</h3></div>
        <p>This is a transparent sensitivity model, not a replacement forecast. The approved case remains the reference point and every change is shown as a delta.</p>
      </header>

      <div className="simulator-presets" aria-label="Scenario presets">
        {(Object.keys(presets) as Array<keyof typeof presets>).map(name => <button type="button" key={name} onClick={() => setInputs(presets[name])}>{name === "approved" ? "Approved case" : name}</button>)}
        <button className="reset" type="button" onClick={() => setInputs(approved)}>Reset assumptions</button>
      </div>

      <div className="simulator-layout">
        <div className="simulator-controls">
          <SimulatorControl label="FLA headcount achievement" value={inputs.flaCapacity} min={70} max={110} suffix="%" note="Capacity available against the 761-FTE plan" onChange={value => update("flaCapacity", value)} />
          <SimulatorControl label="FLA billing utilisation" value={inputs.utilisation} min={75} max={95} suffix="%" note="Approved control level: 88%" onChange={value => update("utilisation", value)} />
          <SimulatorControl label="UK revenue-plan achievement" value={inputs.ukPlan} min={60} max={120} suffix="%" note="20% miss ≈ $250k EBITDA exposure" onChange={value => update("ukPlan", value)} />
          <SimulatorControl label="AI client adoption" value={inputs.aiAdoption} min={10} max={50} suffix="%" note="Approved case: 30% · 124 active customers" onChange={value => update("aiAdoption", value)} />
          <SimulatorControl label="Synergy register realised" value={inputs.synergy} min={0} max={100} suffix="%" note="Approved annual register: $1.65M" onChange={value => update("synergy", value)} />
        </div>

        <div className="simulator-output">
          <div className="simulator-scorecard">
            <article><small>Group revenue</small><strong>{money(result.revenue)}</strong><span className={deltaRevenue >= 0 ? "positive" : "negative"}>{signedMoney(deltaRevenue)} vs approved</span></article>
            <article><small>Gross profit</small><strong>{money(result.grossProfit)}</strong><span>Approved: $15.80M</span></article>
            <article className="primary"><small>Post-synergy EBITDA</small><strong>{money(result.ebitda)}</strong><span className={deltaEbitda >= 0 ? "positive" : "negative"}>{signedMoney(deltaEbitda)} vs approved</span></article>
            <article><small>EBITDA margin</small><strong>{result.margin.toFixed(1)}%</strong><span>Approved: 12.3%</span></article>
          </div>

          <div className="simulator-bridge">
            <header><small>EBITDA bridge from the approved case</small><b>$5.15M baseline</b></header>
            {result.bridge.map(item => <div key={item.label}><span>{item.label}</span><i><em className={item.value >= 0 ? "positive" : "negative"} style={{ width: `${Math.min(100, Math.max(4, Math.abs(item.value) / 2.5 * 100))}%` }} /></i><b className={item.value >= 0 ? "positive" : "negative"}>{signedMoney(item.value)}</b></div>)}
          </div>

          <div className={`simulator-alerts ${result.alerts.length ? "has-alerts" : ""}`}>
            <small>Board attention</small>
            {result.alerts.length ? <ul>{result.alerts.map(alert => <li key={alert}>{alert}</li>)}</ul> : <p>No modelled guardrail is currently breached.</p>}
          </div>
        </div>
      </div>

      <footer className="simulator-method">
        <b>Calculation method</b>
        <p>FA revenue flexes with headcount and utilisation; FA gross-profit sensitivity uses the 30.2% margin. The UK control uses the documented $250k EBITDA exposure for each 20% plan miss. AI revenue and gross profit scale with adoption while the $575k below-GP allocation remains fixed. Realised synergies replace the approved $1.65M register proportionally.</p>
        <span>Model status: management sensitivity · approved case anchored · assumptions require Board validation</span>
      </footer>
    </div> : null}
  </section>;
}

function SimulatorControl({ label, value, min, max, suffix, note, onChange }: { label: string; value: number; min: number; max: number; suffix: string; note: string; onChange: (value: number) => void }) {
  const fill = ((value - min) / (max - min)) * 100;
  return <label className="simulator-control">
    <span><b>{label}</b><strong>{value}{suffix}</strong></span>
    <input type="range" min={min} max={max} value={value} onChange={event => onChange(Number(event.target.value))} style={{ "--fill": `${fill}%` } as CSSProperties} />
    <small>{note}</small>
  </label>;
}
