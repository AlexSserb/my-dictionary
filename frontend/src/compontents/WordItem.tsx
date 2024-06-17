import {
    Stack, Paper, Typography, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import WordCircularProgress from './WordCircularProgress';
import { WordType } from '../types/WordType';
import translationsInLine from '../utils/translationsInLine';

type WordItemProps = {
    word: WordType;
    handleEditButtonClick: (id: string) => void;
    handleDeleteButtonClick: (id: string) => void;
};

const WordItem = ({ word, handleEditButtonClick, handleDeleteButtonClick }: WordItemProps) => {
    return (
        <Paper sx={{
            bgcolor: 'primary.main',
            textAlign: 'left',
            paddingY: 2,
            paddingX: 3
        }}>
            <Stack justifyContent='space-between' direction='row'>
                <Stack>
                    <Typography variant='h6'>
                        {word.word}
                    </Typography>
                    <Typography variant='body1' sx={{ paddingLeft: 2, paddingTop: 1 }}>
                        {translationsInLine(word.translations)}
                    </Typography>
                </Stack>
                <Stack direction='row' gap={2}>
                    <WordCircularProgress progress={word.progress} />
                    <Stack gap={2}>
                        <Button variant='contained' onClick={() => handleEditButtonClick(word.id)}>
                            <EditIcon />
                        </Button>
                        <Button variant='contained' onClick={() => handleDeleteButtonClick(word.id)}>
                            <DeleteIcon />
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default WordItem;
