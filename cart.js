// Отримуємо поточний кошик з localStorage або створюємо новий
function getCart() {
    const cart = localStorage.getItem('pizzaCart');
    return cart ? JSON.parse(cart) : [];
}

// Зберігаємо кошик у localStorage
function saveCart(cart) {
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
    updateCartCount();
}

// Оновлюємо лічильник товарів у кошику
function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = totalCount;
    });
}

// Додаємо товар до кошика
function addToCart(productId, productName, productPrice) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`${productName} додано до кошика!`);
}

// Видаляємо товар з кошика
function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    renderCartItems();
}

// Змінюємо кількість товару
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;

    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        renderCartItems();
    }
}

// Відображаємо товари у кошику
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    const cart = getCart();
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваш кошик порожній</p>';
        document.getElementById('total-amount').textContent = '0';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} грн × ${item.quantity}</p>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
                <div class="item-total">${item.price * item.quantity} грн</div>
            </div>
        `;
    }).join('');

    document.getElementById('total-amount').textContent = total;
}

// Обробка кнопки оформлення замовлення
function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Ваш кошик порожній!');
                return;
            }

            // Тут можна додати логіку оформлення замовлення
            alert('Замовлення оформлено! Дякуємо за покупку!');
            localStorage.removeItem('pizzaCart');
            updateCartCount();
            renderCartItems();
        });
    }
}

// Ініціалізація подій для кнопок "Додати в кошик"
function setupAddToCartButtons() {
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', function() {
            const pizzaCard = this.closest('.pizza-card');
            const id = parseInt(pizzaCard.getAttribute('data-id'));
            const name = pizzaCard.getAttribute('data-name');
            const price = parseInt(pizzaCard.getAttribute('data-price'));
            
            addToCart(id, name, price);
        });
    });
}

// Ініціалізація всіх функцій при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCartItems();
    setupAddToCartButtons();
    setupCheckoutButton();
});