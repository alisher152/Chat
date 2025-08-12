import ReactMarkdown from "react-markdown";

export default function ChatMessage({ role, text, time, darkMode }) {
  const isUser = role === "user";

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md text-lg break-words
        ${
          isUser
            ? darkMode
              ? "bg-indigo-600 text-white self-end animate-fadeInUser"
              : "bg-indigo-600 text-white self-end animate-fadeInUser"
            : darkMode
            ? "bg-gray-700 text-gray-100 self-start animate-fadeInBot"
            : "bg-white text-indigo-900 self-start animate-fadeInBot"
        }`}
      style={{ animationDuration: "0.4s" }}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
      <div className="text-xs text-indigo-300 dark:text-indigo-400 mt-1 text-right select-none">
        {formatTime(time)}
      </div>
    </div>
  );
}
