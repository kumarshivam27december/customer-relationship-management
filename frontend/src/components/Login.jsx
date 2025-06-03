import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Sign-In when component mounts
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Load the Google API script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, []);

  const initializeGoogleSignIn = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignIn'),
        { 
          theme: 'outline', 
          size: 'large',
          width: 250,
          text: 'signin_with',
          shape: 'rectangular',
        }
      );
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      if (response.credential) {
        const success = await login(response.credential);
        if (success) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error handling Google Sign-In response:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Welcome to Mini CRM
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Please sign in to continue
          </Typography>
          <Box sx={{ mt: 3 }}>
            <div id="googleSignIn"></div>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 