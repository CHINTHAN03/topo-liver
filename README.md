# Hepatic Metabolic Assessment Tool (HMAT)

![Java](https://img.shields.io/badge/Java-Spring%20Boot-green?logo=spring) ![Next.js](https://img.shields.io/badge/Next.js-React-black?logo=next.js) ![Three.js](https://img.shields.io/badge/WebGL-Three.js-blue?logo=three.js) ![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind-38B2AC?logo=tailwind-css) ![Medical Simulation](https://img.shields.io/badge/Domain-Clinical_Simulation-red)

## Abstract
The **Hepatic Metabolic Assessment Tool (HMAT)** is an advanced computational biophysical simulation designed to mathematically model the progression of **Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD)** and its systemic sequelae, including fibrotic progression and **Cirrhotic Cardiomyopathy**. 

By leveraging high-performance 3D WebGL rendering (Three.js) coupled with a strictly decoupled Java Spring Boot algorithmic engine, HMAT translates standard laboratory serology into real-time macroscopic and electrophysiological visualizations.

---

## Visual Demonstrations (Placeholders)

<div align="center">
  
  <!-- Image 1: Main Dashboard -->
  
  <img width="1920" height="1080" alt="med-dash" src="https://github.com/user-attachments/assets/b86d02e1-fd3f-4e3d-acfa-9e5a6da7152e" />
  <p><i>Figure 1: Main clinical dashboard featuring the FIB-4 metabolic assessment, Lab Parameter Panels, and diagnostic overlays.</i></p>

  <!-- Image 2: The Liver 3D Shader Simulation -->
  
  <video src="video/med-rec.mp4" width="100%"></video>
  <p><i>Figure 2: Real-time WebGL Vertex Displacement showing progression from healthy macroscopic tissue to Steatosis (lipid accumulation) and Macronodular Cirrhosis (scarring).</i></p>

  

</div>

---

## Clinical Methodology & Algorithmic Foundation
The core Java engine does not rely on random visual generation; it is deeply rooted in verified hepatology scoring indices:

### 1. The FIB-4 Index (Fibrosis-4)
Used clinically to non-invasively estimate the degree of hepatic scarring. The system processes:
*   **Age**: A covariant multiplier for progression.
*   **AST/ALT Ratio (Aminotransferases)**: Biomarkers representing hepatocellular injury and necrosis.
*   **Platelets (Thrombocytopenia)**: A critical indicator of portal hypertension.
*   **Calculated Risk Stratification**: Dynamically sorting into F1 (Normal) to F4 (Cirrhosis) clinical staging. 

### 2. Cirrhotic Cardiomyopathy (QTc Prolongation)
End-stage liver disease leads to systemic vasodilation, resulting in a hyperdynamic circulatory state. The system models the cardiac electrophysiological stress by dynamically mapping the **QTc interval**. As FIB-4 breaches the threshold of severe cirrhosis, the SVG ECG mathematically stretches the T-wave repolarization vector and accelerates the visual heart rate (simulating compensatory tachycardia).

### 3. MASLD Macroscopic Visualization
*   **Steatosis**: Directly proportionate to fasting Glucose levels; rendering fragment shaders apply lipid-yellowing (steatosis) to the hepatic model based on metabolic dysregulation.
*   **Cirrhosis Displacement**: A Three.js custom GLSL Vertex Shader utilizes sine-wave interference translated against the calculated fibrosis score to physically shrink the organ volume (necrotic loss) while displacing outer vertices to simulate macronodular regenerative scarring.

---

## Technical Architecture

### Backend (Spring Boot 3.2 - Algorithmic Engine)
*   **Stateless REST API**: Handles isolated algorithmic equations decoupled from the state.
*   **STOMP WebSockets**: Maintains a continuous bi-directional stream across ws://127.0.0.1:8080/ws/hepatic-stream to push exact float physics to the WebGL render loop seamlessly without HTTP polling overhead.

### Frontend (Next.js & React-Three-Fiber)
*   **React State Management (Zustand)**: Prevents prop-drilling across the deeply nested 3D canvas and HUD.
*   **Custom GLSL ShaderMaterials**: Overrides standard Three.js materials to execute raw GPU matrix math on the organ vertices, enabling lighting-fast, physics-based biological rendering.
*   **Dynamic SVG ECG**: Re-compiles path data dynamically based on the sub-millisecond QTc interval calculated by the backend.

---

## Local Deployment & Engineering Setup

### Prerequisites
*   Java Development Kit (JDK) 21+ & Maven
*   Node.js 18+ & npm
*   Windows PowerShell (for task automation)

### 1. Start the Java Algorithmic Engine
Due to strict port binding requirements ensuring accurate cross-origin WebSocket telemetry (bypassing IPv6 localhost locks), boot the backend using the provided automation script:

\\\powershell
cd backend
.\start.ps1
\\\
*(This script will intelligently hunt down and assassinate any hanging TCP processes on port 8080 before executing a clean mvn spring-boot:run environment).*

### 2. Start the Frontend Clinical Client
\\\ash
cd frontend
npm install
npm run dev
\\\
Navigate to [http://127.0.0.1:3000](http://127.0.0.1:3000)

---

## ⚠️ Scientific & Clinical Disclaimer
*This project is built for **computational demonstration, research, and engineering display purposes only**. The mathematical algorithms contained herein (such as FIB-4 approximation and QTc mapping) reflect public medical guidelines but **DO NOT constitute diagnostic software or medical advice**. This tool must not be used for diagnosis, prognosis, or clinical decision-making in any format.*
