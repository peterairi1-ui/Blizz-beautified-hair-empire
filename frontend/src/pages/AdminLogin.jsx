import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '../services/api';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem('bbhe-admin-token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const payload = await adminLogin(email, password);
      window.localStorage.setItem('bbhe-admin-token', payload.token);
      window.localStorage.setItem('bbhe-admin-user', JSON.stringify(payload.admin || {}));
      setMessage('Signed in successfully. Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 900);
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Admin login</p>
          <h2>Sign in to access the admin dashboard securely.</h2>
        </div>

        <div className="account-grid">
          <div className="info-card account-card">
            <div className="eyebrow">Administrator access</div>
            <h3>Manage inventory, orders, and appointment workflows from a secure dashboard.</h3>
          </div>

          <form className="form-card" onSubmit={handleLogin}>
            <input
              className="text-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
              required
            />

            <div className="password-field">
              <input
                className="text-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
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

            <div className="auth-footer admin-footer">
              <Link to="/admin/forgot">Forgot Password?</Link>
            </div>

            <button className="button button-primary full-width" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Enter dashboard'}
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

export default AdminLogin;
