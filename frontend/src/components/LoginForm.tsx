import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8000/api/login', { email, password });

      if (response.data) {
        localStorage.setItem('access_token', response.data.access_token);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data;
        if (serverError?.message) {
          setError(serverError.message);
        } else if (err.response?.status === 401) {
          setError('Invalid credentials. Please try again.');
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('A network error occurred. Please check your connection.');
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please log in to your account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
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
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Login
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
          Don't have an account? <a href="/register">Register here</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
