import React from 'react';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-boundary-container">
      <div className="error-fallback-card">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="2" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="error-title">Oops! Something went wrong</h2>
        <p className="error-msg">
          We encountered an unexpected error while loading this page. 
          {error && <code style={{ display: 'block', margin: '1rem 0', padding: '0.5rem', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem' }}>{error.message}</code>}
        </p>
        <button className="btn btn-primary" onClick={resetErrorBoundary}>
          Return to Safety
        </button>
      </div>
    </div>
  );
};
