import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WebHome from '../pages/Web/WebHome';
import WebFeatures from '../pages/Web/WebFeatures';
import WebContact from '../pages/Web/WebContact';
import WebDatabaseDocs from '../pages/Web/WebDatabaseDocs';
import WebLayout from '../components/layout/WebLayout';

const WebRoutes = () => {
  return (
    <WebLayout>
      <Routes>
        <Route path="/" element={<WebHome />} />
        <Route path="/caracteristicas" element={<WebFeatures />} />
        <Route path="/contacto" element={<WebContact />} />
        <Route path="/database-docs" element={<WebDatabaseDocs />} />
      </Routes>
    </WebLayout>
  );
};

export default WebRoutes; 