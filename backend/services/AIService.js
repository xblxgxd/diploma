const OpenAI = require('openai');
const aiConfig = require('../config/aiConfig');

class AIService {
    constructor() {
        this.provider = process.env.AI_PROVIDER || 'mock'; // 'openai', 'anthropic', 'google', 'mock'
        this.client = null;
        
        // Инициализация клиента в зависимости от провайдера
        switch(this.provider) {
            case 'openai':
                if(aiConfig.openai.apiKey) {
                    this.client = new OpenAI({
                        apiKey: aiConfig.openai.apiKey
                    });
                }
                break;
            case 'anthropic':
                // Здесь будет инициализация клиента Anthropic
                break;
            case 'google':
                // Здесь будет инициализация клиента Google
                break;
            default:
                // Режим mock для разработки
                break;
        }
    }

    /**
     * Обработка сообщения с использованием ИИ
     * @param {string} userMessage - Сообщение пользователя
     * @param {string} conversationId - ID беседы
     * @param {string} userId - ID пользователя
     * @returns {Promise<string>} Ответ ИИ
     */
    async processMessage(userMessage, conversationId, userId) {
        try {
            // Формирование системного промпта
            const systemPrompt = this.buildSystemPrompt();
            
            // В зависимости от провайдера вызываем соответствующий метод
            switch(this.provider) {
                case 'openai':
                    return await this.processWithOpenAI(userMessage, systemPrompt, conversationId);
                case 'anthropic':
                    return await this.processWithAnthropic(userMessage, systemPrompt, conversationId);
                case 'google':
                    return await this.processWithGoogle(userMessage, systemPrompt, conversationId);
                default:
                    // Режим mock для разработки
                    return await this.processWithMock(userMessage);
            }
        } catch (error) {
            console.error('Ошибка при обработке сообщения ИИ:', error);
            throw error;
        }
    }

    /**
     * Формирование системного промпта
     * @returns {string} Системный промпт
     */
    buildSystemPrompt() {
        return aiConfig.defaults.systemPrompt;
    }

    /**
     * Обработка с помощью OpenAI
     * @param {string} userMessage - Сообщение пользователя
     * @param {string} systemPrompt - Системный промпт
     * @param {string} conversationId - ID беседы
     * @returns {Promise<string>} Ответ ИИ
     */
    async processWithOpenAI(userMessage, systemPrompt, conversationId) {
        if (!this.client) {
            throw new Error('OpenAI API key не настроен');
        }

        try {
            const response = await this.client.chat.completions.create({
                model: aiConfig.openai.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: aiConfig.openai.temperature,
                max_tokens: aiConfig.openai.maxTokens,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Ошибка при вызове OpenAI API:', error);
            throw error;
        }
    }

    /**
     * Обработка с помощью Anthropic (заглушка)
     * @param {string} userMessage - Сообщение пользователя
     * @param {string} systemPrompt - Системный промпт
     * @param {string} conversationId - ID беседы
     * @returns {Promise<string>} Ответ ИИ
     */
    async processWithAnthropic(userMessage, systemPrompt, conversationId) {
        // В реальной реализации здесь будет вызов Anthropic API
        // Для демонстрации возвращаем заглушку
        return `Это ответ от Anthropic Claude. Вопрос: "${userMessage}". В реальной реализации здесь будет вызов API.`;
    }

    /**
     * Обработка с помощью Google (заглушка)
     * @param {string} userMessage - Сообщение пользователя
     * @param {string} systemPrompt - Системный промпт
     * @param {string} conversationId - ID беседы
     * @returns {Promise<string>} Ответ ИИ
     */
    async processWithGoogle(userMessage, systemPrompt, conversationId) {
        // В реальной реализации здесь будет вызов Google API
        // Для демонстрации возвращаем заглушку
        return `Это ответ от Google Gemini. Вопрос: "${userMessage}". В реальной реализации здесь будет вызов API.`;
    }

    /**
     * Обработка с помощью mock-сервиса (для разработки)
     * @param {string} userMessage - Сообщение пользователя
     * @returns {Promise<string>} Ответ ИИ
     */
    async processWithMock(userMessage) {
        // Пример логики обработки сообщения для mock-режима
        const lowerCaseMessage = userMessage.toLowerCase();
        
        if (lowerCaseMessage.includes('ремонт') || lowerCaseMessage.includes('почин')) {
            return 'Мы предоставляем широкий спектр услуг по ремонту велосипедов, включая ремонт тормозов, переключателей, замену покрышек и цепей. Наши специалисты имеют большой опыт работы с различными типами велосипедов.';
        } else if (lowerCaseMessage.includes('запчасти') || lowerCaseMessage.includes('компонент')) {
            return 'У нас в наличии широкий ассортимент запчастей для велосипедов от проверенных производителей. Мы можем помочь подобрать совместимые компоненты для вашего велосипеда. Для этого укажите модель и год выпуска велосипеда.';
        } else if (lowerCaseMessage.includes('время') || lowerCaseMessage.includes('долго')) {
            return 'Сроки ремонта зависят от сложности работ. Простой ремонт (например, замена тормозных колодок) занимает 1-2 часа. Более сложные работы могут занять от 1 до 5 рабочих дней. Точный срок сообщается после диагностики.';
        } else if (lowerCaseMessage.includes('заявк') || lowerCaseMessage.includes('запис')) {
            return 'Вы можете оформить заявку на ремонт через наш веб-сайт. Перейдите в раздел "Сервис-центры", выберите подходящий центр, и создайте заявку на ремонт. Также возможно оформление заявки по телефону.';
        } else if (lowerCaseMessage.includes('привет') || lowerCaseMessage.includes('здравствуй')) {
            return 'Здравствуйте! Я ИИ-ассистент сервисного центра велосипедов. Я могу ответить на ваши вопросы о ремонте, запчастях, сроках обслуживания и других услугах. Чем могу помочь?';
        } else {
            return 'Спасибо за ваш вопрос! Я ИИ-ассистент сервисного центра велосипедов. В настоящее время я нахожусь в режиме разработки, но вскоре смогу полноценно отвечать на такие запросы. Для получения подробной информации о наших услугах, пожалуйста, свяжитесь с нашими специалистами.';
        }
    }

    /**
     * Проверка готовности сервиса
     * @returns {boolean} Готовность сервиса
     */
    isReady() {
        if (this.provider === 'mock') {
            return true;
        }
        
        return !!this.client;
    }
}

module.exports = new AIService();