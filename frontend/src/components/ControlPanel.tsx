'use client';

import React, { useState, useEffect } from 'react';

const ControlPanel = () => {
  const [age, setAge] = useState(45);
  const [ast, setAst] = useState(20);
  const [alt, setAlt] = useState(20);
  const [platelets, setPlatelets] = useState(250);
  const [glucose, setGlucose] = useState(90);

  const resetToNormal = () => {
    setAge(45);
    setAst(20);
    setAlt(20);
    setPlatelets(250);
    setGlucose(90);
    triggerBackendUpdate(45, 20, 20, 250, 90);
  };

  useEffect(() => {
    handleUpdate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = () => {
    triggerBackendUpdate(age, ast, alt, platelets, glucose);
  };

  const triggerBackendUpdate = async (ageVal: number, astVal: number, altVal: number, plateletsVal: number, glucoseVal: number) => {
    // BACKEND SYNC ONLY - Removing Local fallback ensures the UI fully relies on the Java Server WebSocket Response
    try {
      const res = await fetch('http://127.0.0.1:8080/api/metabolic/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: ageVal,
          ast: astVal,
          alt: altVal,
          platelets: plateletsVal,
          glucose: glucoseVal
        })
      });
      if (!res.ok) console.warn('Backend responded with status:', res.status);
    } catch (error) {
      console.warn('Cannot connect to backend. Is it running on port 8080?', error);
    }
  };

  return (
    <div className="w-[340px] bg-white border-r border-gray-200 p-6 flex flex-col gap-6 text-slate-700 shadow-sm overflow-y-auto relative z-20">
      <div className="flex justify-between items-start border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-800 mb-1">Hepatic Lab Panels</h2>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">AASLD Clinical Standard</p>
        </div>
        <button onClick={resetToNormal} className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-600 rounded text-xs transition-colors uppercase tracking-wider font-semibold">
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="flex justify-between text-sm font-medium">
            <span>Age (Years)</span>
            <span className="text-slate-800 font-semibold">{age}</span>
          </label>
          <input type="range" min="18" max="90" value={age} onChange={(e) => setAge(Number(e.target.value))} onPointerUp={handleUpdate} className="w-full accent-slate-600 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex justify-between text-sm font-medium">
            <span>AST (U/L)</span>
            <span className="text-slate-800 font-semibold">{ast}</span>
          </label>
          <input type="range" min="10" max="300" value={ast} onChange={(e) => setAst(Number(e.target.value))} onPointerUp={handleUpdate} className="w-full accent-orange-600 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex justify-between text-sm font-medium">
            <span>ALT (U/L)</span>
            <span className="text-slate-800 font-semibold">{alt}</span>
          </label>
          <input type="range" min="10" max="300" value={alt} onChange={(e) => setAlt(Number(e.target.value))} onPointerUp={handleUpdate} className="w-full accent-orange-600 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="flex justify-between text-sm font-medium">
            <span>Platelets (10⁹/L)</span>
            <span className="text-slate-800 font-semibold">{platelets}</span>
          </label>
          <input type="range" min="50" max="450" value={platelets} onChange={(e) => setPlatelets(Number(e.target.value))} onPointerUp={handleUpdate} className="w-full accent-blue-600 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex justify-between text-sm font-medium">
            <span>Glucose (mg/dL)</span>
            <span className="text-slate-800 font-semibold">{glucose}</span>
          </label>
          <input type="range" min="70" max="300" value={glucose} onChange={(e) => setGlucose(Number(e.target.value))} onPointerUp={handleUpdate} className="w-full accent-red-600 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;