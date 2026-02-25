import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid reset link. No token provided.');
      return;
    }
    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reset-password/verify/${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => ({}));
        setTokenValid(data.valid === true);
        if (data.valid !== true) {
          setError(data.message || 'Invalid or expired reset link.');
        }
        setVerified(true);
      } catch (err) {
        setTokenValid(false);
        setError('Could not verify reset link.');
        setVerified(true);
      }
    };
    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Failed to reset password.');
        return;
      }
      setMessage('Password has been reset successfully. You can now log in.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!verified) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 mb-0">Verifying reset link…</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-3">
                  <h4 className="text-primary fw-bold">GUVI</h4>
                  <p className="text-muted small">Skill Up. Level Up.</p>
                </div>
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
                <a href="/forgot-password" className="btn btn-primary w-100">
                  Request a new reset link
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h5 className="card-title text-center mb-3">Reset Password</h5>
              <p className="text-muted small text-center mb-4">
                Enter your new password below.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    minLength={6}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    minLength={6}
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
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
