import {
    CircularProgress, Box, Typography
} from '@mui/material';

type WordCircularProgressProps = {
    progress: number;
}

const WordCircularProgress = ({ progress }: WordCircularProgressProps) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: 'height' }}>
            <CircularProgress variant="determinate" value={progress} color='info' thickness={5} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text"
                >
                    {progress}
                </Typography>
            </Box>
        </Box>
    );
}

export default WordCircularProgress;