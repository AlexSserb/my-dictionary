import { useState, useEffect, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import {
  Grid, Stack, MenuItem, Select,
  Paper, Typography,
} from '@mui/material';

import dictionaryService from '../services/DictionaryService';
import Dictionary from '../types/DictionaryType';
import ModalEditDictionaries from '../modals/ModalEditDictionaries';
import AuthContext from '../context/AuthContext';


const HomePage = () => {
  const { authTokens } = useContext(AuthContext);
  const [dicts, setDicts] = useState<Array<Dictionary>>([]);
  const [currentDictId, setCurrentDictId] = useState<UUID | null>(null);
  const navigate = useNavigate();

  const getDictionaries = () => {
    dictionaryService.getDictionaries()
      .then(res => {
        if (res.data?.dictionaries.length > 0) {
          setDicts(res.data.dictionaries);
          setCurrentDictId(res.data.dictionaries[0].id);
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
    setCurrentDictId(e.target.value);
  }

  return (
    <Grid container sx={{ padding: 2, direction: 'row' }}>
      <Stack sx={{
        width: '23%',
        bgcolor: 'secondary.main',
        padding: 3,
        borderRadius: 2,
        gap: 1,
        justifyContent: 'space-between',
      }}>
        <Typography>
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
        <ModalEditDictionaries dicts={dicts} setDicts={setDicts} currentDictId={currentDictId} setCurrentDictId={setCurrentDictId} />
      </Stack>
      <Stack sx={{ paddingLeft: 2 }}>
        <FormattedMessage id='msg' />
      </Stack>
    </Grid>
  )
}

export default HomePage;
