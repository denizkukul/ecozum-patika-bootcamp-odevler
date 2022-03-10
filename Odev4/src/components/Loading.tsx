import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Loading: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
      <CircularProgress />
    </Box>
  );
}