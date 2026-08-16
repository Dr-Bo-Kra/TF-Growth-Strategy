"use client";

import { useEffect, useState } from "react";
import BoardAnswerDesk from "./board-answer-desk";
import BoardLensScenarioEngine from "./boardlens-scenario-engine";
import MonthlyPerformanceDiagnostic from "./monthly-performance-diagnostic";
import "./boardlens-scenario-engine.css";
import "./boardlens-navigation.css";
import "./presenter-console.css";

export default function PresenterConsole(){
  const [local,setLocal]=useState<boolean|null>(null);
  useEffect(()=>setLocal(["localhost","127.0.0.1"].includes(window.location.hostname)),[]);
  if(local===null)return null;
  if(!local)return <main className="presenter-locked"><div><small>BoardLens</small><h1>This private workspace is not available on the shared site.</h1><p>Use the local version during Board preparation and presentation.</p></div></main>;
  return <main className="presenter-console">
    <header><a href="../">← TF Growth Strategy</a><div><small>Private Board analysis workspace</small><h1>BoardLens</h1><p>Explore the evidence, answer the question, then test only the assumptions the Board wants to examine.</p></div><span>Local only</span></header>
    <nav className="boardlens-workspaces" aria-label="BoardLens workspaces">
      <a href="#answer-desk"><b>01</b><span>Answer desk</span><small>Choose and compare reported evidence</small></a>
      <a href="#monthly-diagnostic"><b>02</b><span>Monthly diagnostic</span><small>Explain actual performance</small></a>
      <a href="#scenario-engine"><b>03</b><span>Scenario engine</span><small>Change assumptions and model consequences</small></a>
    </nav>
    <section id="answer-desk"><BoardAnswerDesk/></section>
    <section id="monthly-diagnostic"><MonthlyPerformanceDiagnostic/></section>
    <section id="scenario-engine"><BoardLensScenarioEngine/></section>
    <footer><b>BoardLens discipline</b><p>Call out whether an answer is approved, modelled or a management action. Never describe a simulator output as a revised forecast unless the Board formally approves it.</p></footer>
  </main>;
}
