import { useState, useEffect, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useLocation } from 'react-router-dom';
import { UUID } from 'crypto';
import {
  Grid, Stack, MenuItem, Select,
  Paper, Typography, Button,
} from '@mui/material';

import dictionaryService from '../services/DictionaryService';
import wordService from '../services/WordService';
import Dictionary from '../types/DictionaryType';
import ModalEditDictionaries from '../modals/ModalEditDictionaries';
import AuthContext from '../context/AuthContext';
import WordList from '../compontents/WordList';
import { WordType } from '../types/WordType';


const HomePage = () => {
  const { authTokens } = useContext(AuthContext);
  const { state } = useLocation();
  const intl = useIntl();

  const [dicts, setDicts] = useState<Array<Dictionary>>([]);
  const [currentDictId, setCurrentDictId] = useState<UUID | null>(state?.dictId ? state.dictId : null);
  const [words, setWords] = useState<Array<WordType>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const getWords = (dictId: UUID) => {
    setLoading(true);
    wordService.getWords(dictId)
      .then(res => {
        setWords(res.data?.words);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() =>
        setLoading(false)
      );
  }

  const setCurrentDict = (dictId: UUID) => {
    setCurrentDictId(dictId);
    getWords(dictId);
  }

  const getDictionaries = () => {
    dictionaryService.getDictionaries()
      .then(res => {
        if (res.data?.dictionaries.length > 0) {
          setDicts(res.data.dictionaries);
          setCurrentDict(state?.dictId ? state.dictId : res.data.dictionaries[0].id);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (!authTokens || !authTokens.accessToken) {
      navigate("/login");
      return;
    }

    getDictionaries();
  }, [])

  const handleDictChange = (e: any) => {
    setCurrentDict(e.target.value);
  }

  const handleStartTrain = () => {
    if (words?.length === 0) {
      alert(intl.formatMessage({ id: 'train_sidebar.no_words_error' }));
    }
    else {
      navigate('/train-words-by-tranlsation', { state: { words: words } });
    }
  }

  return (
    <Grid container sx={{ padding: 2, gap: '1%' }}>
      <Stack sx={{
        width: '23%',
        height: '100%',
        bgcolor: 'secondary.main',
        paddingX: 3,
        paddingY: 2,
        borderRadius: 2,
        gap: 1,
        justifyContent: 'space-between',
      }}>
        <Typography variant='h6'>
          <FormattedMessage id='sidebar.dict_title' />
        </Typography>
        <Paper sx={{ bgcolor: 'primary.main' }}>
          <Select onChange={handleDictChange} value={currentDictId} fullWidth
            MenuProps={{ PaperProps: { sx: { bgcolor: 'info.dark' } } }}>
            {dicts.map((dict) => (
              <MenuItem key={dict.id} value={dict.id}>
                {dict.learnedLanguage.name} - {dict.targetLanguage.name}
              </MenuItem>
            ))}
          </Select>
        </Paper>
        <ModalEditDictionaries dicts={dicts} setDicts={setDicts} currentDictId={currentDictId} setCurrentDict={setCurrentDict} />
      </Stack>

      <WordList words={words} setWords={setWords} dict={dicts.find(dict => dict.id === currentDictId)} loading={loading} />

      <Stack sx={{
        width: '19%',
        height: '100%',
        bgcolor: 'secondary.main',
        paddingX: 3,
        paddingY: 2,
        borderRadius: 2,
        gap: 1,
        justifyContent: 'space-between',
      }}>
        {
          loading ?
            <Typography variant='h6'>
              <FormattedMessage id='loading' />
            </Typography>
            : <>
              <Typography variant='h6'>
                <FormattedMessage id='train_sidebar.train_menu_title' />
              </Typography>
              <Button variant='contained' sx={{ textTransform: 'none' }}
                onClick={() => handleStartTrain()}>
                <FormattedMessage id='train_sidebar.btn.write_word_for_translation' />
              </Button>
            </>
        }
      </Stack>
    </Grid>
  )
}

export default HomePage;
