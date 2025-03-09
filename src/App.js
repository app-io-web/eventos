import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // 🔹 Troca BrowserRouter por HashRouter
import GlobalStyle from "./components/GlobalStyles";
import LoginScreen from "./components/LoginScreen";
import HomePage from "./components/homePage";
import GalleryPage from "./components/GalleryPage";

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/:tableCode" element={<LoginScreen />} />
        <Route path="/:tableCode/home" element={<HomePage />} />
        <Route path="/gallery/:tableCode/:username" element={<GalleryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
