'use client';
import dynamic from 'next/dynamic';
import ControlPanel from '../components/ControlPanel';
import ECGGraph from '../components/ECGGraph';
import { useWebSocket } from '../store/useWebSocket';
import { useStore } from '../store/useStore';

// Dynamically import the Canvas to prevent SSR issues with Three.js
const LiverSimulationCanvas = dynamic(() => import('../components/LiverSimulationCanvas'), {
  ssr: false,
});

const DiagnosticOverlay = () => {
  const steatosis = useStore(state => state.steatosis);
  const inflammation = useStore(state => state.inflammation);
  const fibrosis = useStore(state => state.fibrosis);
  const fib4Score = useStore(state => state.fib4Score);

  let diagnosisText = "Hepatic function is within normal limits. Blood panels indicate optimal metabolic and structural health.";
  let riskLevel = "NORMAL";
  let colorClass = "text-emerald-800 bg-emerald-50 border-emerald-200";

  if (fib4Score > 2.67) {
    diagnosisText = "CRITICAL: High probability of advanced fibrosis or cirrhosis (F4). Indications of significant extracellular matrix deposition, nodular regeneration, and hepatic stiffening. Immediate clinical evaluation is strongly recommended.";
    riskLevel = "CRITICAL (F4)";
    colorClass = "text-red-800 bg-red-50 border-red-200";
  } else if (fib4Score > 1.30) {
    diagnosisText = "WARNING: Indeterminate to High Risk of Advanced Fibrosis (F2-F3). Elevated aminotransferases and altered platelet counts suggest progressive structural scarring.";
    riskLevel = "ELEVATED RISK (F2-F3)";
    colorClass = "text-orange-800 bg-orange-50 border-orange-200";
  } else if (steatosis > 0.5 && inflammation > 0.5) {
    diagnosisText = "WARNING: Clinical indicators suggest Metabolic Dysfunction-Associated Steatohepatitis (MASH). Concurrent macrovesicular steatosis and hepatocellular injury (ballooning/inflammation) observed.";
    riskLevel = "MASH / NASH";
    colorClass = "text-amber-800 bg-amber-50 border-amber-200";
  } else if (steatosis > 0.6) {
    diagnosisText = "Elevated Steatosis. Significant lipid accumulation detected in hepatocytes. Indicates progressing Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD).";
    riskLevel = "MASLD RISK";
    colorClass = "text-yellow-800 bg-yellow-50 border-yellow-200";
  } else if (inflammation > 0.6) {
    diagnosisText = "Acute Hepatic Inflammation. Elevated aminotransferases suggest ongoing hepatocellular injury and systemic oxidative stress. Precursor to fibrotic progression.";
    riskLevel = "HEPATOCELLULAR INJURY";
    colorClass = "text-rose-800 bg-rose-50 border-rose-200";
  }

  return (
    <div className={`absolute top-24 left-6 z-10 p-5 rounded-md border shadow-sm max-w-sm ${colorClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-semibold text-sm tracking-wide">
          {riskLevel}
        </h2>
      </div>
      <p className="text-xs leading-relaxed mt-1">
        <strong>Clinical Assessment:</strong><br/>
        {diagnosisText}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-black/10 pt-3">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider opacity-70">Steatosis</div>
          <div className="text-sm font-medium">{(steatosis * 100).toFixed(0)}%</div>
        </div>
        <div className="text-center border-l border-r border-black/10">
          <div className="text-[10px] uppercase tracking-wider opacity-70">Inflammation</div>
          <div className="text-sm font-medium">{(inflammation * 100).toFixed(0)}%</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider opacity-70">Fibrosis</div>
          <div className="text-sm font-medium">{(fibrosis * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
};

import Link from 'next/link';

export default function Home() {
  useWebSocket();
  return (
    <div className="flex h-screen bg-gray-50 text-slate-800 overflow-hidden font-sans">
      <ControlPanel />
      <div className="flex-1 relative bg-white border-l border-gray-200 shadow-inner">
        <div className="absolute top-6 left-6 z-10 flex items-center justify-between w-[calc(100%-3rem)]">
          <h1 className="text-xl font-medium tracking-tight text-slate-800">
            Hepatic Metabolic Assessment Tool
          </h1>
          <Link href="/clinical-manual" className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-medium text-sm border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            Clinical Manual
          </Link>
        </div>
        <DiagnosticOverlay />
        <ECGGraph />
        <LiverSimulationCanvas />
      </div>
    </div>
  );
}
