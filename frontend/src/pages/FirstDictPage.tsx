import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Button, Typography,
    Grid, Paper, Alert,
    Stack, Select, MenuItem
} from '@mui/material';
import { UUID } from 'crypto';
import { FormattedMessage, useIntl } from 'react-intl';

import Language from '../types/LanguageType';
import languageService from '../services/LanguageService';
import dictionaryService from '../services/DictionaryService';
import { createDictButtonStyle, paperContainerStyle } from './styles/StylesFirstDictPage';


const FirstDictPage = () => {
    const [languages, setLanguages] = useState<Array<Language>>([]);
    const [firstLangId, setFirstLangId] = useState<UUID | null>(null);
    const [secondLangId, setSecondLangId] = useState<UUID | null>(null);
    const [message, setMessage] = useState('');

    const intl = useIntl();
    const navigate = useNavigate();
    const { state } = useLocation();

    const getLanguages = () => {
        languageService.getLanguages()
            .then(res => {
                if (res.data.languages.length > 0) {
                    setLanguages(res.data.languages);
                    setFirstLangId(res.data.languages[0].id);
                    setSecondLangId(res.data.languages[0].id);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (!state?.redirected) {
            navigate('/');
            return;
        }
        getLanguages();
    }, []);

    const handleFirstLangChange = (e: any) => {
        setFirstLangId(e.target.value);
    };

    const handleSecondLangChange = (e: any) => {
        setSecondLangId(e.target.value);
    };

    const createDictionary = () => {
        setMessage('');

        if (firstLangId === secondLangId) {
            setMessage(intl.formatMessage({ id: 'modal_dicts.dict_create_error_same_langs' }));
            return;
        }

        dictionaryService.createDictionary(firstLangId!, secondLangId!)
            .then(_ => {
                navigate('/');
            })
            .catch(err => {
                console.log(err);
                setMessage(`Error: ${err.response?.status}.`);
            });
    };

    return (
        <Grid container justifyContent='center'>
            <Stack component={Paper} elevation={5} sx={paperContainerStyle}>
                <Typography textAlign={'center'} variant='h5' component='h5' sx={{ paddingBlockEnd: 1 }}>
                    <FormattedMessage id='first_dict.create_dictionary_title' />
                </Typography>
                <Stack>
                    <Typography variant='h6'>
                        <FormattedMessage id='first_dict.studied_lang_field_label' />
                    </Typography>
                    <Paper sx={{ bgcolor: 'primary.main' }}>
                        <Select onChange={handleFirstLangChange} value={firstLangId} fullWidth
                            MenuProps={{ PaperProps: { sx: { bgcolor: 'info.dark' } } }}>
                            {
                                languages.map((lang) => (
                                    <MenuItem key={lang.id} value={lang.id}>
                                        {lang.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </Paper>
                </Stack>
                <Stack>
                    <Typography variant='h6'>
                        <FormattedMessage id='first_dict.target_lang_field_label' />
                    </Typography>
                    <Paper sx={{ bgcolor: 'primary.main' }}>
                        <Select onChange={handleSecondLangChange} value={secondLangId} fullWidth
                            MenuProps={{ PaperProps: { sx: { bgcolor: 'info.dark' } } }}>
                            {
                                languages.map((lang) => (
                                    <MenuItem key={lang.id} value={lang.id}>
                                        {lang.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </Paper>
                </Stack>
                {message && <Alert sx={{ marginBottom: 2 }} severity='error'>{message}</Alert>}
                <Button variant='contained' onClick={() => createDictionary()} sx={createDictButtonStyle}>
                    <Typography variant='h6'>
                        <FormattedMessage id='modal_dicts.create_dictionary_btn' />
                    </Typography>
                </Button>
            </Stack>
        </Grid >
    );
};

export default FirstDictPage;

