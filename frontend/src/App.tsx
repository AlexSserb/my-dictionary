import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ApplicationBar from './compontents/AppBar';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <AuthProvider>
          <ApplicationBar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/registration' element={<RegistrationPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
