// src/components/Support.jsx

import React, { useState } from 'react';

const Support = () => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage('');
  };

  return (
    <div className="support">
      <h2>Contact Support</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue here..."
          />
          <button type="submit">Send</button>
        </form>
      ) : (
        <p>Thank you! Your message has been sent.</p>
      )}
    </div>
  );
};

export default Support;
