document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація кошика
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Елементи DOM
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Відображення кошика
    function renderCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <div class="item-controls">
                        <button class="quantity-minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-plus">+</button>
                        <span class="item-price">${item.price * item.quantity} грн</span>
                        <button class="remove-btn">×</button>
                    </div>
                </div>
            `;
            
            // Додавання обробників подій
            itemElement.querySelector('.quantity-minus').addEventListener('click', () => updateQuantity(index, -1));
            itemElement.querySelector('.quantity-plus').addEventListener('click', () => updateQuantity(index, 1));
            itemElement.querySelector('.remove-btn').addEventListener('click', () => removeItem(index));
            
            cartItems.appendChild(itemElement);
        });

        totalAmount.textContent = total;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        updateCartCounter();
    }

    // Оновлення кількості
    function updateQuantity(index, delta) {
        cart[index].quantity += delta;
        if(cart[index].quantity < 1) cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    // Видалення товару
    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    // Оновлення лічильника в хедері
    function updateCartCounter() {
        const cartCounters = document.querySelectorAll('#cart-count');
        cartCounters.forEach(counter => {
            counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        });
    }

    // Збереження в localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
    }

    // Оформлення замовлення
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) {
            alert('Кошик порожній!');
            return;
        }
        alert('Замовлення оформлено! Очікуйте дзвінка.');
        localStorage.removeItem('cart');
        cart = [];
        renderCart();
    });

    // Початковий рендер
    renderCart();
});

// Функція для додавання товару в кошик
export function addToCart(pizza) {
    const existingItem = cart.find(item => item.id === pizza.id);
    if(existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(pizza);
    }
    saveCart();
    renderCart();
}

// Ініціалізація кнопок додавання в кошик
export function initAddToCartButtons() {
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const pizzaCard = e.target.closest('.pizza-card');
            const pizza = {
                id: pizzaCard.dataset.id,
                name: pizzaCard.dataset.name,
                price: parseInt(pizzaCard.dataset.price),
                image: pizzaCard.querySelector('img').src,
                quantity: 1
            };
            addToCart(pizza);
        });
    });
}