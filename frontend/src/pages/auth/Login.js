import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Mock authentication logic
        if (username === 'admin' && password === 'admin123') {
            onLogin({ id: 1, username: 'admin', role: 'admin', token: 'mock-token-1' });
        } else if (username === 'admin1' && password === 'admin123') {
            onLogin({ id: 2, username: 'admin1', role: 'admin', token: 'mock-token-2' });
        } else if (username === 'admin2' && password === 'admin123') {
            onLogin({ id: 3, username: 'admin2', role: 'admin', token: 'mock-token-3' });
        } else if (username === 'user' && password === 'user123') {
            onLogin({ id: 200, username: 'user', role: 'user', token: 'mock-user-token' });
        } else {
            setError('Credenciales inválidas. Prueba "admin/admin123", "admin1/admin123", "admin2/admin123" o "user/user123".');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu usuario"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>
                    <button type="submit" className="login-button">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
