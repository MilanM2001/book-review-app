import { ChangeEvent, useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { useLogin } from '../hooks/authHooks';
import { LoginRequest } from '../model/auth';
import InputFieldTS from '../components/atoms/InputFieldTS';
import ButtonTS from '../components/atoms/ButtonTS';
import '../css/LoginPage.css'

const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [emptyError, setEmptyError] = useState<string>('');

  const { loginHandler, errorMessage } = useLogin();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < 3 || value.length > 20) {
      setUsernameError('Username must be between 3 and 20 characters');
    } else {
      setUsernameError('');
    }
    setUsername(value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < 3 || value.length > 20) {
      setPasswordError('Password must be between 3 and 20 characters');
    } else {
      setPasswordError('');
    }
    setPassword(value);
  };

  const handleLoginClick = () => {
    if (username.trim() === '' || password.trim() === '') {
      setEmptyError('Fields cannot be empty');
      return;
    }
    setEmptyError('');

    if (!usernameError && !passwordError) {
      const loginData: LoginRequest = { username, password };
      loginHandler(loginData);
    }
  };

  return (
    <Container className="login-container" maxWidth="xs">
      <Box>
        <Paper className="login-paper">
          <Typography className="login-title" variant="h4" align="center" gutterBottom>
            Login
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
            onClick={handleLoginClick}
            fullWidth
            label='Login' disabled={false}         >
            Login
          </ButtonTS>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;