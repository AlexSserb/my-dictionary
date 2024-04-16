import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Button, Alert,
	Grid, Stack, Paper,
} from '@mui/material';

import ModalChangePassword from '../modals/ModalChangePassword';
import AuthContext from '../context/AuthContext';

const SettingsPage = () => {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [successMessage, setSuccessMessage] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		if (!authTokens || !authTokens.access_token) {
			navigate("/login");
			return;
		}
	}, [authTokens])

	return (
		<Grid container sx={{
			spacing: 0,
			direction: "column",
			alignItems: "center",
			justifyContent: "center"
		}}>
			<Stack sx={{
				display: 'block',
				width: "40%",
				minWidth: "500px",
				spacing: 3
			}}>
				<Paper elevation={5} sx={{ padding: 3, marginTop: 3, justifyContent: 'left' }}>
					{successMessage && <Alert sx={{ marginBottom: 2 }} severity='success'>{successMessage}</Alert>}
					<ModalChangePassword setSettingsSuccessMessage={setSuccessMessage} />
					<Button onClick={() => logoutUser()} variant='contained'>
						Log out
					</Button>
				</Paper>
			</Stack>
		</Grid>
	)
}

export default SettingsPage;
