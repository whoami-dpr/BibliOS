import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  // Cargar el tema guardado en localStorage al inicio
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"; // por defecto arrancamos en dark
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Cada vez que cambia el tema, lo guardamos en localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Alternar entre light y dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
      title={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;


