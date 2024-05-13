import { useState } from 'react';
import {
	Button, Typography, Modal,
	Stack, Box, TextField, Alert
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import authService from '../services/AuthService';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 550,
	bgcolor: 'secondary.main',
	borderRadius: '8px',
	boxShadow: 24,
	p: 4,
};

interface ModalChangePasswordProps {
	setSettingsSuccessMessage: React.Dispatch<React.SetStateAction<string>>
}

const ModalChangePassword = ({ setSettingsSuccessMessage }: ModalChangePasswordProps) => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatNewPassword, setRepeatNewPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = () => {
		setMessage('');
		if (newPassword !== repeatNewPassword) {
    		setMessage('Passwords don\'t match.');
    		return;
    	}

		if (newPassword.length < 8) {
			setMessage('Password must be at least 8 characters.');
			return;
		}

		authService.changePassword(oldPassword, newPassword)
			.then(res => {
				setSettingsSuccessMessage(res.data?.message);
				handleClose();
			})
			.catch(err => {
				if (err?.response?.status === 400) {
					setMessage(err.response.data?.message);
				}
				else {
					setMessage('Password changing error.')
				}
			});
	}

	return (
		<div>
			<Button variant='contained' sx={{ marginBottom: 1 }} onClick={handleOpen}>
				<FormattedMessage id='change_password_btn' />
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
			>
				<Box sx={style}>
					<Typography variant='h5' component='h5' sx={{
						textAlign: 'center',
						marginBottom: 3
					}}>
						<FormattedMessage id='password_change_header' />
					</Typography>

					<Stack spacing={1}>
						<TextField
							type='password'
							label='Old password'
							value={oldPassword}
							onChange={event => setOldPassword(event.target.value)}
							color='info'
						/>
						<TextField
							type='password'
							label='New password'
							value={newPassword}
							onChange={event => setNewPassword(event.target.value)}
							inputProps={{ maxLength: 20 }}
							color='info'
						/>
						<TextField
							type='password'
							label='Repeat new password'
							value={repeatNewPassword}
							onChange={event => setRepeatNewPassword(event.target.value)}
							inputProps={{ maxLength: 20 }}
							color='info'
						/>
						{message && <Alert sx={{ marginBottom: 2 }} severity='error'>{message}</Alert>}
						<Button variant='contained' onClick={handleSubmit}>
							<FormattedMessage id='submit_change_password_btn' />
						</Button>
					</Stack>
				</Box>
			</Modal>
		</div >
	);
}

export default ModalChangePassword;