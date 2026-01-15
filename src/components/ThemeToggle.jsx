import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();

    setTimeout(() => setIsAnimating(false), 600);
  };

  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        relative w-14 h-8 rounded-full
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        transition-all duration-300 ease-in-out
        ${
          darkMode
            ? "bg-gradient-to-r from-gray-800 to-gray-900"
            : "bg-gradient-to-r from-yellow-300 to-orange-400"
        }
        shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        ${isAnimating ? "animate-pulse" : ""}
      `}
      aria-label={
        darkMode ? "Переключить на светлую тему" : "Переключить на темную тему"
      }
      title={darkMode ? "Светлая тема" : "Темная тема"}
    >
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <span
          className={`text-lg transition-opacity duration-300 ${
            darkMode ? "opacity-0" : "opacity-100"
          }`}
        >
          🌞
        </span>
        <span
          className={`text-lg transition-opacity duration-300 ${
            darkMode ? "opacity-100" : "opacity-0"
          }`}
        >
          🌙
        </span>
      </div>

      <div
        className={`
          absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${darkMode ? "translate-x-7" : "translate-x-1"}
          flex items-center justify-center
          ${isAnimating ? "animate-spin-slow" : ""}
        `}
      >
        <span className="text-sm">{darkMode ? "🌙" : "🌞"}</span>
      </div>

      {isAnimating && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
