"use client";

import { useState } from "react";

export default function Home() {

  // ===============================
  // STATE MANAGEMENT
  // ===============================

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);


  // ===============================
  // CONNECTING TO FASTAPI BACKEND
  // ===============================

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", resumeFile!);
      formData.append("jd", jd);

 const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API URL not defined");
}

const response = await fetch(`${API_URL}/analyze-pdf`, {
 method: "POST",
        body: formData,
        // No "Content-Type" header — browser sets multipart automatically
      });
      const data = await response.json();
      setMatchedSkills(data.matched_skills);
      setMissingSkills(data.missing_skills);
      setAnalyzed(true);
    } catch (error) {
      console.error("Error analyzing skills:", error);
    } finally {
      setLoading(false);
    }
  };


  // ===============================
  // RENDER
  // ===============================

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0f;
          color: #e8e6ff;
          font-family: 'DM Mono', monospace;
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,60,255,0.15) 0%, transparent 70%);
          top: -100px; left: -100px;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,60,120,0.1) 0%, transparent 70%);
          bottom: 100px; right: -80px;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(60,200,255,0.08) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
          padding: 60px 24px 80px;
        }

        .header { margin-bottom: 56px; }

        .eyebrow {
          display: inline-block;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7c6fff;
          background: rgba(99,60,255,0.1);
          border: 1px solid rgba(99,60,255,0.25);
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 20px;
        }

        .title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #fff;
        }
        .title span {
          background: linear-gradient(135deg, #8b6fff 0%, #ff6b9d 50%, #6bf5ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          margin-top: 14px;
          font-size: 14px;
          color: #6e6a8a;
          line-height: 1.6;
          max-width: 480px;
        }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }
        @media (max-width: 640px) {
          .input-grid { grid-template-columns: 1fr; }
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          transition: border-color 0.2s;
        }
        .card:focus-within { border-color: rgba(99,60,255,0.4); }

        .card-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #b0accc;
          margin-bottom: 14px;
        }
        .card-label-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7c6fff;
          flex-shrink: 0;
        }
        .card-label-dot.pink { background: #ff6b9d; }

        textarea {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: #e8e6ff;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          line-height: 1.7;
          padding: 14px 16px;
          resize: vertical;
          min-height: 180px;
          outline: none;
          transition: border-color 0.2s;
        }
        textarea::placeholder { color: #3e3a56; }
        textarea:focus { border-color: rgba(99,60,255,0.35); }

        .btn-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .analyze-btn {
          position: relative;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #fff;
          background: linear-gradient(135deg, #6c3fff 0%, #9b6fff 100%);
          border: none;
          border-radius: 12px;
          padding: 14px 36px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .analyze-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #7d50ff, #b07fff);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .analyze-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(108,63,255,0.4); }
        .analyze-btn:hover::before { opacity: 1; }
        .analyze-btn:active { transform: translateY(0); }
        .analyze-btn span { position: relative; z-index: 1; }
        .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-hint {
          font-size: 12px;
          color: #3e3a56;
          font-style: italic;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          margin-bottom: 40px;
        }

        .results-header {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4a4668;
          margin-bottom: 24px;
        }

        .score-section { margin-bottom: 32px; }
        .score-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
        }
        .score-text {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #b0accc;
        }
        .score-pct {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
        }
        .score-bar-bg {
          height: 6px;
          background: rgba(255,255,255,0.06);
          border-radius: 100px;
          overflow: hidden;
        }
        .score-bar-fill {
          height: 100%;
          border-radius: 100px;
          background: linear-gradient(90deg, #6c3fff, #50dc78);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .results-grid { grid-template-columns: 1fr; }
        }

        .result-card {
          border-radius: 16px;
          padding: 24px;
          border: 1px solid;
        }
        .result-card.matched {
          border-color: rgba(80,220,120,0.2);
          background: rgba(80,220,120,0.03);
        }
        .result-card.missing {
          border-color: rgba(255,100,100,0.2);
          background: rgba(255,100,100,0.03);
        }

        .result-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .result-title.matched { color: #50dc78; }
        .result-title.missing { color: #ff6464; }

        .result-count {
          margin-left: auto;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 400;
          opacity: 0.5;
          letter-spacing: 0;
          text-transform: none;
        }

        .skill-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 100px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
          transition: transform 0.15s;
          cursor: default;
        }
        .skill-tag:hover { transform: scale(1.05); }
        .skill-tag.matched {
          background: rgba(80,220,120,0.1);
          border: 1px solid rgba(80,220,120,0.25);
          color: #7effa0;
        }
        .skill-tag.missing {
          background: rgba(255,100,100,0.1);
          border: 1px solid rgba(255,100,100,0.25);
          color: #ff9a9a;
        }

        .empty-state {
          font-size: 12px;
          color: #3e3a56;
          font-style: italic;
          padding: 8px 0;
        }

        /* File upload input */
        .file-upload-area {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 180px;
          border: 1.5px dashed rgba(124,111,255,0.25);
          border-radius: 10px;
          background: rgba(0,0,0,0.2);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          overflow: hidden;
        }
        .file-upload-area:hover {
          border-color: rgba(124,111,255,0.5);
          background: rgba(99,60,255,0.05);
        }
        .file-upload-area.has-file {
          border-style: solid;
          border-color: rgba(124,111,255,0.4);
          background: rgba(99,60,255,0.06);
        }
        .file-upload-area input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
          min-height: unset;
          padding: 0;
          border: none;
          background: none;
          border-radius: 0;
        }
        .file-upload-icon {
          font-size: 28px;
          margin-bottom: 10px;
          opacity: 0.5;
        }
        .file-upload-text {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #6e6a8a;
          text-align: center;
          line-height: 1.6;
          pointer-events: none;
        }
        .file-upload-name {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #a89fff;
          text-align: center;
          font-weight: 500;
          margin-top: 4px;
          padding: 0 12px;
          word-break: break-all;
          pointer-events: none;
        }
        .file-upload-change {
          font-size: 11px;
          color: #4a4668;
          margin-top: 6px;
          pointer-events: none;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.4s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s ease 0.1s both; }
      `}</style>

      <div className="page">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="container">

          {/* HEADER */}
          <div className="header fade-up">
            <div className="eyebrow">AI-powered · Skill Analysis</div>
            <h1 className="title">Resume <span>Gap</span> Analyzer</h1>
            <p className="subtitle">
              Paste your resume and a job description to instantly surface what skills you have — and what you&apos;re missing.
            </p>
          </div>

          {/* INPUT SECTION */}
          <div className="input-grid fade-up">
            <div className="card">
              <div className="card-label">
                <div className="card-label-dot" />
                Your Resume
              </div>
              <div className={`file-upload-area ${resumeFile ? "has-file" : ""}`}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files) setResumeFile(e.target.files[0]);
                  }}
                />
                {resumeFile ? (
                  <>
                    <div className="file-upload-icon">📄</div>
                    <div className="file-upload-name">{resumeFile.name}</div>
                    <div className="file-upload-change">Click to change file</div>
                  </>
                ) : (
                  <>
                    <div className="file-upload-icon">☁️</div>
                    <div className="file-upload-text">
                      Drop your PDF here or click to browse
                      <br />
                      <span style={{ color: "#4a4668" }}>PDF only · Max 10MB</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="card">
              <div className="card-label">
                <div className="card-label-dot pink" />
                Job Description
              </div>
              <textarea
                placeholder="Paste job description..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>
          </div>

          {/* ANALYZE BUTTON */}
          <div className="btn-row fade-up">
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || !resumeFile || !jd.trim()}
            >
              <span>
                {loading && <span className="spinner" />}
                {loading ? "Analyzing..." : "Analyze Skills"}
              </span>
            </button>
            {(!resumeFile || !jd.trim()) && (
              <span className="btn-hint">Upload a PDF and paste a JD to get started</span>
            )}
          </div>

          {/* RESULTS SECTION */}
          {analyzed && (
            <>
              <div className="divider" />

              {/* Match Score */}
              {(matchedSkills.length + missingSkills.length) > 0 && (
                <div className="score-section fade-up">
                  <div className="score-label">
                    <span className="score-text">Match Score</span>
                    <span className="score-pct">
                      {Math.round(
                        (matchedSkills.length /
                          (matchedSkills.length + missingSkills.length)) *
                          100
                      )}%
                    </span>
                  </div>
                  <div className="score-bar-bg">
                    <div
                      className="score-bar-fill"
                      style={{
                        width: `${Math.round(
                          (matchedSkills.length /
                            (matchedSkills.length + missingSkills.length)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <p className="results-header">Analysis Results</p>

              <div className="results-grid fade-up-2">

                {/* Matched Skills */}
                <div className="result-card matched">
                  <div className="result-title matched">
                    <span>✓</span>
                    Matched Skills
                    <span className="result-count">{matchedSkills.length} found</span>
                  </div>
                  {matchedSkills.length > 0 ? (
                    <ul className="skill-list">
                      {matchedSkills.map((skill, i) => (
                        <li key={i} className="skill-tag matched">{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">No matching skills found.</p>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="result-card missing">
                  <div className="result-title missing">
                    <span>✕</span>
                    Missing Skills
                    <span className="result-count">{missingSkills.length} gaps</span>
                  </div>
                  {missingSkills.length > 0 ? (
                    <ul className="skill-list">
                      {missingSkills.map((skill, i) => (
                        <li key={i} className="skill-tag missing">{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">No skill gaps detected — great fit!</p>
                  )}
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
