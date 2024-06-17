import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import {
	Stack, Paper, Typography, Button,
	Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { WordType } from '../types/WordType';
import Dictionary from '../types/DictionaryType';
import wordService from '../services/WordService';
import WordItem from './WordItem';


type WordListProps = {
	studiedWords: WordType[];
	setStudiedWords: React.Dispatch<React.SetStateAction<WordType[]>>;
	wordsToStudy: WordType[];
	setWordsToStudy: React.Dispatch<React.SetStateAction<WordType[]>>;
	dict: Dictionary | undefined;
	loading: boolean;
}

const WordList = ({ studiedWords, setStudiedWords, wordsToStudy, setWordsToStudy, dict, loading }: WordListProps) => {
	const [open, setOpen] = useState(false);
	const [curWordId, setCurWordId] = useState('');
	const navigate = useNavigate();
	const [showStudied, setShowStudied] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDeleteButtonClick = (wordId: string) => {
		setCurWordId(wordId);
		handleOpen();
	}

	const deleteWord = () => {
		handleClose();
		wordService.deleteWord(curWordId)
			.then(_ => {
				setStudiedWords(studiedWords.filter(word => word.id !== curWordId));
				setWordsToStudy(wordsToStudy.filter(word => word.id !== curWordId));
			})
			.catch(err => {
				console.log(err);
			});

		setCurWordId('');
	}

	const handleEditButtonClick = (wordId: string) => {
		const words = [...studiedWords, ...wordsToStudy];
		navigate('/word', {
			state: {
				dict: dict,
				words: words,
				word: words.find(word => word.id === wordId)
			}
		});
	}

	const renderWords = (wordsToRender: Array<WordType>) => {
		return wordsToRender.map(word => <WordItem
			word={word}
			handleEditButtonClick={handleEditButtonClick}
			handleDeleteButtonClick={handleDeleteButtonClick}
		/>);
	}

	return (
		<Stack sx={{
			width: '55%',
			bgcolor: 'secondary.main',
			paddingX: 3,
			paddingY: 2,
			borderRadius: 2,
			gap: 2,
			justifyContent: 'space-between',
		}}>
			<Stack direction='row' justifyContent='space-between'>
				<Typography variant='h5'>
					<FormattedMessage id='wordlist.title' />
				</Typography>
				<Button variant='contained' onClick={() => navigate('/word', { state: { dict: dict, words: [...studiedWords, ...wordsToStudy] } })}>
					<AddIcon />
				</Button>
			</Stack>
			{
				loading ?
					<Typography variant='h5'>
						<FormattedMessage id='loading' />
					</Typography>
					: <Stack sx={{ gap: 2 }}>
						{
							(wordsToStudy.length === 0) ?
								<Typography textAlign='center' variant='h6' paddingBottom={2}>
									<FormattedMessage id='wordlist.no_words' />
								</Typography>
								: renderWords(wordsToStudy)
						}
						{
							(studiedWords.length > 0) && <>
								<Button variant='contained' onClick={() => setShowStudied(!showStudied)}>
									{
										showStudied ? <FormattedMessage id='wordlist.hide_studied_words' />
											: <FormattedMessage id='wordlist.show_studied_words' />
									}
								</Button>
								{(showStudied) ? renderWords(studiedWords) : null}
							</>
						}
					</Stack>
			}

			<Dialog
				open={open}
				onClose={handleClose}
			>
				<Paper sx={{ bgcolor: 'secondary.main', borderRadius: 0 }}>
					<DialogTitle>
						<FormattedMessage id='wordpage.modal_delete_word.title' />
					</DialogTitle>
					<DialogContent>
						<DialogContentText color='info'>
							<FormattedMessage id='wordpage.modal_delete_word.body' />
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} variant='contained'>
							<FormattedMessage id='wordpage.modal_delete_word.no' />
						</Button>
						<Button onClick={deleteWord} variant='contained'>
							<FormattedMessage id='wordpage.modal_delete_word.yes' />
						</Button>
					</DialogActions>
				</Paper>

			</Dialog>
		</Stack>
	)
}

export default WordList;
