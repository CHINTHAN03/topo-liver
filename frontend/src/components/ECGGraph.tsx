'use client';

import React from 'react';
import { useStore } from '../store/useStore';

const ECGGraph = () => {
  const qtcInterval = useStore((state) => state.qtcInterval);
  
  // Precise Clinical Repolarization Mapping
  // A standard QRS complex is narrow. QTc prolongation typically specifically delays the T-wave.
  // The stretchFactor translates ms to SVG coordinate space.
  const stretchFactor = Math.max(0, (qtcInterval - 400) / 4);

  // Normal waveform points:
  const pWave = "M 0 50 L 10 50 Q 15 45 20 50";
  const prSegment = "L 30 50";
  const qSpike = "L 35 60";
  const rSpike = "L 40 15";
  const sSpike = "L 45 70";
  const stSegment = "L 55 50";
  
  // The T-wave commencement is pushed backwards proportionally to the QTc widening
  const tStart = 65 + stretchFactor; 
  const tPeak = 75 + (stretchFactor * 1.2);
  const tEnd = 85 + (stretchFactor * 1.5);
  
  // Real-time recalculation of the cycle duration
  const path = `${pWave} ${prSegment} ${qSpike} ${rSpike} ${sSpike} ${stSegment} L ${tStart} 50 Q ${tPeak} 35 ${tEnd} 50 L 150 50`;
  const doublePath = `${path} M 150 50 L 160 50 Q 165 45 170 50 L 180 50 L 185 60 L 190 15 L 195 70 L 205 50 L ${tStart + 150} 50 Q ${tPeak + 150} 35 ${tEnd + 150} 50 L 300 50`;

  const isProlonged = qtcInterval > 450;
  const isSevere = qtcInterval > 480;

  return (
    <div className="absolute bottom-6 right-6 z-10 w-[340px] h-44 bg-white border border-gray-200 rounded-md p-4 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
        <h3 className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          ECG - Lead II (Simulation)
        </h3>
        <div className="flex flex-col items-end">
          <span className={`text-sm font-bold ${isSevere ? 'text-red-700 animate-pulse' : (isProlonged ? 'text-orange-600' : 'text-slate-800')}`}>
            QTc: {Math.round(qtcInterval)} ms
          </span>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden flex items-center bg-rose-50/50 rounded-sm border border-rose-100/50">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ecg-line {
            /* If fibrosis increases QTc, heart rate usually compensates slightly in cirrhosis hyperdynamic state. */
            animation: slide ${isSevere ? '1.2s' : '1.5s'} linear infinite;
          }
          `
        }} />
        <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-[200%] h-full">
          {/* Medical paper grid lines (millimeter grid simulation) */}
          <g className="stroke-rose-200/60" strokeWidth="0.5">
             <line x1="0" y1="20" x2="300" y2="20"/><line x1="0" y1="40" x2="300" y2="40"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="80" x2="300" y2="80"/>
             {Array.from({length: 30}).map((_, i) => (
                <line key={i} x1={i*10} y1="0" x2={i*10} y2="100"/>
             ))}
          </g>
          {/* Thicker lines for larger divisions */}
          <g className="stroke-rose-300/80" strokeWidth="1">
             <line x1="0" y1="50" x2="300" y2="50"/>
             {Array.from({length: 6}).map((_, i) => (
                <line key={i} x1={i*50} y1="0" x2={i*50} y2="100"/>
             ))}
          </g>
          <path d={doublePath} className={`ecg-line fill-none stroke-[1.5] ${isSevere ? 'stroke-red-600' : (isProlonged ? 'stroke-orange-500' : 'stroke-slate-800')}`} style={{ filter: isSevere ? 'drop-shadow(0 0 1px rgba(220,38,38,0.5))' : 'none' }} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {(isProlonged || isSevere) && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider animate-pulse ${isSevere ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>
          {isSevere ? 'Cirrhotic Cardiomyopathy WARNING' : 'QT Prolongation Detected'}
        </div>
      )}
    </div>
  );
};

export default ECGGraph;