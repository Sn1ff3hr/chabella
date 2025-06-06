document.addEventListener('DOMContentLoaded', () => {
    const productNameInput = document.getElementById('product-name');
    const assetIdInput = document.getElementById('asset-id');
    const productPriceInput = document.getElementById('product-price');
    const quantityDisplay = document.getElementById('quantity-display');
    const subtotalDisplay = document.getElementById('subtotal-display');
    const removeItemBtn = document.getElementById('remove-item');
    const addItemBtn = document.getElementById('add-item');
    const productForm = document.getElementById('product-form');
    const productDescriptionInput = document.getElementById('product-description');

    let currentQuantity = 1;
    let currentPrice = parseFloat(productPriceInput.value) || 0;

    function updateSubtotal() {
        const subtotal = currentQuantity * currentPrice;
        subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    }

    function updateQuantityDisplay() {
        quantityDisplay.textContent = currentQuantity;
    }

    // Initialize
    updateQuantityDisplay();
    updateSubtotal();

    productPriceInput.addEventListener('change', (event) => {
        currentPrice = parseFloat(event.target.value) || 0;
        if (currentPrice < 0) {
            currentPrice = 0;
            productPriceInput.value = "0.00";
        }
        updateSubtotal();
    });

    productPriceInput.addEventListener('input', (event) => { // Handles cases where user types
        currentPrice = parseFloat(event.target.value) || 0;
        // No negative check here during input to allow typing '-', but change will fix it
        updateSubtotal();
    });


    addItemBtn.addEventListener('click', () => {
        currentQuantity++;
        updateQuantityDisplay();
        updateSubtotal();
    });

    removeItemBtn.addEventListener('click', () => {
        if (currentQuantity > 1) { // Prevent quantity from going below 1
            currentQuantity--;
            updateQuantityDisplay();
            updateSubtotal();
        }
    });

    productForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission

        const productDetails = {
            name: productNameInput.value,
            assetId: assetIdInput.value,
            price: currentPrice,
            quantity: currentQuantity,
            description: productDescriptionInput.value,
            subtotal: currentQuantity * currentPrice
        };

        // Basic validation
        if (!productDetails.name || !productDetails.assetId || productDetails.price <= 0) {
            alert('Please fill in all required product details and ensure price is positive.');
            return;
        }

        try {
            // For now, we'll store a single product.
            // A real cart would handle multiple different products.
            localStorage.setItem('marxiaCartProduct', JSON.stringify(productDetails));
            window.location.href = 'cart.html'; // Redirect to cart page
        } catch (e) {
            console.error("Error saving to localStorage", e);
            alert("There was an error adding the item to your cart. Please try again.");
        }
    });
});
