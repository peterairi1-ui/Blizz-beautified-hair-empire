import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import { customerLogin, customerRegister, customerForgotPassword, customerResetPassword, adminForgotPassword, adminResetPassword, getCustomerProfile } from './services/api';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ServicesPage from './pages/Services';
import GalleryPage from './pages/Gallery';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import AppointmentPage from './pages/Appointment';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import AuthPage from './pages/Auth';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import AccountPage from './pages/Account';
import AdminLoginPage from './pages/AdminLogin';
import AdminForgotPage from './pages/AdminForgot';
import AdminResetPage from './pages/AdminReset';
import AdminDashboardPage from './pages/Admin';
import NotFoundPage from './pages/NotFound';

const currencyOptions = [
  { key: 'NGN', label: '🇳🇬 NGN (₦)', symbol: '₦', rate: 1 },
  { key: 'USD', label: '🇺🇸 USD ($)', symbol: '$', rate: 1 / 1650 },
  { key: 'GBP', label: '🇬🇧 GBP (£)', symbol: '£', rate: 1 / 2100 },
  { key: 'EUR', label: '🇪🇺 EUR (€)', symbol: '€', rate: 1 / 1800 },
];

function App() {
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('bbhe-currency') || 'NGN';
    }
    return 'NGN';
  });
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return (JSON.parse(window.localStorage.getItem('bbhe-cart') || '[]')).map((item) => ({
          ...item,
          id: item.id || item._id || `${item.name || 'item'}-${Math.random().toString(36).slice(2, 8)}`,
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [showCart, setShowCart] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const [visitorCount] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const count = Number(window.localStorage.getItem('bbhe-visitor-count') || '0');
        const nextCount = Number.isFinite(count) ? count + 1 : 1;
        window.localStorage.setItem('bbhe-visitor-count', String(nextCount));
        return nextCount;
      } catch {
        return 1;
      }
    }
    return 1;
  });
  const [customer, setCustomer] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(window.localStorage.getItem('bbhe-customer') || 'null');
      } catch {
        return null;
      }
    }
    return null;
  });
  const [authToken, setAuthToken] = useState(() => window.localStorage.getItem('bbhe-customer-token') || '');
  const [customerReady, setCustomerReady] = useState(false);
  const [orders] = useState([
    { id: 'ORD-1042', status: 'Delivered', date: 'May 10', items: [{ name: 'Soft Glam Wig' }] },
    { id: 'ORD-1038', status: 'Processing', date: 'Apr 22', items: [{ name: 'Braided Crown Wig' }] },
  ]);
  const [addresses, setAddresses] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(window.localStorage.getItem('bbhe-addresses') || '[]');
      } catch {
        return [];
      }
    }
    return [];
  });
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(window.localStorage.getItem('bbhe-wishlist') || '[]');
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem('bbhe-currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setShowCurrencySelector((prev) => !prev);
  };

  useEffect(() => {
    if (!showCurrencySelector) return;

    const handleOutsideClick = (event) => {
      const target = event.target;

      if (target instanceof Element) {
        if (target.closest('.currency-pill') || target.closest('.currency-float')) {
          return;
        }
      }

      setShowCurrencySelector(false);
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showCurrencySelector]);

  useEffect(() => {
    window.localStorage.setItem('bbhe-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem('bbhe-addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    window.localStorage.setItem('bbhe-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event); 
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = window.navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|crios|fxios|opera|opr|edgios|edg).)*safari/i.test(ua);
    setIsIosSafari(Boolean(isIOS && isSafari));
  }, []);

  useEffect(() => {
    if (!authToken) return;
    getCustomerProfile(authToken).then((profile) => {
      if (profile?.user) {
        setCustomer(profile.user);
      }
      setCustomerReady(true);
    }).catch(() => {
      window.localStorage.removeItem('bbhe-customer-token');
      window.localStorage.removeItem('bbhe-customer');
      setAuthToken('');
      setCustomer(null);
      setCustomerReady(true);
    });
  }, [authToken]);

  const formatPrice = (price, currentCurrency) => {
    if (price == null) return 'Price on request';

    const selectedCurrency = currencyOptions.find((option) => option.key === currentCurrency) || currencyOptions[0];
    const converted = Number(price || 0) * (selectedCurrency?.rate || 1);
    return `${selectedCurrency.symbol}${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const addToCart = (product, quantity = 1) => {
    const productId = product.id || product._id;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...prev, { ...product, id: productId, quantity }];
    });
    setShowCart(true);
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => prev.flatMap((item) => {
      if (item.id !== id) return [item];
      const nextQuantity = item.quantity + delta;
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const persistCustomer = (nextCustomer, token) => {
    const safeCustomer = nextCustomer || null;
    window.localStorage.setItem('bbhe-customer', JSON.stringify(safeCustomer));
    window.localStorage.setItem('bbhe-customer-token', token || '');
    setCustomer(safeCustomer);
    setAuthToken(token || '');
    setCustomerReady(true);
  };

  const handleLogin = async (email, password) => {
    const payload = await customerLogin(email, password);
    persistCustomer(payload.user || payload, payload.token);
    return payload;
  };

  const handleRegister = async (name, email, password, phone, address) => {
    const payload = await customerRegister(name, email, password, phone, address);
    persistCustomer(payload.user || payload, payload.token);
    return payload;
  };

  const handleForgotPassword = async (email) => customerForgotPassword(email);
  const handleResetPassword = async (token, password) => customerResetPassword(token, password);
  const handleAdminForgotPassword = async (email) => adminForgotPassword(email);
  const handleAdminResetPassword = async (token, password) => adminResetPassword(token, password);

  const handleLogout = () => {
    window.localStorage.removeItem('bbhe-customer');
    window.localStorage.removeItem('bbhe-customer-token');
    setCustomer(null);
    setAuthToken('');
    setCustomerReady(true);
  };

  const handleUpdateProfile = async (profile) => {
    const nextCustomer = { ...(customer || {}), ...profile };
    persistCustomer(nextCustomer, authToken);
    return nextCustomer;
  };

  const handleAddAddress = async (address) => {
    const nextAddress = { ...address, id: `${address.city}-${Date.now()}` };
    setAddresses((prev) => [...prev, nextAddress]);
    return nextAddress;
  };

  const handleRemoveWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const installReady = Boolean(installPrompt) || isIosSafari;

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallPrompt(null);
      }
      return;
    }

    if (isIosSafari) {
      toast('On iPhone: tap Share, then Add to Home Screen', { duration: 8000 });
    }
  };

  const AppShell = () => (
    <div className="app-shell">
      <Toaster position="top-right" />
      <div className="announcement-bar" aria-label="Promotional marquee">
        <div className="announcement-track">
          <span>Luxury Braided Wigs</span><span className="separator">•</span>
          <span>Handmade with Love</span><span className="separator">•</span>
          <span>Natural Hairline</span><span className="separator">•</span>
          <span>Custom Colours & Styles</span><span className="separator">•</span>
          <span>Affordable Prices</span><span className="separator">•</span>
          <span>Nationwide Delivery</span><span className="separator">•</span>
          <span>Confidence Starts Here</span>
        </div>
      </div>

      <Routes>
        <Route element={<Layout cartCount={cartCount} onToggleCurrency={toggleCurrency} currency={currency} onToggleCart={() => setShowCart((prev) => !prev)} onInstall={handleInstall} installReady={installReady} isIosSafari={isIosSafari} />}>
          <Route path="/" element={<Home currency={currency} formatPrice={formatPrice} addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop currency={currency} formatPrice={formatPrice} addToCart={addToCart} />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/cart" element={<CartPage cart={cart} currency={currency} formatPrice={formatPrice} updateQuantity={updateQuantity} removeFromCart={removeFromCart} subtotal={subtotal} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} currency={currency} formatPrice={formatPrice} subtotal={subtotal} clearCart={clearCart} />} />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} onRegister={handleRegister} />} />
          <Route path="/auth/forgot" element={<ForgotPasswordPage onForgot={handleForgotPassword} />} />
          <Route path="/auth/reset/:token" element={<ResetPasswordPage onReset={handleResetPassword} />} />
          <Route path="/account" element={<AccountPage customer={customer} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} orders={orders} addresses={addresses} wishlist={wishlist} onAddAddress={handleAddAddress} onRemoveWishlist={handleRemoveWishlist} />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/forgot" element={<AdminForgotPage />} />
          <Route path="/admin/reset/:token" element={<AdminResetPage onReset={handleAdminResetPassword} />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>

      <aside className={`cart-panel ${showCart ? 'open' : ''}`}>
        <div className="cart-panel-header">
          <h3>Your cart</h3>
          <button onClick={() => setShowCart(false)}>Close</button>
        </div>
        {cart.length === 0 ? <p className="empty-state">Your cart is empty.</p> : cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <p>{formatPrice(item.price, currency)}</p>
            </div>
            <div className="cart-item-actions">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
          </div>
        ))}
        {cart.length > 0 && <a className="button button-primary full-width" href="/checkout" onClick={() => setShowCart(false)}>Checkout</a>}
      </aside>

      <div className={`currency-float ${showCurrencySelector ? 'open' : ''}`} onClick={(event) => event.stopPropagation()}>
        <p>Currency</p>
        {currencyOptions.map((option) => (
          <button
            key={option.key}
            className={currency === option.key ? 'active' : ''}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setCurrency(option.key);
              setShowCurrencySelector(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <a href="https://wa.me/2348082153972" className="whatsapp-float" target="_blank" rel="noreferrer">
        <FaWhatsapp size={24} />
      </a>
    </div>
  );

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
