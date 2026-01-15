import React from "react";

const QuickReplies = ({ onSelect, darkMode }) => {
  const quickReplies = [
    "Привет! Как дела?",
    "Расскажи шутку",
    "Что ты умеешь?",
    "Помоги с советом",
    "Какая сегодня погода?",
    "Расскажи о себе",
    "Что нового?",
    "Как научиться программировать?",
  ];

  return (
    <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b border-indigo-100 dark:border-gray-700">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Попробуйте спросить:
      </p>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(reply)}
            className={`
              px-4 py-2 text-sm rounded-full transition-all duration-200
              transform hover:scale-105 active:scale-95
              ${
                darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-white text-gray-800 hover:bg-indigo-50 border border-indigo-200"
              }
              shadow-sm hover:shadow-md
            `}
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
