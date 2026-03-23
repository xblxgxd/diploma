import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

const API = process.env.REACT_APP_API_URL || '/api';

export default function UnifiedLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser, loginServiceCenter } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const from = location.state?.from?.pathname || '/';

    const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast.warn('Заполните email и пароль');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            // Сначала пробуем аутентифицировать как пользователя
            let response;
            
            // Пробуем сначала аутентификацию пользователя
            try {
                response = await fetch(`${API}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    await loginUser(data.token); // подтянет профиль пользователя
                    toast.success('Добро пожаловать!');
                    navigate(from, { replace: true });
                    return;
                }
            } catch (userAuthError) {
                console.log('User authentication failed, trying service center...');
            }
            
            // Если аутентификация пользователя не удалась, пробуем сервисный центр
            try {
                const centerResponse = await api.post('/service-centers/login', form);
                if (centerResponse.data && centerResponse.data.token) {
                    await loginServiceCenter(centerResponse.data.token);
                    toast.success('Добро пожаловать!');
                    // Перенаправляем на панель управления сервисного центра
                    navigate('/center/dashboard', { replace: true });
                    return;
                }
            } catch (centerAuthError) {
                console.log('Service center authentication failed too');
            }
            
            // Если обе попытки не удались
            toast.error('Не удалось войти. Проверьте данные.');
        } catch (err) {
            setError('Произошла ошибка при попытке входа');
            toast.error('Не удалось войти. Проверьте данные.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mx-auto" style={{ maxWidth: 480 }}>
            <Card.Body>
                <Card.Title>Вход</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            name="email" 
                            type="email" 
                            value={form.email} 
                            onChange={onChange} 
                            autoFocus 
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control 
                            name="password" 
                            type="password" 
                            value={form.password} 
                            onChange={onChange} 
                            disabled={loading}
                        />
                    </Form.Group>
                    <Button type="submit" disabled={loading} className="w-100">
                        {loading ? 'Входим…' : 'Войти'}
                    </Button>
                </Form>
                <div className="mt-3">
                    Нет аккаунта? 
                    <div>
                        <Link to="/register">Зарегистрироваться как клиент</Link>
                    </div>
                    <div>
                        <Link to="/center/register">Зарегистрировать сервисный центр</Link>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}