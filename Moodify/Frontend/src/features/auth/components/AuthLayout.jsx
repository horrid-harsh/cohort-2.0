import React from 'react'
import '../style/form.scss';

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{title}</h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#a1a1aa",
            fontSize: "14px",
            marginTop: "-25px",
          }}
        >
          {subtitle}
        </p>
        {children}
        {footer}
      </div>
    </div>
  )
}

export default AuthLayout