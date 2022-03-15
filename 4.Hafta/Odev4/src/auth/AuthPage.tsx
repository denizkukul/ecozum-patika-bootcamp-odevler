import { Box, Tab, Tabs } from '@mui/material';
import { useAuthContext } from './AuthContextProvider';
import { Login, Register, Loading, TabPanel } from '../components';
import { useState } from 'react';

export const AuthPage: React.FC = () => {
  const Auth = useAuthContext()!;
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => { setValue(newValue) };

  return (
    <>
      {
        Auth.loading ?
          <Loading /> :
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 6 }}>
              <Tabs value={value} onChange={handleChange} centered>
                <Tab label='login' />
                <Tab label='register' />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Login />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Register />
            </TabPanel>
          </Box>
      }
    </>
  )
}