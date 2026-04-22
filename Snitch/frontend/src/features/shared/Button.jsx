import React from 'react';
import styles from './Button.module.scss';

const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  fullWidth = false, 
  className = '', 
  disabled = false,
  type = 'button',
  as: Component = 'button',
  ...props 
}) => {
  const buttonClasses = [
    styles.btn,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className
  ].join(' ').trim();

  // If rendering as a link, we shouldn't pass 'type' or 'disabled'
  const isLink = Component === 'a' || typeof Component !== 'string';
  const finalProps = isLink 
    ? { ...props } 
    : { type, disabled: disabled || isLoading, ...props };

  return (
    <Component 
      className={buttonClasses}
      {...finalProps}
    >
      {isLoading && <span className={styles.loader} aria-hidden="true" />}
      <span className={styles.content}>{children}</span>
    </Component>
  );
};

export default Button;
