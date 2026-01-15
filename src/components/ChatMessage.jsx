import React, { useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatMessage = memo(
  ({
    id,
    role,
    text,
    time,
    darkMode,
    isError,
    edited,
    onEdit,
    onDelete,
    isEditing,
    onSaveEdit,
    onCancelEdit,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [editText, setEditText] = useState(text);
    const isUser = role === "user";

    const formatTime = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const handleSave = () => {
      if (editText.trim() && editText !== text) {
        onSaveEdit(id, editText);
      } else {
        onCancelEdit();
      }
    };

    if (isEditing) {
      return (
        <div
          className={`max-w-[85%] ${isUser ? "self-end" : "self-start"} mb-4`}
        >
          <div
            className={`
          px-5 py-3 rounded-2xl shadow-lg
          ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-indigo-200"
          }
        `}
          >
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-transparent focus:outline-none resize-none"
              rows={Math.min(editText.split("\n").length, 6)}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Сохранить
              </button>
              <button
                onClick={onCancelEdit}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`max-w-[85%] ${isUser ? "self-end" : "self-start"} mb-4`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-medium ${
              isUser
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {isUser ? "Вы" : "Бот"}
          </span>
          {isError && (
            <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
              Ошибка
            </span>
          )}
          {edited && <span className="text-xs text-gray-500">(изменено)</span>}
        </div>

        <div
          className={`
        relative px-5 py-3 rounded-2xl shadow-md transition-all duration-200
        ${
          isError
            ? "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800"
            : isUser
            ? darkMode
              ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            : darkMode
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900 border border-gray-200"
        }
        ${isHovered && isUser && "shadow-lg"}
      `}
        >
          {isHovered && isUser && (
            <div className="absolute -top-2 right-0 flex gap-1">
              <button
                onClick={() => onEdit(id, text)}
                className="p-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
                title="Редактировать"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          )}

          <div className="break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={darkMode ? vscDarkPlus : vs}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className={`${className} px-1 py-0.5 rounded ${
                        darkMode ? "bg-gray-900" : "bg-gray-100"
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {text}
            </ReactMarkdown>
          </div>

          <div className="flex justify-between items-center mt-2 pt-2 border-t border-opacity-20 border-current">
            <span className="text-xs opacity-70 select-none">
              {formatTime(time)}
            </span>
            {isUser && isHovered && (
              <button
                onClick={() => navigator.clipboard.writeText(text)}
                className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                title="Копировать"
              >
                📋
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ChatMessage;
