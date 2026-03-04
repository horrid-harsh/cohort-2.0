import React from "react";

const SubmitButton = ({ label, loading, loadingLabel, ...rest }) => {
  return (
    <button type="submit" className="submit-btn" disabled={loading} {...rest}>
      {loading ? loadingLabel || `${label}...` : label}
    </button>
  );
};

export default SubmitButton;
