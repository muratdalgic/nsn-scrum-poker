import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./views/layout";
import Create from "./views/create";
import Scrum from "./views/scrum";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Create />} />
        <Route path="/room/:id" element={<Scrum />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
