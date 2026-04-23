import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    const userData = JSON.parse(localStorage.getItem('user'));
                    setUser(userData);
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            const userData = {
                id: response.data.id,
                email: response.data.email,
                role: response.data.role
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
        return response.data;
    };

    const registerStudent = async (data) => {
        return await api.post('/auth/student/register', data);
    };

    const registerCompany = async (data) => {
        return await api.post('/auth/company/register', data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, registerStudent, registerCompany, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
