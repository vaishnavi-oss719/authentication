import { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 404) {
          setError('User not found with this email address.');
        } else {
          setError(data.message || 'Something went wrong. Please try again.');
        }
        return;
      }
      setMessage(
        data.message || 'If an account exists with this email, a password reset link has been sent.'
      );
      setEmail('');
    } catch (err) {
      setError('Network error. Please check the server and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h4 className="text-primary fw-bold">GUVI</h4>
                <p className="text-muted small mb-0">Skill Up. Level Up.</p>
              </div>
              <h5 className="card-title text-center mb-3">Forgot Password</h5>
              <p className="text-muted small text-center mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                {error && (
                  <div className="alert alert-danger py-2 small" role="alert">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="alert alert-success py-2 small" role="alert">
                    {message}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
