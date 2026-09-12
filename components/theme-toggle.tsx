"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("eduadmin-theme");
    const isDark = saved ? saved === "dark" : true;
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
    setDark(isDark);
  }, []);

  function toggle() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    localStorage.setItem("eduadmin-theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={dark ? "Tema claro" : "Tema oscuro"}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
      <span>{dark ? "Tema claro" : "Tema oscuro"}</span>
    </button>
  );
}
