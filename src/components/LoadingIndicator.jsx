import React, { useState, useEffect } from "react";

const LoadingIndicator = ({
  message = "Идет загрузка...",
  cancelable = false,
  onCancel,
  type = "dots",
  progress = 0,
  size = "medium",
}) => {
  const [dots, setDots] = useState("");
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (type === "dots") {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev.length >= 3) return "";
          return prev + ".";
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [type]);

  useEffect(() => {
    if (type === "spinner") {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 10) % 360);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [type]);

  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const containerSizeClasses = {
    small: "p-3",
    medium: "p-4",
    large: "p-6",
  };

  const renderLoader = () => {
    switch (type) {
      case "dots":
        return (
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`
                  w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500
                  animate-bounce
                  ${
                    i === 1
                      ? "animation-delay-100"
                      : i === 2
                      ? "animation-delay-200"
                      : ""
                  }
                `}
              ></div>
            ))}
          </div>
        );

      case "spinner":
        return (
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 rounded-full"></div>
            <div
              className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full"
              style={{ transform: `rotate(${rotation}deg)` }}
            ></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full"></div>
          </div>
        );

      case "progress":
        return (
          <div className="w-full max-w-xs">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {Math.round(progress)}%
            </div>
          </div>
        );

      case "message":
        return (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {message}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Пожалуйста, подождите...
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`
      inline-flex flex-col items-center justify-center
      ${containerSizeClasses[size]}
      rounded-xl
      bg-white/80 dark:bg-gray-800/80
      backdrop-blur-sm
      shadow-lg
      border border-gray-200 dark:border-gray-700
      transition-all duration-300
    `}
    >
      {renderLoader()}

      {message && type !== "message" && (
        <div className={`mt-4 text-center ${sizeClasses[size]}`}>
          <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
            {message}
          </div>
          {type === "dots" && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Это может занять несколько секунд{dots}
            </div>
          )}
        </div>
      )}

      {cancelable && onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
        >
          Отменить
        </button>
      )}

      <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-indigo-100 dark:bg-indigo-900/20 rounded-full animate-pulse-slow"></div>
        <div
          className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

export const TypingIndicator = ({ darkMode = false }) => (
  <div className="flex items-center space-x-2">
    <div
      className={`w-2 h-2 rounded-full ${
        darkMode ? "bg-gray-400" : "bg-gray-600"
      } animate-bounce`}
    ></div>
    <div
      className={`w-2 h-2 rounded-full ${
        darkMode ? "bg-gray-400" : "bg-gray-600"
      } animate-bounce`}
      style={{ animationDelay: "0.1s" }}
    ></div>
    <div
      className={`w-2 h-2 rounded-full ${
        darkMode ? "bg-gray-400" : "bg-gray-600"
      } animate-bounce`}
      style={{ animationDelay: "0.2s" }}
    ></div>
  </div>
);

export const MessageSkeleton = ({ darkMode = false }) => (
  <div
    className={`max-w-[70%] px-5 py-3 rounded-2xl ${
      darkMode ? "bg-gray-800" : "bg-gray-200"
    } animate-pulse`}
  >
    <div className="space-y-2">
      <div
        className={`h-3 rounded-full ${
          darkMode ? "bg-gray-700" : "bg-gray-300"
        } w-3/4`}
      ></div>
      <div
        className={`h-3 rounded-full ${
          darkMode ? "bg-gray-700" : "bg-gray-300"
        } w-1/2`}
      ></div>
    </div>
  </div>
);

export default LoadingIndicator;
