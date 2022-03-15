import { Box } from '@mui/material'
const style = {
  position: 'absolute',
  top: '50px',
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: 700,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 50,
  maxHeight: '60vh',
  overflow: 'scroll'
}

export const Modal: React.FC = ({ children }) => {
  return (
    <Box sx={{ position: 'absolute', inset: '0', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <Box sx={style}>
        {children}
      </Box>
    </Box>
  )
}