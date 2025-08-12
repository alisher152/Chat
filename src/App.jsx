import { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input, time: new Date() };
    const botMessage = {
      role: "assistant",
      text: `Ответ на сообщение "${input}"`,
      time: new Date(),
    };

    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""} h-screen flex flex-col`}>
      <div
        className={`flex flex-col flex-1 ${
          darkMode ? "bg-gray-900 text-gray-100" : "white text-black"
        }`}
      >
        <header className="relative text-center font-bold text-3xl py-6 shadow-md flex justify-center items-center bg-indigo-800 dark:bg-gray-800 text-white">
          Чат с ботом
          <button
            onClick={() => setMessages([])}
            title="Очистить чат"
            className="absolute right-16 p-2 rounded-full hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors"
          >
            🗑️
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Переключить тему"
            className="absolute right-6 rounded-full hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </header>

        <main
          className="flex-1 overflow-y-auto p-6 flex flex-col space-y-3 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900"
          aria-live="polite"
        >
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              role={msg.role}
              text={msg.text}
              time={msg.time}
              darkMode={darkMode}
            />
          ))}
          <div ref={messagesEndRef} />
        </main>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-6 bg-white dark:bg-gray-800 flex gap-4 border-t border-indigo-300 dark:border-gray-700 shadow-lg"
        >
          <textarea
            rows={1}
            className="flex-1 border border-indigo-400 dark:border-gray-600 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow resize-none bg-white dark:bg-gray-700 text-black dark:text-gray-200"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напиши сообщение... (Enter — отправить, Shift+Enter — новая строка)"
            autoFocus
          />
          <button
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors shadow-md select-none"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}
