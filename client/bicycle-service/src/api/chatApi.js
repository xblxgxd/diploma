// API-функции для работы с ИИ-ассистентом
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Создание экземпляра axios с базовыми настройками
const chatApi = axios.create({
  baseURL: `${API_BASE_URL}/chat`,
  timeout: 30000, // 30 секунд таймаута
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перед выполнением каждого запроса проверяем наличие токена аутентификации
chatApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // или другое место хранения токена
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов для обработки ошибок
chatApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Отправка сообщения ИИ-ассистенту
 * @param {Object} messageData - Данные сообщения
 * @param {string} messageData.message - Текст сообщения
 * @param {string} [messageData.conversationId] - ID беседы (для сохранения контекста)
 * @returns {Promise<Object>} Ответ от ИИ-ассистента
 */
export const sendMessageToAssistant = async (messageData) => {
  try {
    const response = await chatApi.post('/message', messageData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке сообщения ИИ-ассистенту:', error);
    throw error;
  }
};

/**
 * Начало новой беседы с ИИ-ассистентом
 * @returns {Promise<Object>} Данные новой беседы
 */
export const startNewConversation = async () => {
  try {
    const response = await chatApi.post('/conversation/start');
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании новой беседы:', error);
    throw error;
  }
};

/**
 * Получение истории беседы
 * @param {string} conversationId - ID беседы
 * @returns {Promise<Array>} История сообщений
 */
export const getConversationHistory = async (conversationId) => {
  try {
    const response = await chatApi.get(`/conversation/${conversationId}/history`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении истории беседы:', error);
    throw error;
  }
};

/**
 * Получение возможных вариантов ответов/тем для начала общения
 * @returns {Promise<Array>} Варианты тем/вопросов
 */
export const getSuggestions = async () => {
  try {
    const response = await chatApi.get('/suggestions');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении подсказок:', error);
    // Возвращаем стандартный набор подсказок в случае ошибки
    return [
      'Какие услуги по ремонту велосипедов вы предоставляете?',
      'Как выбрать правильные запчасти для моего велосипеда?',
      'Сколько времени занимает ремонт велосипеда?',
      'Как оформить заявку на ремонт?'
    ];
  }
};

export default chatApi;