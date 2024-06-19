import { useState, useEffect } from 'react';
import {
	Button, Typography, Modal, Paper, MenuItem,
	Stack, Box, Select, Alert,
	Table, TableRow, TableCell, TableBody, TableHead
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import Language from '../types/LanguageType';
import languageService from '../services/LanguageService';
import Dictionary from '../types/DictionaryType';
import dictionaryService from '../services/DictionaryService';
import { UUID } from 'crypto';
import { Delete } from '@mui/icons-material';
import { modalStyle } from './styles/StylesModalEditDictionaries';
import { modalTitleStyle } from './styles/Styles';


type ModalEditDictionariesProps = {
	dicts: Array<Dictionary>;
	setDicts: React.Dispatch<React.SetStateAction<Dictionary[]>>;
	currentDictId: UUID | null;
	setCurrentDict: (dictId: UUID) => void;
};

const ModalEditDictionaries = ({ dicts, setDicts, currentDictId, setCurrentDict }: ModalEditDictionariesProps) => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const intl = useIntl();

	const [languages, setLanguages] = useState<Array<Language>>([]);
	const [firstLangId, setFirstLangId] = useState<UUID>();
	const [secondLangId, setSecondLangId] = useState<UUID>();
	const [message, setMessage] = useState('');

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
		if (dicts.find(d => d.learnedLanguage.id === firstLangId && d.targetLanguage.id === secondLangId)) {
			setMessage(intl.formatMessage({ id: 'modal_dicts.dict_create_error_dict_already_exists' }));
			return;
		}

		dictionaryService.createDictionary(firstLangId, secondLangId)
			.then(res => {
				setDicts([res.data, ...dicts]);
				setCurrentDict(res.data.id);
			})
			.catch(err => {
				console.log(err);
				setMessage(`Error: ${err.response?.status}.`);
			});
	};

	const deleteDictionary = (id: UUID) => {
		dictionaryService.deleteDictionary(id)
			.then(_ => {
				const dictionaries = dicts.filter(d => d.id !== id);
				if (currentDictId === id && dictionaries.length >= 0) {
					setCurrentDict(dictionaries[0]?.id);
				}
				setDicts(dictionaries);
			})
			.catch(err => {
				console.log(err);
			});
	};

	return (
		<div>
			<Button variant='contained' fullWidth onClick={handleOpen}>
				<FormattedMessage id='sidebar.dict_edit_button' />
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
			>
				<Box sx={modalStyle}>
					<Typography variant='h5' component='h5' sx={modalTitleStyle}>
						<FormattedMessage id='modal_dicts.title' />
					</Typography>

					<Stack spacing={1}>
						<Stack spacing={1} direction='row'>
							<Stack sx={{ width: '50%' }}>
								<Typography><FormattedMessage id='studied_lang' /></Typography>
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
							<Stack sx={{ width: '50%' }}>
								<Typography><FormattedMessage id='target_lang' /></Typography>
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
						</Stack>
						{message && <Alert sx={{ marginBottom: 2 }} severity='error'>{message}</Alert>}
						<Button variant='contained' onClick={() => createDictionary()}>
							<FormattedMessage id='modal_dicts.create_dictionary_btn' />
						</Button>
						{
							dicts?.length > 0 ? (
								<Table>
									<TableHead>
										<TableRow>
											<TableCell><FormattedMessage id='studied_lang' /></TableCell>
											<TableCell><FormattedMessage id='target_lang' /></TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{
											dicts.map(dict => (
												<TableRow>
													<TableCell>{dict.learnedLanguage.name}</TableCell>
													<TableCell>{dict.targetLanguage.name}</TableCell>
													<TableCell>
														<Button variant='contained' onClick={() => deleteDictionary(dict.id)}>
															<Delete />
														</Button>
													</TableCell>
												</TableRow>
											))
										}
									</TableBody>
								</Table>
							) : (
								<Typography textAlign='center' paddingY={2}><FormattedMessage id='modal_dicts.no_dicts' /></Typography>
							)
						}

					</Stack>
				</Box>
			</Modal>
		</div >
	);
};

export default ModalEditDictionaries;