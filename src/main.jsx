import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./i18n"; // Quan trọng: khởi tạo i18n trước render
import "./index.css";

import App from "./App.jsx";
import Simple from "./simple.jsx"; // đảm bảo đúng tên file
import Intro from "./Intro";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Nếu deploy dưới subpath, mở comment và chỉnh basename */}
    {/* <BrowserRouter basename={import.meta.env.BASE_URL}> */}
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          <Route path="/127103474099498" element={<Intro />} />
          <Route path="/community-standard-69872655134" element={<App />} />
          <Route path="/" element={<Simple />} />
          {/* Fallback cho mọi path không khớp */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
