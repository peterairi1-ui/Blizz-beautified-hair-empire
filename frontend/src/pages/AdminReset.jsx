import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { adminResetPassword } from '../services/api';

function AdminReset() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await adminResetPassword(token, password);
      setMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/admin/login'), 1400);
    } catch (submitError) {
      setError(submitError.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Reset admin password</p>
          <h2>Create a new password for your administrator account.</h2>
        </div>

        <div className="account-grid">
          <div className="info-card account-card">
            <div className="eyebrow"><Sparkles size={16} /> Secure reset</div>
            <h3>Set a new password for the admin dashboard using your secure link.</h3>
          </div>

          <form className="form-card" onSubmit={handleSubmit}>
            <div className="password-field">
              <input
                className="text-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="password-field">
              <input
                className="text-input"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((prev) => !prev)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="button button-primary full-width" type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
              <ArrowRight size={16} />
            </button>
            {message && <p className="success-text auth-status">{message}</p>}
            {error && <p className="error-text auth-status">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}

export default AdminReset;
