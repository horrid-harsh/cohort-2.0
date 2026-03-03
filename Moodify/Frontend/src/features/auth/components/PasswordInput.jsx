import React, { useState } from 'react'

const PasswordInput = ({ placeholder, label, ...rest }, ref) => {
      const [showPassword, setShowPassword] = useState(false);

  return (
   <div className="form-group">
          <label>{label}</label>
          <div className="password-input-wrapper">
            <input
            ref={ref}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              {...rest}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 15c0 0 4-8 10-8s10 8 10 8" />
                  <circle cx="12" cy="15" r="3" fill="currentColor" />
                  <line x1="12" y1="7" x2="12" y2="3" />
                  <line x1="7" y1="8" x2="5" y2="4" />
                  <line x1="17" y1="8" x2="19" y2="4" />
                  <line x1="3" y1="12" x2="1" y2="9" />
                  <line x1="21" y1="12" x2="23" y2="9" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 9c0 0 4 8 10 8s10-8 10-8" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <line x1="7" y1="16" x2="5" y2="20" />
                  <line x1="17" y1="16" x2="19" y2="20" />
                  <line x1="3" y1="12" x2="1" y2="15" />
                  <line x1="21" y1="12" x2="23" y2="15" />
                </svg>
              )}
            </button>
          </div>
        </div>
  )
}

export default PasswordInput