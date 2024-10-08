import React from 'react';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary';
    label: string
    fullWidth?: boolean;
    disabled: boolean
    children: React.ReactNode;
}

const ButtonTS: React.FC<ButtonProps> = ({
    onClick,
    type = 'button',
    variant = 'contained',
    color = 'primary',
    fullWidth = false,
    disabled,
    children
}) => {
    return (
        <MuiButton
            type={type}
            variant={variant}
            color={color}
            fullWidth={fullWidth}
            onClick={onClick}
            sx={{ mt: 2 }}
            disabled={disabled}
        >
            {children}
        </MuiButton>
    );
};

export default ButtonTS;