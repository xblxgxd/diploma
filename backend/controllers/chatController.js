const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const aiService = require('../services/AIService');

class ChatController {
    // Отправка сообщения ИИ-ассистенту
    async sendMessage(req, res) {
        try {
            // Валидация входных данных
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { message, conversationId } = req.body;
            const userId = req.user?.id; // ID пользователя из токена (если аутентифицирован)

            // Проверка безопасности: фильтрация потенциально вредоносного контента
            if (this.containsMaliciousContent(message)) {
                return res.status(400).json({
                    success: false,
                    message: 'Сообщение содержит недопустимый контент'
                });
            }

            // Логика обработки сообщения пользователя и получения ответа от ИИ
            const aiResponse = await aiService.processMessage(message, conversationId, userId);

            // Проверка ответа ИИ на предмет безопасности
            if (this.containsUnsafeContent(aiResponse)) {
                return res.status(500).json({
                    success: false,
                    message: 'Ответ ИИ содержит недопустимый контент'
                });
            }

            // Сохранение сообщений в базе данных (опционально)
            await this.saveMessageToDB(userId, conversationId, message, aiResponse);

            res.json({
                success: true,
                reply: aiResponse,
                conversationId: conversationId || uuidv4(), // Возвращаем ID беседы
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Ошибка при отправке сообщения ИИ-ассистенту:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при обработке сообщения'
            });
        }
    }

    // Начало новой беседы
    async startConversation(req, res) {
        try {
            const userId = req.user?.id; // ID пользователя из токена (если аутентифицирован)
            const conversationId = uuidv4();

            // Здесь можно сохранить начальную информацию о беседе в базу данных
            await this.initiateConversationInDB(userId, conversationId);

            res.json({
                success: true,
                conversationId: conversationId,
                timestamp: new Date(),
                message: 'Новая беседа успешно начата'
            });
        } catch (error) {
            console.error('Ошибка при начале новой беседы:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при создании новой беседы'
            });
        }
    }

    // Получение истории беседы
    async getConversationHistory(req, res) {
        try {
            const { id: conversationId } = req.params;
            const userId = req.user?.id; // Проверяем, что пользователь имеет доступ к этой беседе

            // Проверка, принадлежит ли беседа пользователю (если аутентифицирован)
            const isValidAccess = await this.validateConversationAccess(conversationId, userId);
            if (!isValidAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'Нет доступа к этой беседе'
                });
            }

            // Получение истории из базы данных
            const history = await this.getConversationHistoryFromDB(conversationId);

            res.json({
                success: true,
                conversationId: conversationId,
                history: history,
                message: 'История беседы успешно получена'
            });
        } catch (error) {
            console.error('Ошибка при получении истории беседы:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении истории беседы'
            });
        }
    }

    // Получение возможных вариантов ответов/тем для начала общения
    async getSuggestions(req, res) {
        try {
            // Возвращаем предопределенные подсказки для ИИ-ассистента велосервиса
            const suggestions = [
                'Какие услуги по ремонту велосипедов вы предоставляете?',
                'Помогите выбрать правильные запчасти для моего велосипеда',
                'Сколько времени занимает ремонт велосипеда?',
                'Как оформить заявку на ремонт?',
                'Какие гарантии предоставляются на ремонт?',
                'Какие велосипеды вы обслуживаете?',
                'Можно ли записаться на ремонт онлайн?',
                'Какие инструменты нужны для базового обслуживания велосипеда?'
            ];

            res.json({
                success: true,
                suggestions: suggestions,
                message: 'Подсказки успешно получены'
            });
        } catch (error) {
            console.error('Ошибка при получении подсказок:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении подсказок'
            });
        }
    }

    // Вспомогательные методы

    // Проверка сообщения на наличие потенциально вредоносного контента
    containsMaliciousContent(message) {
        // Простая проверка на наличие потенциально опасных команд или запросов
        const maliciousPatterns = [
            /password/i,
            /secret/i,
            /token/i,
            /api[_-]?key/i,
            /jwt/i,
            /authorization/i,
            /cookie/i,
            /session/i,
            /sql|select|insert|update|delete|drop|create|alter/i,
            /exec|execute|eval|system|shell/i
        ];

        return maliciousPatterns.some(pattern => pattern.test(message));
    }

    // Проверка ответа ИИ на предмет небезопасного контента
    containsUnsafeContent(response) {
        // Простая проверка на наличие потенциально нежелательного контента
        const unsafePatterns = [
            /password/i,
            /secret/i,
            /token/i,
            /api[_-]?key/i,
            /confidential/i
        ];

        return unsafePatterns.some(pattern => pattern.test(response));
    }

    // Сохранение сообщения в базе данных (заглушка)
    async saveMessageToDB(userId, conversationId, userMessage, aiResponse) {
        // В реальной реализации здесь будет код для сохранения сообщений в базу данных
        console.log(`Сообщение сохранено: Пользователь ${userId}, Беседа ${conversationId}`);
    }

    // Инициализация беседы в базе данных (заглушка)
    async initiateConversationInDB(userId, conversationId) {
        // В реальной реализации здесь будет код для инициализации беседы в базе данных
        console.log(`Беседа инициализирована: Пользователь ${userId}, Беседа ${conversationId}`);
    }

    // Валидация доступа к беседе (заглушка)
    async validateConversationAccess(conversationId, userId) {
        // В реальной реализации здесь будет проверка, принадлежит ли беседа пользователю
        return true; // Пока возвращаем true для демонстрации
    }

    // Получение истории беседы из базы данных (заглушка)
    async getConversationHistoryFromDB(conversationId) {
        // В реальной реализации здесь будет код для получения истории из базы данных
        return [
            {
                id: 1,
                text: 'Привет! Я ИИ-ассистент сервисного центра велосипедов. Чем могу помочь?',
                sender: 'assistant',
                timestamp: new Date(Date.now() - 3600000) // 1 час назад
            },
            {
                id: 2,
                text: 'Вот что я могу для вас сделать:',
                sender: 'assistant',
                timestamp: new Date(Date.now() - 3500000)
            }
        ];
    }
}

module.exports = new ChatController();