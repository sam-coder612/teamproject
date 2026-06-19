import React, { useRef, useState } from 'react';

export const Contact = () => {
  // Uncontrolled Form Refs (Required by prompt)
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  // Status & Error States
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};

    // Retrieve uncontrolled input values from refs
    const nameVal = nameRef.current?.value.trim() || '';
    const emailVal = emailRef.current?.value.trim() || '';
    const messageVal = messageRef.current?.value.trim() || '';

    // Validations
    if (!nameVal) {
      formErrors.name = 'Full name is required';
    }
    
    if (!emailVal) {
      formErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      formErrors.email = 'Please enter a valid email address';
    }

    if (!messageVal) {
      formErrors.message = 'Message text cannot be empty';
    } else if (messageVal.length < 10) {
      formErrors.message = 'Message should be at least 10 characters long';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitted(false);
      return;
    }

    // Success state
    setErrors({});
    setIsSubmitted(true);

    // Reset uncontrolled fields
    if (nameRef.current) nameRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (messageRef.current) messageRef.current.value = '';
  };

  return (
    <div className="contact-page section page-enter">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">Get in touch with our travel planning experts. We are here to help you 24/7</p>

        <div className="contact-grid">
          {/* Uncontrolled Contact Form */}
          <div className="contact-form-panel">
            <h3 className="form-title" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '2rem' }}>Send Message</h3>
            
            {isSubmitted && (
              <div style={{ backgroundColor: 'var(--teal-light)', color: 'var(--teal-hover)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--teal)', marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your message has been sent successfully! Our experts will email you shortly.
              </div>
            )}

            <form className="planner-form" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  ref={nameRef}
                  placeholder="Enter your name"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  ref={emailRef}
                  placeholder="e.g. name@domain.com"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-msg">Your Message</label>
                <textarea
                  id="contact-msg"
                  ref={messageRef}
                  rows="5"
                  placeholder="Type your message here..."
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-light)',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', paddingInline: '2.5rem' }}>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details Panel */}
          <div className="contact-info-panel">
            {/* Phone Card */}
            <div className="contact-info-card">
              <div className="contact-info-icon-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="contact-info-content">
                <h4>Phone Number</h4>
                <p>+1 (555) 234-5678</p>
                <p>+91 98765 43210</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="contact-info-card">
              <div className="contact-info-icon-wrapper" style={{ backgroundColor: 'var(--teal-light)', color: 'var(--teal)' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="contact-info-content">
                <h4>Email Address</h4>
                <p>support@travelwise.com</p>
                <p>partners@travelwise.com</p>
              </div>
            </div>

            {/* Office Address Card */}
            <div className="contact-info-card">
              <div className="contact-info-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="contact-info-content">
                <h4>Office Headquarters</h4>
                <p>TravelWise Towers, Suite 400,</p>
                <p>Cyber City, Gurgaon, Haryana, 122002</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
