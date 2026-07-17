function Checkout({ cart, currency, formatPrice, subtotal, clearCart }) {
  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Checkout</p>
          <h2>Complete your order.</h2>
        </div>
        <div className="checkout-grid">
          <div className="form-card">
            <h3>Delivery details</h3>
            <input className="text-input" placeholder="Full name" />
            <input className="text-input" placeholder="Phone number" />
            <input className="text-input" placeholder="Address" />
            <button className="button button-primary" onClick={clearCart}>Place order</button>
          </div>
          <div className="summary-card">
            <h3>Order summary</h3>
            {cart.map((item) => <p key={item.id}>{item.name} × {item.quantity}</p>)}
            <p>Subtotal: {formatPrice(subtotal, currency)}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Checkout;
