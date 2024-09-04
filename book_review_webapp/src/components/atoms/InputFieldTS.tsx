import React from 'react';
import { TextField } from '@mui/material';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const InputFieldTS: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  placeholder
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      variant="outlined"
      fullWidth
      margin="normal"
      type={type}
      placeholder={placeholder}
    />
  );
};

export default InputFieldTS;