// Симуляция ответа бота (можно заменить на реальный API)
export const simulateBotResponse = async (userInput, options = {}) => {
  // Имитация задержки сети
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

// Реальный API запрос (пример с OpenAI)
export const sendMessageToAPI = async (userInput, options = {}) => {
  const { signal } = options || {};

  // В реальном приложении здесь будет вызов к API
  // const API_KEY = process.env.REACT_APP_API_KEY;

  // Пример запроса:
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }],
      max_tokens: 500
    }),
    signal
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  return data.choices[0].message.content;
  */

  // Пока используем симуляцию
  return simulateBotResponse(userInput);
};
