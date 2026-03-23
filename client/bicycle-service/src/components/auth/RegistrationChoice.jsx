import React, { useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import Registration from './Registration/Registration';
import ServiceCenterRegistration from '../serviceCenter/auth/ServiceCenterRegistration';

export default function RegistrationChoice() {
    const [showForm, setShowForm] = useState(null); // null, 'user', 'center'
    const [animationDirection, setAnimationDirection] = useState('forward'); // forward, backward

    const handleSelectUser = () => {
        setAnimationDirection('forward');
        setTimeout(() => setShowForm('user'), 10);
    };

    const handleSelectCenter = () => {
        setAnimationDirection('forward');
        setTimeout(() => setShowForm('center'), 10);
    };

    const handleBack = () => {
        setAnimationDirection('backward');
        setTimeout(() => setShowForm(null), 10);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="w-100" style={{ maxWidth: 800 }}>
                {showForm === null ? (
                    <Card className="shadow-lg">
                        <Card.Body className="p-5 text-center">
                            <Card.Title className="mb-4">
                                <h2>Выберите тип регистрации</h2>
                            </Card.Title>
                            
                            <p className="text-muted mb-5">
                                Выберите, для какой учетной записи вы хотите зарегистрироваться
                            </p>
                            
                            <Row className="g-4">
                                <Col md={6}>
                                    <div 
                                        className="card choice-card h-100 border-primary border-2 d-flex flex-column"
                                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                        onClick={handleSelectUser}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                                            <div className="text-primary mb-3" style={{ fontSize: '48px' }}>👤</div>
                                            <h5 className="card-title">Регистрация пользователя</h5>
                                            <p className="card-text text-muted small mt-2 text-center">
                                                Зарегистрируйтесь как обычный пользователь для заказа услуг и товаров
                                            </p>
                                            <Button 
                                                variant="outline-primary" 
                                                className="mt-3"
                                            >
                                                Выбрать
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                                
                                <Col md={6}>
                                    <div 
                                        className="card choice-card h-100 border-success border-2 d-flex flex-column"
                                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                        onClick={handleSelectCenter}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                                            <div className="text-success mb-3" style={{ fontSize: '48px' }}>🔧</div>
                                            <h5 className="card-title">Регистрация сервисного центра</h5>
                                            <p className="card-text text-muted small mt-2 text-center">
                                                Зарегистрируйтесь как сервисный центр для предоставления услуг
                                            </p>
                                            <Button 
                                                variant="outline-success" 
                                                className="mt-3"
                                            >
                                                Выбрать
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ) : (
                    <div className={`transition-container ${animationDirection === 'forward' ? 'slide-forward' : 'slide-backward'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <Button 
                                variant="outline-secondary" 
                                onClick={handleBack}
                                className="d-flex align-items-center"
                            >
                                ← Назад
                            </Button>
                            <h3 className="mb-0">
                                {showForm === 'user' ? 'Регистрация пользователя' : 'Регистрация сервисного центра'}
                            </h3>
                            <div style={{ width: '120px' }}></div> {/* Spacer for alignment */}
                        </div>
                        
                        {showForm === 'user' ? (
                            <Registration />
                        ) : (
                            <ServiceCenterRegistration />
                        )}
                    </div>
                )}
            </div>
        </Container>
    );
}