import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import WebGISDashboard from "./components/WebGISDashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">("landing");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-[#f8fafc]" : "bg-slate-50 text-slate-800"}`}>
      {currentPage === "landing" ? (
        <LandingPage 
          onEnterWebGIS={() => setCurrentPage("dashboard")} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <WebGISDashboard 
          onBackToLanding={() => setCurrentPage("landing")} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

