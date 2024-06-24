import { useState, useEffect, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	Grid, Stack, TextField, Button, Alert, Box, Typography
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import AuthContext from '../context/AuthContext';
import { WordWithPointsType } from '../types/WordType';
import randomInteger from '../utils/randomInteger';


const TrainingWordsByTransPage = () => {
	const intl = useIntl();
	const navigate = useNavigate();
	const { state } = useLocation();
	const [passedWords, setPassedWords] = useState<WordWithPointsType[]>([]);
	const DEFAULT_POINTS = 10;
	const MIN_POINTS = 2;

	const { authTokens } = useContext(AuthContext);
	const [word, setWord] = useState<WordWithPointsType>({
		...state.words[randomInteger(0, state.words.length - 1)],
		points: DEFAULT_POINTS
	});
	const [userWord, setUserWord] = useState<string>('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (!authTokens || !authTokens.accessToken) {
			navigate("/login");
			return;
		}
	}, []);

	const checkWordAndGoNext = () => {
		setMessage('');

		if (userWord.trim().toLowerCase() === word.word.toLowerCase()) {
			state.words = state.words.filter((item: WordWithPointsType) => item.id !== word.id);

			if (state.words.length === 0) {
				navigate('/train-results', { state: { passedWords: [...passedWords, word] } });
			}

			setPassedWords([...passedWords, word]);

			setWord({ ...state.words[randomInteger(0, state.words.length - 1)], points: DEFAULT_POINTS });
			setUserWord('');
		}
		else {
			setMessage(intl.formatMessage({ id: 'train_word_by_translation.error_wrong_word' }));
			if (word.points > MIN_POINTS) {
				word.points--;
			}
		}
	};

	const takeHint = () => {
		if (word.word === userWord) return;

		let i = 0;
		while (i < word.word.length && i < userWord.length && word.word[i] === userWord[i]) {
			i++;
		}

		if (i === word.word.length) {
			setUserWord(userWord.substring(0, word.word.length));
		}
		else {
			setUserWord(userWord.substring(0, i) + word.word[i]);
		}

		if (word.points > MIN_POINTS) {
			word.points--;
		}
	};

	const fieldBoxStyle = {
		borderColor: 'info',
		borderWidth: '1px',
		border: 'solid',
		borderRadius: 2
	};

	return (
		<Grid container sx={{ padding: 2, gap: 2, justifyContent: 'center' }}>
			<Stack sx={{
				width: '40%',
				minWidth: 330,
				bgcolor: 'secondary.main',
				paddingX: 5,
				paddingY: 4,
				borderRadius: 2,
				gap: 1,
				justifyContent: 'space-between',
			}}>
				<Typography variant='h5' paddingBottom={2}>
					<FormattedMessage id='train_word_by_translation.title' />
				</Typography>
				<Box textAlign='left' display='grid' gap={3}>
					<Box>
						<Typography color='info' variant='h6' marginBottom={1}>
							<FormattedMessage id='train_word_by_translation.tranlsations_label' />
						</Typography>
						<Grid container direction='row' wrap='wrap' gap={2} >
							{
								word?.translations.map(item => (
									<Stack direction='row' sx={{
										borderRadius: 2,
										gap: 1,
										justifyContent: 'space-between',
										alignItems: 'center',
										padding: 1,
										paddingX: 2,
										bgcolor: 'primary.main',
									}}>
										<Typography>{item.translation}</Typography>
									</Stack>
								))
							}
						</Grid>
					</Box>
					<Stack gap={1}>
						<Typography variant='h6'>
							<FormattedMessage id='train_word_by_translation.word_label' />
						</Typography>
						<Stack direction='row' gap={2}>
							<Box sx={fieldBoxStyle}>
								<TextField
									value={userWord}
									onChange={e => setUserWord(e.target.value)}
									type='text'
									required
									autoComplete='off'
								/>
							</Box>
							<Button variant='contained' sx={{ marginY: 1 }} onClick={() => setUserWord('')}>
								<ClearIcon />
							</Button>
							<Button variant='contained' sx={{ marginY: 1 }} onClick={() => takeHint()}>
								<LightbulbIcon />
							</Button>
						</Stack>
					</Stack>

					{message && (
						<Alert severity='error'>
							{message}
						</Alert>
					)}
					<Button variant='contained' onClick={() => checkWordAndGoNext()}>
						<FormattedMessage id='train_word_by_translation.btn_submit' />
					</Button>
					<Button variant='contained' onClick={() => navigate('/train-results', { state: { passedWords: passedWords } })}>
						<FormattedMessage id='train_word_by_translation.btn_finish_training' />
					</Button>
				</Box>
			</Stack>
		</Grid>
	);
};

export default TrainingWordsByTransPage;
