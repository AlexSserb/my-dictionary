import { useEffect, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	Grid, Stack, Button,
	Box, Typography,
	Table, TableHead, TableBody, TableCell, TableRow
} from '@mui/material';

import AuthContext from '../context/AuthContext';
import { WordTrainResultType, WordWithPointsType } from '../types/WordType';
import wordService from '../services/WordService';
import { stackContainerStyle } from './styles/StylesTrainResultsPage';


const TrainResultsPage = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const passedWords: WordWithPointsType[] = state.passedWords;

	const { authTokens } = useContext(AuthContext);

	useEffect(() => {
		if (!authTokens || !authTokens.accessToken) {
			navigate("/login");
			return;
		}

		const results: WordTrainResultType[] = passedWords.map(word => Object({ word_id: word.id, points: word.points }));
		wordService.applyTrainingResults(results)
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}, []);

	return (
		<Grid container sx={{ padding: 2, gap: 2, justifyContent: 'center' }}>
			<Stack sx={stackContainerStyle}>
				<Typography variant='h5' paddingBottom={2}>
					<FormattedMessage id='train_results.title' />
				</Typography>
				<Box textAlign='left' display='grid' gap={3}>
					<Box>
						<Typography color='info' variant='h6'>
							<FormattedMessage id='train_results.list_title' />
						</Typography>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>
										<FormattedMessage id='train_results.table_header_word' />
									</TableCell>
									<TableCell>
										<FormattedMessage id='train_results.table_header_points' />
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{passedWords.map(item => (
									<TableRow>
										<TableCell>
											{item.word}
										</TableCell>
										<TableCell>
											{item.points}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
					<Button variant='contained' onClick={() => navigate('/')} sx={{}}>
						<FormattedMessage id='train_results.btn_submit' />
					</Button>
				</Box>
			</Stack>
		</Grid>
	);
};

export default TrainResultsPage;
