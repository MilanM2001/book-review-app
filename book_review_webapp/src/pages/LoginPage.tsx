import { ChangeEvent, useState } from 'react';
import { useLogin } from '../hooks/authHooks';
import { Alert, Button, Form, Input } from 'antd';
import Title from 'antd/es/typography/Title';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emptyError, setEmptyError] = useState("");

  const { loginHandler, errorMessage } = useLogin();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < 3 || value.length > 20) {
      setUsernameError("Username must be between 3 and 20 characters");
    } else {
      setUsernameError("");
    }

    setUsername(value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < 3 || value.length > 20) {
      setPasswordError("Password must be between 3 and 20 characters");
    } else {
      setPasswordError("");
    }

    setPassword(value);
  };

  const handleLoginClick = () => {
    if (username.trim() === "" || password.trim() === "") {
      setEmptyError("Fields cannot be empty");
      return;
    } else {
      setEmptyError("");
    }

    if (!usernameError && !passwordError) {
      loginHandler(username, password);
    }
  };

  return (
    <div className="login-container">
      <Title level={2}>Login</Title>
      <Form
        name="loginForm"
        layout="vertical"
        className="login-form"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            name="username"
            value={username}
            onChange={onChangeUsername}
            placeholder="Username"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            name="password"
            value={password}
            onChange={onChangePassword}
            placeholder="Password"
          />
        </Form.Item>

        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon className="login-error" />
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-button"
            onClick={handleLoginClick}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;