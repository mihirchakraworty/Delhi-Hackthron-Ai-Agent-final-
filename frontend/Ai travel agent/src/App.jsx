import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home/Home";
import Plane from "./Home/Plane";
import FeaturesPage from "./Home/Features";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planner" element={<Plane />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;