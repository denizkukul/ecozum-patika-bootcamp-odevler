import { Stack, TextField, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useAuthContext } from '../auth/AuthContextProvider';
export const Login: React.FC = () => {

  const [formData, setFormData] = useState({ username: '', password: '' });
  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previousState) => { return { ...previousState, [e.target.name]: e.target.value } });
  };

  const Auth = useAuthContext()!;

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Auth.login(formData);
  }

  return (
    <Box>
      <form onSubmit={handleLogin}>
        <Stack direction='column' margin='auto' maxWidth='500px' spacing={2}>
          <TextField onChange={updateFormData} value={formData.username} name='username' label='Username' variant='outlined'><Typography></Typography></TextField>
          <TextField onChange={updateFormData} value={formData.password} name='password' type='password' label='Password' variant='outlined' />
          <Button type='submit'>login</Button>
        </Stack>
      </form>
    </Box>
  )
}