import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import {
	Stack, Paper, Typography, Button,
	Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { WordType } from '../types/WordType';
import WordTranslationType from '../types/WordTranslationType';
import Dictionary from '../types/DictionaryType';
import wordService from '../services/WordService';


type WordListProps = {
	words: WordType[];
	setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
	dict: Dictionary | undefined;
}

const WordList = ({ words, setWords, dict }: WordListProps) => {
	const [open, setOpen] = useState(false);
	const [curWordId, setCurWordId] = useState('');
	const navigate = useNavigate();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {

	}, [])

	const translationsInLine = (translations: WordTranslationType[]) => {
		return translations.map(translation => translation.translation).join(', ');
	}

	const handleDeleteButtonClick = (wordId: string) => {
		setCurWordId(wordId);
		handleOpen();
	}

	const deleteWord = () => {
		handleClose();
		wordService.deleteWord(curWordId)
			.then(_ => {
				setWords(words.filter(word => word.id !== curWordId));
			})
			.catch(err => {
				console.log(err);
			});

		setCurWordId('');
	}

	const handleEditButtonClick = (wordId: string) => {
		navigate('/word', { state: { dict: dict, words: words, word: words.find(word => word.id === wordId) } })
	}

	const renderWords = () => {
		return words.map(word => (
			<Paper sx={{
				bgcolor: 'primary.main',
				textAlign: 'left',
				paddingY: 2,
				paddingX: 3
			}}>
				<Stack justifyContent='space-between' direction='row'>
					<Typography variant='h6'>
						{word.word}
					</Typography>
					<Stack direction='row' gap={2}>
						<Button variant='contained' onClick={() => handleEditButtonClick(word.id)}>
							<EditIcon />
						</Button>
						<Button variant='contained' onClick={() => handleDeleteButtonClick(word.id)}>
							<DeleteIcon />
						</Button>
					</Stack>
				</Stack>

				<Typography variant='body1' sx={{ paddingLeft: 2, paddingTop: 1 }}>
					{translationsInLine(word.translations)}
				</Typography>
			</Paper>
		));
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
				<Button variant='contained' onClick={() => navigate('/word', { state: { dict: dict, words: words } })}>
					<AddIcon />
				</Button>
			</Stack>
			<Stack sx={{ gap: 2 }}>
				{
					(words.length === 0) ?
						<Typography textAlign='center' variant='h6' paddingBottom={2}>
							<FormattedMessage id='wordlist.no_words' />
						</Typography>
						: renderWords()
				}
			</Stack>

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
