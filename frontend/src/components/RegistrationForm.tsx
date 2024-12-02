import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';

const useFormState = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return { name, setName, email, setEmail, username, setUsername, password, setPassword };
};

const handleRegistration = async (formData: any, setError: React.Dispatch<React.SetStateAction<string>>, setSuccess: React.Dispatch<React.SetStateAction<string>>) => {
  const { name, email, username, password } = formData;

  setError(''); 
  setSuccess(''); 
  try {
    const response = await axios.post('http://localhost:8000/api/register', {
      name,
      email,
      username,
      password,
      password_confirmation: password,
    });

    if (response.data) {
      localStorage.setItem('access_token', response.data.access_token);
      setSuccess('Registration successful! Redirecting...');
      console.log('User registered successfully:', response.data.user);

      setTimeout(() => {
        window.location.href = '/login'; // Redirect to dashboard
      }, 2000);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverError = err.response?.data;
      if (serverError?.message) {
        setError(serverError.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } else {
      setError('A network error occurred. Please check your connection.');
    }
  }
};

const RegistrationForm = () => {
  const { name, setName, email, setEmail, username, setUsername, password, setPassword } = useFormState();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name, email, username, password };
    handleRegistration(formData, setError, setSuccess);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ padding: 4, width: 400, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sign up to start managing your tasks
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
              Register
            </Button>
          </Box>
        </form>

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" mt={3}>
          Already have an account? <a href="/login">Log in here</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegistrationForm;
