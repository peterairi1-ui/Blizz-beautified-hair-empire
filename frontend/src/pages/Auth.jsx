import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

function Auth({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await onRegister(form.name, form.email, form.password, form.phone, form.address);
        setMessage('Your account has been created. Redirecting to your dashboard...');
        setTimeout(() => navigate('/account'), 1200);
      } else {
        await onLogin(form.email, form.password);
        setMessage('Signed in successfully. Redirecting...');
        setTimeout(() => navigate('/account'), 900);
      }
      setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '' });
    } catch (submitError) {
      setError(submitError.message || 'Unable to continue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Customer login</p>
          <h3>{mode === 'register' ? 'Create your account' : 'Sign in to continue'}</h3>
        </div>

        <div className="account-grid">
          <div className="info-card account-card">
            <div className="eyebrow"><Sparkles size={16} /> Secure access</div>
            <h3>{mode === 'register' ? 'Register for exclusive updates, styling tips, and order tracking.' : 'Access your saved favorites, appointments, and past orders.'}</h3>
            <div className="account-highlights">
              <div><Sparkles size={16} /> Fast checkout</div>
              <div><Sparkles size={16} /> Secure profile</div>
              <div><Sparkles size={16} /> Order history</div>
            </div>
          </div>

          <form className="form-card" onSubmit={handleSubmit}>
            <div className="auth-toggle">
              <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Sign in</button>
              <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create account</button>
            </div>

            {mode === 'register' && (
              <input
                className="text-input"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Full name"
                required
              />
            )}

            <input
              className="text-input"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email address"
              required
            />

            <div className="password-field">
              <input
                className="text-input"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
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

            {mode === 'register' && (
              <div className="password-field">
                <input
                  className="text-input"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  placeholder="Confirm password"
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
            )}

            {mode === 'register' && (
              <>
                <input
                  className="text-input"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="Phone number"
                />
                <input
                  className="text-input"
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                  placeholder="Address"
                />
              </>
            )}

            <div className="auth-footer">
              {mode === 'login' ? (
                <Link to="/auth/forgot">Forgot Password?</Link>
              ) : (
                <Link to="/auth/forgot">Need help with your password?</Link>
              )}
            </div>

            <button className="button button-primary full-width" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : `${mode === 'register' ? 'Create account' : 'Sign in'}`}
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

export default Auth;
