// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Scroll Animation for Category Cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe category cards
document.querySelectorAll('.category-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Make category cards clickable (backup in case link wrapper doesn't work)
document.querySelectorAll('.category-card[data-category]').forEach(card => {
    card.addEventListener('click', function(e) {
        // Only navigate if the click wasn't on a link
        if (e.target.tagName !== 'A' && e.target.tagName !== 'SPAN') {
            const category = this.getAttribute('data-category');
            const categoryMap = {
                'skincare': 'skincare.html',
                'health': 'health.html',
                'vitamins': 'vitamins.html'
            };
            if (categoryMap[category]) {
                window.location.href = categoryMap[category];
            }
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Quantity Controls
function increaseQuantity(btn) {
    const quantityInput = btn.parentElement.querySelector('.quantity-input');
    let currentValue = parseInt(quantityInput.value) || 1;
    if (currentValue < 99) {
        quantityInput.value = currentValue + 1;
    }
}

function decreaseQuantity(btn) {
    const quantityInput = btn.parentElement.querySelector('.quantity-input');
    let currentValue = parseInt(quantityInput.value) || 1;
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Prevent negative numbers in quantity input
document.addEventListener('DOMContentLoaded', () => {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 1) {
                this.value = 1;
            }
            if (this.value > 99) {
                this.value = 99;
            }
        });
    });
    
    // Initialize cart
    updateCartCount();
    renderCart();
});

// Shopping Cart Functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(btn) {
    const productCard = btn.closest('.product-card');
    const productName = productCard.querySelector('h3')?.textContent || 'Product';
    const quantityInput = productCard.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput?.value) || 1;
    
    // Get product image/video
    const productImage = productCard.querySelector('.product-image');
    let imageSrc = '';
    if (productImage) {
        const img = productImage.querySelector('img');
        const video = productImage.querySelector('video');
        if (img) imageSrc = img.src;
        else if (video) imageSrc = video.src || video.poster || '';
    }
    
    // Get price from data attribute or use default
    const price = parseFloat(productCard.getAttribute('data-price')) || 29.99;
    
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: productName,
            price: price,
            image: imageSrc,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    renderCart();
    toggleCart(); // Open cart after adding
    
    // Show feedback
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.background = '#28a745';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1000);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartQuantity(index, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    cart[index].quantity = parseInt(newQuantity);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p></div>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Get image source - handle both img and video elements
        let imageSrc = item.image;
        if (!imageSrc) {
            // Try to get image from product card
            const productCards = document.querySelectorAll('.product-card');
            for (let card of productCards) {
                const name = card.querySelector('h3')?.textContent;
                if (name === item.name) {
                    const img = card.querySelector('img');
                    const video = card.querySelector('video');
                    if (img) imageSrc = img.src;
                    else if (video) imageSrc = video.poster || video.src;
                    break;
                }
            }
        }
        
        return `
            <div class="cart-item">
                <img src="${imageSrc}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\'%3E%3Crect width=\'80\' height=\'80\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3ENo Image%3C/text%3E%3C/svg%3E'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity(${index}, ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="99" onchange="updateCartQuantity(${index}, this.value)">
                        <button onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})" aria-label="Remove item">&times;</button>
            </div>
        `;
    }).join('');
    
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    
    if (overlay && sidebar) {
        overlay.classList.toggle('active');
        sidebar.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Get cart summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.name} (x${item.quantity})`).join('\n');
    
    // Create WhatsApp message
    const message = `Hello! I would like to purchase:\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=13104616585&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}