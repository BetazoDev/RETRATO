'use client';

import { useState } from 'react';

interface SubscribePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

export default function SubscribePopup({ isOpen, onClose }: SubscribePopupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
      } else if (res.status === 409) {
        setStatus('duplicate');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form after animation
    setTimeout(() => {
      setStatus('idle');
      setName('');
      setEmail('');
      setErrorMessage('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="subscribe-backdrop" onClick={handleClose} aria-hidden="true" />
      <div className="subscribe-modal" role="dialog" aria-modal="true" aria-label="Subscribe to RETRATO">
        <button
          className="subscribe-close"
          onClick={handleClose}
          aria-label="Close subscription form"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {status === 'success' ? (
          <div className="subscribe-success">
            <span className="subscribe-success-icon">✓</span>
            <h3 className="subscribe-success-title">Welcome to RETRATO</h3>
            <p className="subscribe-success-text">
              You&apos;ve been successfully subscribed. Stay tuned for our latest stories.
            </p>
            <button className="btn-primary" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="subscribe-header">
              <span className="subscribe-badge">Newsletter</span>
              <h3 className="subscribe-title">Subscribe to RETRATO</h3>
              <p className="subscribe-desc">
                Get the latest articles, visual essays, and photography stories delivered to your inbox.
              </p>
            </div>

            <form className="subscribe-form" onSubmit={handleSubmit}>
              <div className="subscribe-field">
                <label htmlFor="subscribe-name" className="subscribe-label">
                  Full Name
                </label>
                <input
                  id="subscribe-name"
                  type="text"
                  className="subscribe-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div className="subscribe-field">
                <label htmlFor="subscribe-email" className="subscribe-label">
                  Email Address
                </label>
                <input
                  id="subscribe-email"
                  type="email"
                  className="subscribe-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && (
                <p className="subscribe-error">{errorMessage}</p>
              )}

              {status === 'duplicate' && (
                <p className="subscribe-error">This email is already subscribed.</p>
              )}

              <button
                type="submit"
                className="btn-primary subscribe-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
