// =============================================
// MASTER PRODUCT LIST (Catalog ng tindahan)
// =============================================
const allProducts = [
    // MEN
    { id: 1, name: "Running Shoes", price: 1500, category: "Men", emoji: "👟" },
    { id: 6, name: "Pantalon", price: 700, category: "Men", emoji: "👖" },

    // WOMEN
    { id: 4, name: "Summer Dress", price: 1200, category: "Women", emoji: "👗" },
    { id: 7, name: "Handbag", price: 950, category: "Women", emoji: "👜" },

    // KIDS
    { id: 5, name: "Kids Sneakers", price: 900, category: "Kids", emoji: "👟" },
    { id: 8, name: "Baby Onesie", price: 350, category: "Kids", emoji: "🧸" },

    // ACCESSORIES
    { id: 2, name: "Backpack", price: 800, category: "Accessories", emoji: "🎒" },
    { id: 3, name: "Smart Watch", price: 2500, category: "Accessories", emoji: "⌚" }
];

// =============================================
// CART DATA (I-save sa localStorage)
// =============================================
let cartItems = [];

function loadCart() {
    const saved = localStorage.getItem('eshopCart');
    if (saved) {
        try {
            cartItems = JSON.parse(saved);
        } catch (e) {
            cartItems = [];
        }
    } else {
        cartItems = [];
    }
}

function saveCart() {
    localStorage.setItem('eshopCart', JSON.stringify(cartItems));
}

// =============================================
// FUNCTION: I-render ang mga produkto
// =============================================
function renderProductCards(containerId, categoryFilter = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let filteredProducts = allProducts;
    if (categoryFilter && categoryFilter !== 'all') {
        filteredProducts = allProducts.filter(p => p.category === categoryFilter);
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = `<p style="text-align: center; padding: 20px; color: #888;">No products found in this category.</p>`;
        return;
    }

    let html = '';
    filteredProducts.forEach(product => {
        html += `
            <article class="product-card">
                <div class="product-image">${product.emoji}</div>
                <h3>${product.name}</h3>
                <p class="product-price">₱${product.price}</p>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="remove-from-cart" data-id="${product.id}">Remove</button>
                </div>
            </article>
        `;
    });

    container.innerHTML = html;
}

// =============================================
// FUNCTION: Add to Cart
// =============================================
function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existing = cartItems.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    saveCart();
    updateBadge();
    renderCart();
    refreshAllProductDisplays();
}

// =============================================
// FUNCTION: Remove from Cart
// =============================================
function removeFromCart(id) {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity -= 1;
        } else {
            cartItems.splice(index, 1);
        }
    }
    saveCart();
    updateBadge();
    renderCart();
    refreshAllProductDisplays();
}

// =============================================
// FUNCTION: I-refresh ang displays
// =============================================
function refreshAllProductDisplays() {
    const allContainer = document.getElementById('all-products-grid');
    if (allContainer) {
        renderProductCards('all-products-grid', 'all');
    }

    const catContainer = document.getElementById('category-products');
    if (catContainer) {
        const currentCat = window.currentCategory || 'all';
        renderProductCards('category-products', currentCat);
    }
}

// =============================================
// FUNCTION: I-update ang cart badge
// =============================================
function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = totalQty;
}

// =============================================
// FUNCTION: Ipakita ang cart table
// =============================================
function renderCart() {
    const tbody = document.getElementById('cartItems');
    if (!tbody) return;

    if (cartItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-cart-message">Your cart is empty.</td></tr>`;
        const grandTotalEl = document.getElementById('grandTotal');
        if (grandTotalEl) grandTotalEl.innerText = '₱0.00';
        updateBadge();
        return;
    }

    let html = '';
    let grandTotal = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;
        html += `
            <tr class="cart-row">
                <td class="cart-cell">${item.name}</td>
                <td class="cart-cell text-center">₱${item.price}</td>
                <td class="cart-cell text-center">
                    <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
                    ${item.quantity}
                    <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
                </td>
                <td class="cart-cell text-center">₱${itemTotal}</td>
                <td class="cart-cell text-center">
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
    const grandTotalEl = document.getElementById('grandTotal');
    if (grandTotalEl) grandTotalEl.innerText = `₱${grandTotal.toFixed(2)}`;
    updateBadge();
}

// =============================================
// FILTER FUNCTION (Para sa categories page)
// =============================================
function filterProducts(category) {
    window.currentCategory = category;
    renderProductCards('category-products', category);
}

// =============================================
// EVENT LISTENERS
// =============================================
document.addEventListener('click', function(e) {
    const target = e.target;

    if (target.classList.contains('add-to-cart')) {
        const id = parseInt(target.dataset.id);
        addToCart(id);
        alert('✅ Product added to cart!');
    }

    if (target.classList.contains('remove-from-cart')) {
        const id = parseInt(target.dataset.id);
        removeFromCart(id);
        alert('🗑️ Product removed from cart.');
    }

    if (target.classList.contains('qty-btn')) {
        const index = target.dataset.index;
        const action = target.dataset.action;
        if (action === 'increase') {
            cartItems[index].quantity += 1;
        } else if (action === 'decrease') {
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity -= 1;
            } else {
                cartItems.splice(index, 1);
            }
        }
        saveCart();
        renderCart();
        refreshAllProductDisplays();
    }

    if (target.classList.contains('remove-btn')) {
        const index = target.dataset.index;
        cartItems.splice(index, 1);
        saveCart();
        renderCart();
        refreshAllProductDisplays();
    }

    if (target.id === 'buyButton') {
        if (cartItems.length === 0) {
            alert('Your cart is empty! Add some items first.');
        } else {
            alert('✅ Thank you for your purchase! Total: ' + document.getElementById('grandTotal').innerText);
            cartItems = [];
            saveCart();
            renderCart();
            updateBadge();
            refreshAllProductDisplays();
        }
    }
});

// =============================================
// INITIALIZE
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    renderCart();

    const allContainer = document.getElementById('all-products-grid');
    if (allContainer) {
        renderProductCards('all-products-grid', 'all');
    }

    const catContainer = document.getElementById('category-products');
    if (catContainer) {
        window.currentCategory = 'all';
        renderProductCards('category-products', 'all');
    }

    updateBadge();
});
