import { useState, useEffect, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
	Grid, Stack, TextField, Button, Alert,
	Box, Typography, FormControl,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import AuthContext from '../context/AuthContext';
import { NewWordType, WordType } from '../types/WordType';
import translationService from '../services/TranslationService';
import Dictionary from '../types/DictionaryType';
import WordTranslationType from '../types/WordTranslationType';
import wordService from '../services/WordService';


const WordPage = () => {
	const { authTokens } = useContext(AuthContext);
	const [word, setWord] = useState<NewWordType>({ word: '', translations: [] });
	const [message, setMessage] = useState('');
	const [curTrans, setCurTrans] = useState<WordTranslationType>({ id: uuidv4(), translation: "" });

	const intl = useIntl();
	const navigate = useNavigate();
	const { state } = useLocation();
	const words: WordType[] = state.words;
	const dict: Dictionary = state.dict;

	useEffect(() => {
		if (!authTokens || !authTokens.accessToken) {
			navigate("/login");
			return;
		}
	}, [])

	const translate = () => {
		translationService.googleTranslate({
			languageFrom: dict.targetLanguage,
			languageTo: dict.learnedLanguage,
			text: word.word
		})
			.then(res => {
				setWord({ word: word.word, translations: res.data.translations });
				console.log(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	}

	const addTranslation = () => {
		setWord({ word: word.word, translations: [...word.translations, curTrans] });
		setCurTrans({ id: uuidv4(), translation: "" });
	}

	const removeTranslation = (translation: WordTranslationType) => {
		setWord({ word: word.word, translations: word.translations.filter(t => t.id !== translation.id) });
	}

	const newWordToWord = (newWord: NewWordType): WordType => {
		return {
			id: uuidv4(),
			word: newWord.word,
			translations: newWord.translations,
			dictionary_id: dict.id
		}
	}

	const saveWord = () => {
		setMessage('');
		if (words.find(item => item.word === word.word)) {
			setMessage(intl.formatMessage({ id: 'wordpage.error_word_exists' }));
		}
		else if (word.translations.length === 0) {
			setMessage(intl.formatMessage({ id: 'wordpage.error_word_must_have_translation' }));
		}
		else {
			wordService.saveWord(newWordToWord(word))
				.then(_ => {
					navigate('/', { state: { dictId: dict.id } });
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	const fieldBoxStyle = {
		borderColor: 'info',
		borderWidth: '1px',
		border: 'solid',
		borderRadius: 2
	};

	return (
		<Grid container sx={{ padding: 2, gap: 2, justifyContent: 'center' }}>
			<Stack sx={{
				width: '50%',
				bgcolor: 'secondary.main',
				paddingX: 5,
				paddingY: 4,
				borderRadius: 2,
				gap: 1,
				justifyContent: 'space-between',
			}}>
				<Typography variant='h5' paddingBottom={2}>
					<FormattedMessage id='wordpage.title' />
				</Typography>
				<Box textAlign='left' display='grid' gap={2}>
					<Typography color='info'>
						<FormattedMessage id='wordpage.dict_field_label' />
						{dict?.learnedLanguage?.name + ' - ' + dict?.targetLanguage?.name}
					</Typography>
					<Stack direction='row'>
						<FormControl>
							<Typography color='info'>
								<FormattedMessage id='wordpage.word_field_label' /> ({dict?.targetLanguage?.name})
							</Typography>
							<Stack direction='row' gap={2}>
								<Box sx={fieldBoxStyle}>
									<TextField
										onChange={e => setWord({ word: e.target.value, translations: word.translations })}
										type='text'
										required
									/>
								</Box>
								<Button variant='contained' type='button' onClick={() => translate()}>
									<FormattedMessage id='wordpage.translate_button' />
								</Button>
							</Stack>
						</FormControl><br />
					</Stack>

					<Stack direction='row'>
						<FormControl>
							<Typography color='info'>
								<FormattedMessage id='wordpage.translation_field_label' /> ({dict?.learnedLanguage?.name})
							</Typography>
							<Stack direction='row' gap={2}>
								<Box sx={fieldBoxStyle}>
									<TextField
										value={curTrans.translation}
										onChange={e => setCurTrans({ id: curTrans.id, translation: e.target.value })}
										type='text'
										required
									/>
								</Box>
								<Button variant='contained' onClick={() => addTranslation()}>
									<FormattedMessage id='wordpage.add_translation_button' />
								</Button>
							</Stack>
						</FormControl><br />
					</Stack>

					<Grid container direction='row' wrap='wrap' gap={2} >
						{
							word.translations.map(item => (
								<Stack direction='row' sx={{
									borderRadius: 2,
									gap: 1,
									justifyContent: 'space-between',
									alignItems: 'center',
									padding: 1,
									paddingLeft: 2,
									bgcolor: 'primary.main',
								}}>
									<Typography>{item.translation}</Typography>
									<Button variant='contained' onClick={() => removeTranslation(item)}>
										<ClearIcon />
									</Button>
								</Stack>
							))
						}
					</Grid>
					{message && (
						<Alert severity='error'>
							{message}
						</Alert>
					)}
					<Button variant='contained' type='submit' onClick={() => saveWord()} sx={{ paddingX: 2 }}>
						<FormattedMessage id='wordpage.save_button' />
					</Button>
				</Box>
			</Stack>
		</Grid>
	)
}

export default WordPage;
