const Router = require('express').Router;
const router = new Router();
const chatController = require('../controllers/chatController');

// Маршруты для чата с ИИ-ассистентом
router.post('/message', chatController.sendMessage);
router.post('/conversation/start', chatController.startConversation);
router.get('/conversation/:id/history', chatController.getConversationHistory);
router.get('/suggestions', chatController.getSuggestions);

module.exports = router;