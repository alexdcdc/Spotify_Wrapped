import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // prepping data to send
    const data = {
      name,
      email,
      message,
    };

    try {
      const response = await fetch('http://localhost:8000/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // success
      setName('');
      setEmail('');
      setMessage('');
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      {submitStatus === 'success' && (
        <p className="success-message">
          Your message has been sent successfully!
        </p>
      )}
      {submitStatus === 'error' && (
        <p className="error-message">
          There was an error sending your message. Please try again.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Contact;
