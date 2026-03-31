import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Container, Row, Col, Form, Card, Alert } from 'react-bootstrap';
import { sendMessageToAssistant, getSuggestions } from '../api/chatApi';
import './ChatInterface.css';

const ChatInterface = ({ show, onHide }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [initialSuggestionsLoaded, setInitialSuggestionsLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Загружаем приветственное сообщение и подсказки при открытии чата
  useEffect(() => {
    if (show && messages.length === 0) {
      // Добавляем приветственное сообщение
      const welcomeMessage = {
        id: 1,
        text: 'Привет! Я ИИ-ассистент сервисного центра велосипедов. Чем могу помочь?',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      
      // Загружаем подсказки
      loadInitialSuggestions();
    }
  }, [show]);

  const loadInitialSuggestions = async () => {
    try {
      const suggestions = await getSuggestions();
      setInitialSuggestionsLoaded(true);
      
      // Добавляем подсказки как сообщения ассистента
      const suggestionMessages = suggestions.map((suggestion, index) => ({
        id: 100 + index,
        text: `• ${suggestion}`,
        sender: 'assistant',
        timestamp: new Date(),
        isSuggestion: true
      }));
      
      setMessages(prev => [...prev, ...suggestionMessages]);
    } catch (err) {
      console.error('Ошибка загрузки подсказок:', err);
      
      // Если не удалось загрузить подсказки, используем стандартные
      const defaultSuggestions = [
        '• Какие услуги по ремонту велосипедов вы предоставляете?',
        '• Помогите выбрать правильные запчасти для моего велосипеда',
        '• Сколько времени занимает ремонт велосипеда?',
        '• Как оформить заявку на ремонт?'
      ];
      
      const suggestionMessages = defaultSuggestions.map((suggestion, index) => ({
        id: 100 + index,
        text: suggestion,
        sender: 'assistant',
        timestamp: new Date(),
        isSuggestion: true
      }));
      
      setMessages(prev => [...prev, ...suggestionMessages]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newUserMessage = {
        id: Date.now(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setInputValue('');
      setError(null);
      
      // Имитация набора сообщения ассистентом
      setIsTyping(true);
      
      try {
        // Отправляем сообщение ИИ-ассистенту
        const response = await sendMessageToAssistant({
          message: inputValue,
          conversationId: 'temp-conversation-id' // В реальной реализации будет настоящий ID беседы
        });
        
        const assistantResponse = {
          id: Date.now() + 1,
          text: response.reply || 'Спасибо за ваш вопрос! В настоящее время я нахожусь в режиме разработки, но вскоре смогу полноценно вам помочь.',
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantResponse]);
      } catch (err) {
        console.error('Ошибка при отправке сообщения:', err);
        
        const errorMessage = {
          id: Date.now() + 1,
          text: 'К сожалению, возникла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.',
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setError('Не удалось отправить сообщение. Проверьте подключение к интернету.');
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSuggestionClick = (suggestionText) => {
    const clickedSuggestion = {
      id: Date.now(),
      text: suggestionText.replace('• ', ''),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, clickedSuggestion]);
    
    // Имитация набора сообщения ассистентом
    setIsTyping(true);
    
    // Имитация ответа ассистента
    setTimeout(() => {
      const responses = [
        'Это отличный вопрос! В настоящее время я нахожусь в режиме разработки, но в будущем смогу предоставить подробную информацию по этой теме.',
        'Спасибо за ваш интерес! Я пока в режиме разработки, но вскоре смогу полноценно вам помочь.',
        'Я понимаю ваш интерес к этой теме. В настоящее время я нахожусь в режиме разработки, но в будущем смогу предоставить подробную информацию.',
        'Отличный выбор темы для обсуждения! В настоящее время я нахожусь в режиме разработки, но в будущем смогу полноценно отвечать на такие запросы.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantResponse = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg"
      dialogClassName="chat-modal"
      backdrop="static"
    >
      <Modal.Header className="chat-header">
        <Container fluid>
          <Row className="align-items-center">
            <Col xs="auto">
              <div className="robot-icon">🤖</div>
            </Col>
            <Col>
              <h5 className="mb-0 chat-title">ИИ-ассистент</h5>
              <small className="text-muted">Сейчас онлайн</small>
            </Col>
            <Col xs="auto">
              <Button 
                variant="link" 
                onClick={onHide}
                className="p-0 text-white"
              >
                ✕
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Header>
      
      <Modal.Body className="chat-body">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              {message.isSuggestion ? (
                <Card
                  className="suggestion-card"
                  onClick={() => handleSuggestionClick(message.text)}
                >
                  <Card.Body>
                    <Card.Text className="mb-0">{message.text}</Card.Text>
                  </Card.Body>
                </Card>
              ) : (
                <div className="message-content">
                  {message.text}
                  <small className="text-muted message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="message assistant-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </Modal.Body>
      
      <Modal.Footer className="chat-footer">
        <Form onSubmit={handleSendMessage} className="w-100">
          <div className="input-group">
            <Form.Control
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Введите сообщение..."
              className="chat-input"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              variant="primary" 
              className="send-button"
              disabled={!inputValue.trim() || isTyping}
            >
              {isTyping ? 'Отправка...' : 'Отправить'}
            </Button>
          </div>
        </Form>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatInterface;