// Wait until the DOM content is completely parsed
document.addEventListener("DOMContentLoaded", () => {
    let cartCount = 0;
    const cartBadge = document.getElementById('cart-counter');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Simple item counter logic for the basket setup
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            cartBadge.innerText = cartCount;
            
            // Visual feedback behavior
            button.innerText = "Added!";
            button.style.backgroundColor = "var(--button-hover)";
            
            // Revert back button state after a split second
            setTimeout(() => {
                button.innerText = "Add to Cart";
                button.style.backgroundColor = "var(--primary-button)";
            }, 800);
        });
    });
});