import React, { useState, useEffect } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './ChatButton.css';

const ChatButton = ({ onChatToggle, isChatOpen, unreadCount = 0 }) => {
  const location = useLocation();
  
  // Определяем, находится ли пользователь на страницах авторизации/регистрации
  const isAuthPage = [
    '/login', 
    '/register', 
    '/center/register'
  ].some(path => location.pathname.includes(path));
  
  // Если пользователь на странице авторизации/регистрации, не показываем кнопку
  if (isAuthPage) {
    return null;
  }
  
  return (
    <div className="chat-button-container">
      <Button 
        variant={isChatOpen ? "secondary" : "primary"} 
        className="chat-toggle-button"
        onClick={onChatToggle}
        aria-label={isChatOpen ? "Закрыть чат" : "Открыть чат"}
      >
        {isChatOpen ? '✕' : '🤖'}
        {unreadCount > 0 && (
          <Badge bg="danger" className="chat-unread-badge">
            {unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default ChatButton;