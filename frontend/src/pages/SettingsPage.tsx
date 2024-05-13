import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Button, Alert, Select, MenuItem,
	Grid, Paper, Box,
	Typography, SelectChangeEvent
} from '@mui/material';

import ModalChangePassword from '../modals/ModalChangePassword';
import AuthContext from '../context/AuthContext';
import { messages } from '../i18n/messages';
import { FormattedMessage } from 'react-intl';

interface SettingsProps {
	currentLocale: string;
	handleLangChange: (e: SelectChangeEvent<string>) => void;
}

const SettingsPage = ({ currentLocale, handleLangChange }: SettingsProps) => {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [successMessage, setSuccessMessage] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		if (!authTokens || !authTokens.accessToken) {
			navigate('/login');
			return;
		}
	}, [authTokens])

	return (
		<Grid container sx={{
			direction: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		}}>
			<Paper sx={{
				padding: 4, marginTop: 3, width: '40%',
				minWidth: '500px', backgroundColor: 'secondary.main'
			}}>
				<Typography textAlign={'center'} variant='h5' component='h5' sx={{ paddingY: 1 }}>
					<FormattedMessage id='settings' />
				</Typography>

				{successMessage && <Alert sx={{ marginBottom: 2 }} severity='success'>{successMessage}</Alert>}

				<Box sx={{ marginY: 2 }}>
					<Typography><FormattedMessage id='language_choice_header' /></Typography>
					<Select onChange={handleLangChange} value={currentLocale}
						MenuProps={{ PaperProps: { sx: { bgcolor: 'info.dark' } } }}>
						{Object.keys(messages).map(code => (
							<MenuItem key={code} value={code}>
								{messages[code].name}
							</MenuItem>
						))}
					</Select>
				</Box>

				<ModalChangePassword setSettingsSuccessMessage={setSuccessMessage} />

				<Button onClick={() => logoutUser()} variant='contained'>
					<FormattedMessage id='logout_btn' />
				</Button>
			</Paper>
		</Grid>
	)
}

export default SettingsPage;
