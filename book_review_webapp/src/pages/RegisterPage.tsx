import React, { useState, ChangeEvent } from 'react';
import { RegisterRequest } from '../model/auth';
import { useRegister } from '../hooks/authHooks';
import '../css/RegisterPage.css'
import InputFieldTS from '../components/atoms/InputFieldTS';
import ButtonTS from '../components/atoms/ButtonTS';
import { Container, Box, Paper, Typography } from '@mui/material';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emptyError, setEmptyError] = useState('');

  const { registerHandler, errorMessage, loading } = useRegister();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length < 3 || value.length > 20) {
      setUsernameError('Username must be between 3 and 20 characters');
    } else {
      setUsernameError('');
    }
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 6 || value.length > 20) {
      setPasswordError('Password must be between 6 and 20 characters');
    } else {
      setPasswordError('');
    }
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const handleRegisterClick = () => {
    if (username.trim() === '' || password.trim() === '' || email.trim() === '') {
      setEmptyError('All fields are required');
      return;
    } else {
      setEmptyError('');
    }

    if (!usernameError && !passwordError && !emailError) {
      let registerData: RegisterRequest = {
        username: username,
        password: password,
        email: email,
      };
      registerHandler(registerData);
    }
  };

  return (
    <Container className="register-container" maxWidth="xs">
      <Box>
        <Paper className="register-paper">
          <Typography className="register-title" variant="h4" align="center" gutterBottom>
            Register
          </Typography>
          <InputFieldTS
            label="Username"
            name="username"
            value={username}
            error={usernameError}
            onChange={onChangeUsername}
          />
          <InputFieldTS
            label="Password"
            name="password"
            value={password}
            error={passwordError}
            onChange={onChangePassword}
            type="password"
          />
          <InputFieldTS
            label="Email"
            name="email"
            value={email}
            error={emailError}
            onChange={onChangeEmail}
            type="email"
          />
          {emptyError && (
            <Typography align='center' color="error" sx={{ mt: 2 }}>
              {emptyError}
            </Typography>
          )}
          {errorMessage && (
            <Typography align='center' color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <ButtonTS
            type="button"
            variant="contained"
            onClick={handleRegisterClick}
            fullWidth
            label='Register'
          >
            Register
          </ButtonTS>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;