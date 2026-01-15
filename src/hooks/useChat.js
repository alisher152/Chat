import { useState, useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";

// Симуляция ответа бота
const simulateBotResponse = async (userInput) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 700)
  );

  const responses = [
    `Я получил ваше сообщение: "${userInput}". Это интересный вопрос!`,
    `Спасибо за сообщение! Насчет "${userInput}" - у меня есть кое-что интересное.`,
    `Вы спросили: "${userInput}". Давайте подумаем об этом вместе...`,
    `Отличный вопрос! "${userInput}" - это действительно важная тема.`,
    `Я обрабатываю ваш запрос: "${userInput}". Вот что я могу сказать...`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

export const useChat = () => {
  const [messages, setMessages] = useLocalStorage("chat-messages", []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(
    async (text, options = {}) => {
      if (!text.trim() || isLoading) return;

      const messageId = Date.now().toString();
      const userMessage = {
        id: messageId,
        role: "user",
        text: text.trim(),
        time: new Date(),
        ...options,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      abortControllerRef.current = new AbortController();

      try {
        const botResponse = await simulateBotResponse(text);

        const botMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: botResponse,
          time: new Date(),
          isError: false,
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        if (err.name !== "AbortError") {
          const errorMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: "Извините, произошла ошибка. Попробуйте еще раз.",
            time: new Date(),
            isError: true,
          };

          setMessages((prev) => [...prev, errorMessage]);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading]
  );

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const editMessage = useCallback((id, newText) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, text: newText, edited: true } : msg
      )
    );
  }, []);

  const deleteMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const clearChat = useCallback(() => {
    if (window.confirm("Вы уверены, что хотите очистить всю историю чата?")) {
      setMessages([]);
      localStorage.removeItem("chat-messages");
    }
  }, []);

  const searchMessages = useCallback(
    (query) => {
      if (!query.trim()) return messages;
      return messages.filter((msg) =>
        msg.text.toLowerCase().includes(query.toLowerCase())
      );
    },
    [messages]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    cancelRequest,
    editMessage,
    deleteMessage,
    clearChat,
    searchMessages,
  };
};
