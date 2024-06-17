import { useState, useEffect, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Stack, Button, Alert, Box, Typography,
} from '@mui/material';

import AuthContext from '../context/AuthContext';
import { WordIdWithTranslationType, WordType, WordWithPointsType } from '../types/WordType';
import shuffleArray from '../utils/shuffleArray';
import translationsInLine from '../utils/translationsInLine';
import {
    stackContainerStyle,
    finishedButtonStyle,
    buttonStyle,
    clickedButtonStyle
} from './styles/StylesTrainingMatchingPage';


const TrainingMatchingPage = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { state } = useLocation();
    const DEFAULT_POINTS = 8;
    const MIN_POINTS = 2;
    const PAGE_SIZE = 7;
    const [message, setMessage] = useState('');

    const [words, setWords] = useState<WordWithPointsType[]>([]);
    const [passedWords, setPassedWords] = useState<WordWithPointsType[]>([]);
    const [wordsForPage, setWordsForPage] = useState<WordWithPointsType[]>([]);
    const [translations, setTranslations] = useState<WordIdWithTranslationType[]>([]);
    const [curWord, setCurWord] = useState<WordWithPointsType | null>();
    const [curTranslationId, setCurTranslationId] = useState<string | null>();
    const [passedCounter, setPassedCounter] = useState<number>(0);

    const { authTokens } = useContext(AuthContext);

    const fillPage = (wordsSource: WordWithPointsType[] = words) => {
        setPassedCounter(0);
        const wordsForCurPage: WordWithPointsType[] = [];
        for (let i = 0; i < PAGE_SIZE && wordsSource.length > 0; i++) {
            wordsForCurPage.push(wordsSource.pop()!);
        }
        setWordsForPage(wordsForCurPage);

        const tranlsations: WordIdWithTranslationType[] = wordsForCurPage.map((word: WordType) => {
            return {
                wordId: word.id,
                translations: translationsInLine(word.translations),
                isFinished: false
            };
        });
        setTranslations(shuffleArray<WordIdWithTranslationType>(tranlsations));
    };

    useEffect(() => {
        if (!authTokens || !authTokens.accessToken) {
            navigate("/login");
            return;
        }

        const wordsWithPoints = shuffleArray<WordWithPointsType>(state.words).map((word: WordType) => {
            return {
                ...word,
                points: DEFAULT_POINTS,
                isFinished: false
            };
        });

        setWords(wordsWithPoints);
        fillPage(wordsWithPoints);
    }, []);

    const handleCorrectAnswer = (wordId: string) => {
        const word = wordsForPage.find(word => word.id === wordId)!;
        const translation = translations.find(translation => translation.wordId === wordId)!;

        word.isFinished = true;
        translation.isFinished = true;

        setCurWord(null);
        setCurTranslationId(null);

        if (passedCounter >= wordsForPage.length - 1) {
            if (words.length === 0) {
                navigate('/train-results', { state: { passedWords: [...passedWords, word] } });
            }
            fillPage();
        }
        else {
            setPassedCounter(passedCounter + 1);
        }
        passedWords.push(word);
    };

    const decreaseWordPoints = (wordId: string) => {
        const word = wordsForPage.find(word => word.id === wordId);

        if (word && word?.points > MIN_POINTS) {
            word.points--;
        }
    };

    const handleIncorrectAnswer = (firstWordId: string, secondWordId: string) => {
        decreaseWordPoints(firstWordId);
        decreaseWordPoints(secondWordId);
    };

    const handleClickWord = (word: WordWithPointsType) => {
        if (word.isFinished) return;

        setMessage('');
        if (word.id === curWord?.id) {
            setCurWord(null);
        }
        else if (curTranslationId) {
            if (curTranslationId !== word.id) {
                setMessage(intl.formatMessage({ id: 'train_word_matching.incorrect_answer' }));
                handleIncorrectAnswer(word.id, curTranslationId);
            }
            else {
                handleCorrectAnswer(word.id);
            }
        }
        else {
            setCurWord(word);
        }
    };

    const handleClickTranslation = (translation: WordIdWithTranslationType) => {
        if (translation.isFinished) return;

        setMessage('');
        if (translation.wordId === curTranslationId) {
            setCurTranslationId(null);
        }
        else if (curWord) {
            if (curWord.id !== translation.wordId) {
                setMessage(intl.formatMessage({ id: 'train_word_matching.incorrect_answer' }));
                handleIncorrectAnswer(translation.wordId, curWord.id);
            }
            else {
                handleCorrectAnswer(translation.wordId);
            }
        }
        else {
            setCurTranslationId(translation.wordId);
        }
    };

    const getWordButtonStyle = (word: WordWithPointsType) => {
        if (word.isFinished) {
            return finishedButtonStyle;
        }
        else if (word.id === curWord?.id) {
            return clickedButtonStyle;
        }
        return buttonStyle;
    };

    const getTranslationButtonStyle = (translation: WordIdWithTranslationType) => {
        if (translation.isFinished) {
            return finishedButtonStyle;
        }
        else if (translation.wordId === curTranslationId) {
            return clickedButtonStyle;
        }
        return buttonStyle;
    };

    return (
        <Grid container sx={{ padding: 2, gap: 2, justifyContent: 'center' }}>
            <Stack sx={stackContainerStyle}>
                <Typography variant='h5' paddingBottom={2}>
                    <FormattedMessage id='train_word_by_translation.title' />
                </Typography>
                <Box textAlign='left' display='grid' gap={3} justifyContent='center'>
                    <Box display='flex' gap={3} justifyItems='center' alignItems='center'>
                        <Stack gap={2}>
                            {
                                wordsForPage.map((word: WordWithPointsType) => (
                                    <Button onClick={() => handleClickWord(word)}
                                        key={word.id} variant='contained' sx={getWordButtonStyle(word)}>
                                        {word.word}
                                    </Button>
                                ))
                            }
                        </Stack>
                        <Stack gap={2}>
                            {
                                translations.map((translation: WordIdWithTranslationType) => (
                                    <Button onClick={() => handleClickTranslation(translation)}
                                        key={translation.wordId} variant='contained'
                                        sx={getTranslationButtonStyle(translation)}>
                                        {translation.translations}
                                    </Button>
                                ))
                            }
                        </Stack>
                    </Box>

                    {message && (
                        <Alert severity='error'>
                            {message}
                        </Alert>
                    )}
                    <Button variant='contained' onClick={() => navigate('/train-results', { state: { passedWords: passedWords } })}>
                        <FormattedMessage id='train_word_by_translation.btn_finish_training' />
                    </Button>
                </Box>
            </Stack>
        </Grid>
    );
};

export default TrainingMatchingPage;