document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const totalAmountDisplay = document.getElementById('total-amount-display');
    const vatPercentageInput = document.getElementById('vat-percentage');
    const calculateVatBtn = document.getElementById('calculate-vat-btn');
    const finalTotalDisplay = document.getElementById('final-total-display');
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');

    let currentTotalAmount = 0;
    let productInCart = null;

    function displayCartItems() {
        const productDataString = localStorage.getItem('marxiaCartProduct');
        if (!productDataString) {
            emptyCartMessage.style.display = 'block';
            totalAmountDisplay.textContent = '$0.00';
            finalTotalDisplay.textContent = '$0.00';
            // Disable VAT and checkout if cart is empty
            vatPercentageInput.disabled = true;
            calculateVatBtn.disabled = true;
            proceedToCheckoutBtn.disabled = true;
            return;
        }

        emptyCartMessage.style.display = 'none';
        vatPercentageInput.disabled = false;
        calculateVatBtn.disabled = false;
        proceedToCheckoutBtn.disabled = false;

        productInCart = JSON.parse(productDataString);

        // Clear previous items if any (though for now it's just one item)
        cartItemsContainer.innerHTML = '';

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item'); // For potential future styling
        itemElement.innerHTML = `
            <h4>${productInCart.name}</h4>
            <p>Asset ID: ${productInCart.assetId}</p>
            <p>Price: $${productInCart.price.toFixed(2)}</p>
            <p>Quantity: ${productInCart.quantity}</p>
            <p>Description: ${productInCart.description || 'N/A'}</p>
            <p><strong>Item Subtotal: $${productInCart.subtotal.toFixed(2)}</strong></p>
        `;
        cartItemsContainer.appendChild(itemElement);

        currentTotalAmount = productInCart.subtotal;
        totalAmountDisplay.textContent = `$${currentTotalAmount.toFixed(2)}`;
        // Initially, final total is the same as total amount before VAT
        finalTotalDisplay.textContent = `$${currentTotalAmount.toFixed(2)}`;
    }

    calculateVatBtn.addEventListener('click', () => {
        if (!productInCart) return; // No item in cart

        const vatPercent = parseFloat(vatPercentageInput.value);
        if (isNaN(vatPercent) || vatPercent < 0) {
            alert('Please enter a valid, non-negative VAT percentage.');
            finalTotalDisplay.textContent = `$${currentTotalAmount.toFixed(2)}`; // Reset to total without VAT
            return;
        }

        const vatAmount = currentTotalAmount * (vatPercent / 100);
        const finalTotal = currentTotalAmount + vatAmount;
        finalTotalDisplay.textContent = `$${finalTotal.toFixed(2)}`;
    });

    proceedToCheckoutBtn.addEventListener('click', () => {
        if (!productInCart) {
            alert('Your cart is empty.');
            return;
        }

        const finalTotalValue = parseFloat(finalTotalDisplay.textContent.substring(1)); // Remove '$'
        const vatPercent = parseFloat(vatPercentageInput.value) || 0;

        const checkoutData = {
            product: productInCart,
            totalAmount: currentTotalAmount,
            vatPercentage: vatPercent,
            finalTotal: finalTotalValue,
            timestamp: new Date().toISOString()
        };

        console.log('Proceeding to Checkout with:', checkoutData);
        alert('Checkout data logged to console. Actual Netlify integration is a future step.');
        // Here you would typically send `checkoutData` to a backend or Netlify function
    });

    // Initial load
    displayCartItems();
});
