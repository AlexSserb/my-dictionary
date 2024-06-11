import './App.css';
import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { SelectChangeEvent, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ApplicationBar from './compontents/AppBar';
import SettingsPage from './pages/SettingsPage';
import WordPage from './pages/WordPage';
import TrainWordsPage from './pages/TrainWordsPage';
import theme from './theme';

import { LOCALES } from './i18n/locales';
import { messages } from './i18n/messages';
import TrainResultsPage from './pages/TrainResultsPage';

function App() {
  const [currentLocale, setCurrentLocale] = useState(localStorage.getItem('locale') || LOCALES.ENGLISH);

  const handleLangChange = (e: SelectChangeEvent<string>) => {
    setCurrentLocale(e.target.value);
    localStorage.setItem('locale', e.target.value);
  }

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IntlProvider
          messages={messages[currentLocale].messages}
          locale={currentLocale}
          defaultLocale={LOCALES.ENGLISH}
        >
          <BrowserRouter>
            <AuthProvider>
              <ApplicationBar />
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/registration' element={<RegistrationPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/settings' element={<SettingsPage currentLocale={currentLocale} handleLangChange={handleLangChange} />} />
                <Route path='/word' element={<WordPage />} />
                <Route path='/train-words-by-tranlsation' element={<TrainWordsPage />} />
                <Route path='/train-results' element={<TrainResultsPage />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </IntlProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
