function Cart({ cart, currency, formatPrice, updateQuantity, removeFromCart, subtotal }) {
  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Shopping cart</p>
          <h2>Your selected pieces.</h2>
        </div>
        {cart.length === 0 ? <p className="empty-state">Your cart is empty.</p> : (
          <div className="cart-page">
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price, currency)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <button className="link-button" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="summary-card">
              <h3>Order summary</h3>
              <p>Subtotal: {formatPrice(subtotal, currency)}</p>
              <a className="button button-primary full-width" href="/checkout">Proceed to checkout</a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;
