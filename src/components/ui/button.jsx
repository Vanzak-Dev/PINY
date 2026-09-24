import React from 'react';

export function Button({ variant = 'default', size = 'default', className = '', style, children, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    default: '',
    ghost: 'bg-transparent hover:bg-slate-100',
  };
  const sizes = {
    default: 'px-4 py-2 rounded-lg',
    icon: 'w-10 h-10 rounded-lg',
  };
  return (
    <button
      className={`${base} ${variants[variant] || ''} ${sizes[size] || ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
