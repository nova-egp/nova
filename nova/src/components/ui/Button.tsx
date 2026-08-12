import React from 'react';

type Variant = 'primary' | 'secondary' | 'gold';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
};

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return <button className={`${VARIANT_CLASS[variant]} ${className}`} {...rest} />;
}
