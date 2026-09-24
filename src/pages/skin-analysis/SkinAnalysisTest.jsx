import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Analysis from '@/pages/Analysis';
import Results from '@/pages/Results';

/**
 * Isolated test wrapper for the Skin Analysis flow.
 * Uses HashRouter so react-router navigation (to /results) doesn't
 * interfere with App.jsx's pathname-based routing.
 *
 * Open at: /skin-analysis-test
 */
export default function SkinAnalysisTest() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/skin-analysis-test" element={<Analysis />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<Navigate to="/skin-analysis-test" replace />} />
      </Routes>
    </HashRouter>
  );
}
