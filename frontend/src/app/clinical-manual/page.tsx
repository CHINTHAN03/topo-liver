import React from 'react';
import Link from 'next/link';

export default function ClinicalManual() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-24 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Clinical Reference Manual</h1>
            <p className="text-slate-500 text-sm">Hepatic Metabolic Assessment Tool (HMAT)</p>
          </div>
          <Link href="/" className="text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-md transition-colors border border-emerald-200">
            ← Back to Simulation
          </Link>
        </div>

        {/* Content */}
        <div className="p-8 space-y-12">
          
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Overview</h2>
            <p className="text-slate-600 leading-relaxed">
              The Hepatic Metabolic Assessment Tool (HMAT) is a clinical-grade simulation utilizing the <strong>FIB-4 Index</strong> and <strong>AASLD guidelines</strong> to dynamically model the progression of Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD) through to Cirrhosis, including systemic effects like Cirrhotic Cardiomyopathy. By adjusting standard laboratory panels, the physics-based WebGL engine dynamically recalculates the structural and metabolic state of the liver in real time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Laboratory Parameters</h2>
            <div className="space-y-6">
              
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-1">Age (Years)</h3>
                <p className="text-sm text-slate-600 mb-2">Age intrinsically increases the baseline risk of fibrosis and amplifies the FIB-4 index score.</p>
                <div className="text-xs bg-white p-3 rounded border border-slate-100 text-slate-500">
                  <strong className="text-slate-700">Clinical Impact:</strong> As Age increases alongside poor liver panels, the algorithmic probability for bridging fibrosis (F3) or cirrhosis (F4) sharply escalates.
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-1">AST & ALT (Aminotransferases)</h3>
                <p className="text-sm text-slate-600 mb-2">AST (Aspartate Aminotransferase) and ALT (Alanine Aminotransferase) are biomarkers of hepatocellular injury. Normal range is typically 10-40 U/L.</p>
                <div className="text-xs bg-white p-3 rounded border border-slate-100 text-slate-500">
                  <strong className="text-slate-700">Clinical Impact:</strong> High AST/ALT correlates with <strong>Acute Hepatic Inflammation</strong> (reflected as darker mottling on the simulation). An AST/ALT ratio &gt; 1 strongly suggests advanced fibrosis or alcoholic liver disease, triggering a severe rise in the FIB-4 score.
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-1">Platelets (10⁹/L)</h3>
                <p className="text-sm text-slate-600 mb-2">Thrombocytopenia (low platelets) is one of the earliest and most sensitive markers of portal hypertension and cirrhosis. Normal range: 150-450 × 10⁹/L.</p>
                <div className="text-xs bg-white p-3 rounded border border-slate-100 text-slate-500">
                  <strong className="text-slate-700">Clinical Impact:</strong> Dropping platelets below 150 drastically drives up the FIB-4 index. In the simulation, you will observe significant <strong>macronodular displacement (scarring)</strong> and overall <strong>organ shrinkage</strong>.
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-1">Glucose (mg/dL)</h3>
                <p className="text-sm text-slate-600 mb-2">Fasting blood glucose indicates metabolic syndrome and insulin resistance, driving liver fat accumulation. Normal range: 70-99 mg/dL.</p>
                <div className="text-xs bg-white p-3 rounded border border-slate-100 text-slate-500">
                  <strong className="text-slate-700">Clinical Impact:</strong> Elevated glucose directly scales the <strong>Steatosis</strong> rendering variable. The liver will visually turn a pale yellow-tan to represent fatty lipid infiltration (MASLD).
                </div>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Systemic Complications</h2>
            
            <div className="bg-rose-50/50 p-6 rounded-lg border border-rose-100">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Cirrhotic Cardiomyopathy (QTc Prolongation)
              </h3>
              <p className="text-sm text-slate-700 mb-3">
                As cirrhosis progresses to end-stage (F4), impaired clearance of vasoactive substances leads to systemic vasodilation and compensatory hyperdynamic circulation. This electrophysiological stress manifests on an ECG as a prolonged QTc interval (&gt;450ms).
              </p>
              <div className="text-xs bg-white p-3 rounded border border-rose-100 text-rose-800">
                <strong>Simulation Effect:</strong> As you drive up AST, lower platelets, and increase age, watch the QTc ECG module. The waveform will structurally widen, triggering a critical cardiomyopathy alert when the FIB-4 score passes the cirrhotic threshold.
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
