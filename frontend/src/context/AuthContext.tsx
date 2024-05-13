import { createContext, useState, useEffect, FormEvent } from 'react';
import { AxiosError } from 'axios';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import LoginForm from '../types/LoginFormType';
import RegistrationForm from '../types/RegistrationFormType';
import authService from '../services/AuthService';

interface AuthContext {
    user: CustomJwtPayload | null;
    authTokens: any;
    loginUser: (e: FormEvent<LoginForm>) => void;
    registerUser: (e: FormEvent<RegistrationForm>) => void;
    message: string;
    changeMessage: (message: string) => void;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContext>({
    user: null,
    authTokens: null,
    loginUser: (e: FormEvent<LoginForm>) => { },
    registerUser: (e: FormEvent<RegistrationForm>) => { },
    message: '',
    changeMessage: () => { },
    logoutUser: () => { },
});

export default AuthContext;


interface CustomJwtPayload extends JwtPayload {
    email: string;
}

export const AuthProvider = ({ children }: any) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ?
        JSON.parse(localStorage.getItem('authTokens') || '') : null);
    const [user, setUser] = useState<CustomJwtPayload | null>(() => localStorage.getItem('authTokens') ?
        jwtDecode(localStorage.getItem('authTokens') || '') : null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const changeMessage = (message: string) => setMessage(message);

    const navigate = useNavigate();

    const loginUser = (e: FormEvent<LoginForm>) => {
        e.preventDefault();
        setMessage('');
        const target = e.currentTarget.elements;

        authService.login(target.username.value, target.password.value)
            .then(res => {
                setAuthTokens(res.data);
                setUser(jwtDecode(res.data.accessToken));
                localStorage.setItem('authTokens', JSON.stringify(res.data));
                navigate('/');
            })
            .catch(err => {
                console.log(err);
                if (err.response?.status === 400) {
                    setMessage(err.response?.data?.message);
                }
                else {
                    defaultAuthErrorHandling(err, 'Log in failed.');
                }
            });
    }

    const registerUser = (e: FormEvent<RegistrationForm>) => {
        e.preventDefault();
        const target = e.currentTarget.elements;

        authService.register(target.username.value, target.password.value)
            .then(res => {
                setAuthTokens(res.data);
                setUser(jwtDecode(res.data.accessToken));
                localStorage.setItem('authTokens', JSON.stringify(res.data));
                navigate('/');
            })
            .catch(err => {
                console.log(err.response?.data);
                if (err.response?.data?.message) {
                    setMessage(err.response?.data?.message);
                }
                else {
                    defaultAuthErrorHandling(err, 'Registration error');
                }
            });
    }

    const defaultAuthErrorHandling = (err: AxiosError, defaultErrorMsg: string) => {
        if (!err.response) {
            setMessage('Error. Failed to connect to the server.');
        }
        else {
            console.log(err);
            setMessage(defaultErrorMsg);
        }
    }

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    }

    const updateToken = () => {
        console.log('Update token call!');
        authService.refresh()
            .then((res) => {
                setAuthTokens(res.data);
                setUser(jwtDecode(res.data.accessToken));
                localStorage.setItem('authTokens', JSON.stringify(res.data));
            })
            .catch(_ => logoutUser())
            .finally(() => setLoading(false));
    }

    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        registerUser: registerUser,
        message: message,
        changeMessage: changeMessage,
        logoutUser: logoutUser
    }

    useEffect(() => {
        if (loading) {
            updateToken();
        }

        let minutes = 1000 * 60 * 14.5;
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, minutes);
        return () => clearInterval(interval);
    }, [loading, authTokens])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
