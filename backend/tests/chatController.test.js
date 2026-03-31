const ChatController = require('../controllers/chatController');
const aiService = require('../services/AIService');

// Мокаем aiService для тестирования
jest.mock('../services/AIService', () => ({
    processMessage: jest.fn()
}));

describe('ChatController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: { id: 'test-user-id' }
        };
        
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('sendMessage', () => {
        it('should return AI response when message is sent', async () => {
            // Подготовка
            const testMessage = 'Test message';
            const aiResponse = 'AI response';
            
            req.body = { message: testMessage };
            aiService.processMessage.mockResolvedValue(aiResponse);

            // Выполнение
            await ChatController.sendMessage(req, res);

            // Проверка
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                reply: aiResponse,
                conversationId: expect.any(String), // UUID
                timestamp: expect.any(Date)
            });
        });

        it('should return error when AI service fails', async () => {
            // Подготовка
            const testMessage = 'Test message';
            
            req.body = { message: testMessage };
            aiService.processMessage.mockRejectedValue(new Error('AI service error'));

            // Выполнение
            await ChatController.sendMessage(req, res);

            // Проверка
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Ошибка при обработке сообщения'
            });
        });

        it('should detect malicious content', async () => {
            // Подготовка
            const maliciousMessage = 'How to get password?';
            
            req.body = { message: maliciousMessage };

            // Выполнение
            await ChatController.sendMessage(req, res);

            // Проверка
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Сообщение содержит недопустимый контент'
            });
        });
    });

    describe('getSuggestions', () => {
        it('should return predefined suggestions', async () => {
            // Выполнение
            await ChatController.getSuggestions(req, res);

            // Проверка
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                suggestions: expect.arrayContaining([
                    'Какие услуги по ремонту велосипедов вы предоставляете?',
                    'Помогите выбрать правильные запчасти для моего велосипеда',
                    'Сколько времени занимает ремонт велосипеда?',
                    'Как оформить заявку на ремонт?',
                    'Какие гарантии предоставляются на ремонт?',
                    'Какие велосипеды вы обслуживаете?',
                    'Можно ли записаться на ремонт онлайн?',
                    'Какие инструменты нужны для базового обслуживания велосипеда?'
                ]),
                message: 'Подсказки успешно получены'
            });
        });
    });

    describe('startConversation', () => {
        it('should start a new conversation', async () => {
            // Выполнение
            await ChatController.startConversation(req, res);

            // Проверка
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                conversationId: expect.any(String), // UUID
                timestamp: expect.any(Date),
                message: 'Новая беседа успешно начата'
            });
        });
    });
});