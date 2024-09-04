import React from 'react';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary';
    label: string
    fullWidth?: boolean;
    children: React.ReactNode;
}

const ButtonTS: React.FC<ButtonProps> = ({
    onClick,
    type = 'button',
    variant = 'contained',
    color = 'primary',
    fullWidth = false,
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
        >
            {children}
        </MuiButton>
    );
};

export default ButtonTS;