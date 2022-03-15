import { Stack, TextField, Button, Box } from '@mui/material';
import { useState } from 'react';
import { useAuthContext } from '../auth/AuthContextProvider';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '', passwordConfirm: '' });
  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previousState) => { return { ...previousState, [e.target.name]: e.target.value } });
  };

  const Auth = useAuthContext()!;

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password === formData.passwordConfirm) Auth.register(formData);
  }

  return (
    <Box>
      <form onSubmit={handleRegister}>
        <Stack direction='column' margin='auto' maxWidth='500px' spacing={2}>
          <TextField onChange={updateFormData} value={formData.username} name='username' label='Username' variant='outlined' />
          <TextField onChange={updateFormData} value={formData.password} name='password' type='password' label='Password' variant='outlined' />
          <TextField onChange={updateFormData} value={formData.passwordConfirm} name='passwordConfirm' type='password' label='Confirm Password' variant='outlined' />
          <Button type='submit'>register</Button>
        </Stack>
      </form>
    </Box>
  )
}