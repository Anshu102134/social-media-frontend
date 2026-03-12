import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // ✅ Use environment variable for backend URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const loginHandler = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/users/login`,
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { token } = response.data;
            localStorage.setItem('token', token);

            alert('✅ Login successful!');
            navigate('/home'); // Redirect to home page
        } catch (err) {
            console.error('Login error:', err);
            alert(err.response?.data?.message || '❌ Login failed');
        }
    };

    return (
        <div>
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /><br />

            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br />

            <button onClick={loginHandler}>Login</button>
        </div>
    );
};