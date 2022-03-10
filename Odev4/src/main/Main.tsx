import { CategoriesPage } from './CategoriesPage';
import { TodosPage } from './TodosPage';
import { Box, Tabs, Tab, Button } from '@mui/material'
import { TabPanel } from '../components';
import { StateProvider } from '../state-manager/stateProvider';
import { useState } from 'react';
import { useAuthContext } from '../auth/AuthContextProvider';

export const Main: React.FC = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => { setValue(newValue) };
  const Auth = useAuthContext()!;
  return (
    <>
      {
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} centered sx={{ maxWidth: '1000px', margin: 'auto' }}>
              <Tab label='todolist' />
              <Tab label='categories' />
              <Box sx={{ marginLeft: 'auto' }}>
                <Button sx={{ height: '100%', borderRadius: '0px', padding: '12px 16px' }} onClick={Auth.logout}>Logout</Button>
              </Box>
            </Tabs>
          </Box>
          <StateProvider>
            <TabPanel value={value} index={0}>
              <Box sx={{ maxWidth: '1000px', margin: 'auto', boxSizing: 'border-box' }}>
                <TodosPage />
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box sx={{ maxWidth: '1000px', margin: 'auto', boxSizing: 'border-box' }}>
                <CategoriesPage />
              </Box>
            </TabPanel>
          </StateProvider>
        </Box>
      }
    </>
  )
}