import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./components/ChatMessage";
import QuickReplies from "./components/QuickReplies";
import LoadingIndicator from "./components/LoadingIndicator";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useChat } from "./hooks/useChat";
import { exportChatAsText, formatFileSize } from "./utils/helpers";

function ChatApp() {
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const { darkMode } = useTheme();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    cancelRequest,
    editMessage,
    deleteMessage,
    clearChat,
    searchMessages,
  } = useChat();

  // Инициализация приложения
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  // Автофокус на текстовое поле
  useEffect(() => {
    if (!isLoading && textareaRef.current && !isInitializing) {
      textareaRef.current.focus();
    }
  }, [isLoading, isInitializing]);

  const handleSendMessage = useCallback(() => {
    if (!input.trim() || isLoading) return;

    if (editingId) {
      editMessage(editingId, input);
      setEditingId(null);
    } else {
      sendMessage(input);
    }

    setInput("");
  }, [input, editingId, sendMessage, editMessage, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

    if (e.key === "Escape" && editingId) {
      setEditingId(null);
      setInput("");
    }
  };

  const handleQuickReplySelect = (text) => {
    setInput(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleEditMessage = (id, currentText) => {
    setEditingId(id);
    setInput(currentText);
  };

  const handleSaveEdit = (id, newText) => {
    editMessage(id, newText);
    setEditingId(null);
    setInput("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Файл слишком большой. Максимальный размер: 5MB");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Неподдерживаемый тип файла");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileMessage = `📎 Отправлен файл: ${file.name} (${formatFileSize(
        file.size
      )})`;
      sendMessage(fileMessage, { file: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const filteredMessages = searchQuery ? searchMessages(searchQuery) : messages;

  // Полноэкранный индикатор загрузки
  if (isInitializing) {
    return (
      <div
        className={`h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <LoadingIndicator
          type="spinner"
          size="large"
          message="Загрузка чата..."
        />
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <header
        className={`
        text-center font-bold text-2xl md:text-3xl py-4 px-6 shadow-lg
        bg-gradient-to-r from-indigo-700 to-purple-700 
        dark:from-gray-900 dark:to-gray-800
        text-white
        flex justify-between items-center
      `}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-indigo-700 font-bold">🤖</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold">Умный чат-бот</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Поиск"
          >
            🔍
          </button>

          <button
            onClick={() => exportChatAsText(messages)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors hidden md:block"
            title="Экспорт чата"
          >
            📥
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Отправить файл"
          >
            📎
          </button>

          <button
            onClick={clearChat}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Очистить чат"
          >
            🗑️
          </button>

          <ThemeToggle />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept=".jpg,.jpeg,.png,.gif,.txt,.pdf"
        />
      </header>

      {showSearch && (
        <div className="px-6 py-3 bg-indigo-50 dark:bg-gray-800 border-b border-indigo-100 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск в истории чата..."
              className="flex-1 px-4 py-2 rounded-lg border border-indigo-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Очистить
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Найдено сообщений: {filteredMessages.length}
            </p>
          )}
        </div>
      )}

      {messages.length === 0 && !isLoading && (
        <QuickReplies onSelect={handleQuickReplySelect} darkMode={darkMode} />
      )}

      <main
        className={`
        flex-1 overflow-y-auto p-4 md:p-6
        ${darkMode ? "bg-gray-900" : "bg-gray-50"}
        transition-colors duration-300
        scrollbar-thin scrollbar-thumb-indigo-400 dark:scrollbar-thumb-gray-600
      `}
      >
        <div className="max-w-4xl mx-auto flex flex-col space-y-4">
          {filteredMessages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              role={msg.role}
              text={msg.text}
              time={msg.time}
              darkMode={darkMode}
              isError={msg.isError}
              edited={msg.edited}
              onEdit={handleEditMessage}
              onDelete={deleteMessage}
              isEditing={editingId === msg.id}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={() => {
                setEditingId(null);
                setInput("");
              }}
            />
          ))}

          {isLoading && (
            <div className="self-start max-w-[85%]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                  <span className="text-white text-sm">AI</span>
                </div>
                <LoadingIndicator
                  type="dots"
                  size="small"
                  message="Бот печатает..."
                  cancelable={true}
                  onCancel={cancelRequest}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className={`
          p-4 md:p-6 border-t
          ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }
          transition-colors duration-300
        `}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-xs ${
                input.length > 1000 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {input.length}/1000 символов
            </span>
            {editingId && (
              <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                Редактирование...
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    setInput(e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  editingId
                    ? "Редактируйте сообщение..."
                    : "Напишите сообщение... (Enter - отправить, Shift+Enter - новая строка)"
                }
                className={`
                  w-full border rounded-xl px-5 py-4 pr-24
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  transition-all duration-200 resize-none
                  ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }
                  ${editingId && "ring-2 ring-yellow-500"}
                `}
                style={{
                  minHeight: "56px",
                  maxHeight: "200px",
                }}
                disabled={isLoading}
              />

              <div className="absolute right-3 bottom-3 flex gap-1">
                <button
                  type="button"
                  onClick={() => setInput((prev) => `**${prev}**`)}
                  className="p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Жирный текст"
                >
                  𝐁
                </button>
                <button
                  type="button"
                  onClick={() => setInput((prev) => `*${prev}*`)}
                  className="p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Курсив"
                >
                  𝐼
                </button>
                <button
                  type="button"
                  onClick={() => setInput((prev) => `\`${prev}\``)}
                  className="p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Код"
                >
                  {"</>"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`
                  px-6 py-4 rounded-xl font-semibold
                  transition-all duration-200 transform
                  hover:scale-105 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${
                    darkMode
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  }
                  text-white shadow-lg
                `}
              >
                {editingId ? "💾 Сохранить" : "🚀 Отправить"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setInput("");
                  }}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Отмена
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              Enter
            </kbd>
            <span>отправить</span>
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              Shift + Enter
            </kbd>
            <span>новая строка</span>
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              Esc
            </kbd>
            <span>отмена редактирования</span>
          </div>
        </div>
      </form>

      <div
        className={`
        px-6 py-3 text-xs border-t
        ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-400"
            : "bg-gray-50 border-gray-200 text-gray-600"
        }
        flex justify-between items-center
      `}
      >
        <div>
          Сообщений: {messages.length} | Пользователь:{" "}
          {messages.filter((m) => m.role === "user").length} | Бот:{" "}
          {messages.filter((m) => m.role === "assistant").length}
        </div>
        <div>
          {new Date().toLocaleDateString("ru-RU", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-20 right-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fadeIn">
          Ошибка: {error}
          <button onClick={() => {}} className="ml-3 text-sm underline">
            Скрыть
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ChatApp />
    </ThemeProvider>
  );
}
