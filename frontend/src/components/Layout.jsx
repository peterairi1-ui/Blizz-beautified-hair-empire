import { NavLink, Outlet } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/images/logo/logo.jpeg';

function Layout({ cartCount, onToggleCurrency, currency, onToggleCart, onInstall, installReady, isIosSafari }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleInstallClick = () => {
    closeMenu();
    onInstall?.();
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Login / Sign Up', path: '/auth' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    {
      label: 'Install App',
      action: handleInstallClick,
      disabled: !installReady,
      note: isIosSafari ? 'On iPhone: tap Share, then Add to Home Screen' : '',
    },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="topbar">
        <NavLink className="brand" to="/">
          <img src={logo} alt="Blizz Beautified Hair Empire logo" />
          <span>Blizz Beautified Hair Empire</span>
        </NavLink>

        <div className="topbar-actions">
          <a className="icon-button" aria-label="Search" href="/shop"><Search size={18} /></a>
          <button className="icon-button" aria-label="Cart" onClick={onToggleCart}><ShoppingCart size={18} /></button>
          <a className="icon-button" aria-label="Hair services" href="/services"><Sparkles size={18} /></a>
          <button className="currency-pill" type="button" onClick={(event) => { event.stopPropagation(); onToggleCurrency?.(event); }}>{currency}</button>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className="hamburger-menu" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <>
            <div className="menu-overlay" onClick={closeMenu}></div>
            <nav className="dropdown-menu">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.label}>
                    {item.action ? (
                      <button
                        type="button"
                        className={`menu-item${item.disabled ? ' disabled' : ''}`}
                        onClick={item.action}
                        disabled={item.disabled}
                      >
                        <span>{item.label}</span>
                        {item.note && <small className="menu-note">{item.note}</small>}
                      </button>
                    ) : (
                      <NavLink 
                        to={item.path} 
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </header>

      <Outlet />

      <footer className="footer-shell">
        <div className="footer-brand">
          <div className="brand footer-brand-title">
            <img src={logo} alt="Blizz Beautified Hair Empire logo" />
            <span>Blizz Beautified Hair Empire</span>
          </div>
          <p>Luxury hair and beauty experiences tailored for confidence, comfort, and timeless style.</p>
          <div className="footer-socials">
            <a href="https://wa.me/2348082153972">WhatsApp</a>
            <a href="/contact">Contact</a>
            <a href="/gallery">Gallery</a>
          </div>
        </div>
        <div className="footer-grid">
          <div>
            <h4>Explore</h4>
            <a href="/shop">Shop</a>
            <a href="/services">Services</a>
            <a href="/appointment">Book appointment</a>
          </div>
          <div>
            <h4>Visit</h4>
            <a href="/about">About us</a>
            <a href="/contact">Get in touch</a>
            <a href="/gallery">Inspiration</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="/cart">Cart</a>
            <a href="/checkout">Checkout</a>
            <a href="#top">Back to top</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Layout;
