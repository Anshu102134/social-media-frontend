import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (file) data.append('profileImage', file);

        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            alert('Registration successful!');
            setFormData({ name: '', email: '', password: '' });
            setFile(null);
            navigate('/login');

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}

            <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <br />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <br />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
            />
            <br />

            <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                accept="image/*"
            />
            <br />

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
}

export default RegisterForm;