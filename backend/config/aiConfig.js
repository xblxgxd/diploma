require('dotenv').config();

// Конфигурация для ИИ-сервиса
const aiConfig = {
  // Настройки OpenAI (если используется)
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
  },

  // Настройки Anthropic Claude (если используется)
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS) || 1000,
  },

  // Настройки Google Gemini (если используется)
  google: {
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    model: process.env.GOOGLE_GEMINI_MODEL || 'gemini-pro',
  },

  // Настройки по умолчанию для велосипедного ИИ-ассистента
  defaults: {
    systemPrompt: `Вы являетесь ИИ-ассистентом сервисного центра велосипедов. Ваша задача - помогать пользователям с вопросами о ремонте, обслуживании и запчастях для велосипедов. Будьте дружелюбны, профессиональны и предоставляйте точную информацию. Если вы не знаете точного ответа, честно признайте это и предложите связаться со специалистом.`,
    maxContextLength: 4096, // Максимальная длина контекста
    responseTimeout: 30000, // Таймаут ответа в миллисекундах
  },

  // Тематические подсказки для велосипедного сервиса
  serviceTopics: [
    'ремонт велосипедов',
    'велосипедные запчасти',
    'обслуживание велосипедов',
    'диагностика проблем',
    'советы по эксплуатации',
    'гарантийное обслуживание',
    'велосипедные аксессуары'
  ]
};

module.exports = aiConfig;