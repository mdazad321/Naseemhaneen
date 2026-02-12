let cart = [];

function toggleMenu() { document.getElementById('navMenu').classList.toggle('active'); }
function toggleCart() { document.getElementById('cartSidebar').classList.toggle('active'); }

function addToCart(name, price, weight) {
    const item = cart.find(i => i.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, weight, qty: 1 });
    renderCart();
    if(!document.getElementById('cartSidebar').classList.contains('active')) toggleCart();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartContent');
    container.innerHTML = '';
    cart.forEach((i, idx) => {
        container.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div style="flex:1;">
                    <strong>${i.name}</strong><br><small>${i.price} SAR</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
                    <span>${i.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
                </div>
                <div style="width:80px; text-align:right; font-weight:bold;">
                    ${(i.price * i.qty).toFixed(2)}
                </div>
            </div>`;
    });
    document.getElementById('cart-count').innerText = cart.reduce((a, b) => a + b.qty, 0);
    calcCart();
}

function calcCart() {
    const zone = document.getElementById('shipZone').value;
    let weight = 0, subtotal = 0, shipping = 0;

    cart.forEach(i => {
        weight += i.weight * i.qty;
        subtotal += i.price * i.qty;
    });

    if (weight > 0) {
        if (zone === "KSA") {
            shipping = weight <= 9 ? 100 : 100 + ((weight - 9) * 15);
        } else if (zone === "MY_S") {
            shipping = weight * 20;
        } else if (zone === "MY_E") {
            shipping = weight * 25;
        } else if (zone === "SG") {
            if (weight <= 10) shipping = 237;
            else if (weight <= 20) shipping = 340;
            else if (weight <= 30) shipping = 391;
            else shipping = 391 + ((weight - 30) * 15);
        }
    }

    document.getElementById('tw').innerText = weight.toFixed(1);
    document.getElementById('ts').innerText = shipping.toFixed(2);
    document.getElementById('tt').innerText = (subtotal + shipping).toFixed(2);
}

function checkout() {
    const zone = document.getElementById('shipZone');
    if (cart.length === 0) return alert("Cart is empty!");
    if (zone.value === "none") return alert("Select destination!");

    let text = `*Order Naseem Haneen*\n`;
    cart.forEach(i => text += `- ${i.qty}x ${i.name}\n`);
    text += `\nWeight: ${document.getElementById('tw').innerText}kg`;
    text += `\nShipping: ${document.getElementById('ts').innerText} SAR`;
    text += `\n*Total: ${document.getElementById('tt').innerText} SAR*`;

    window.open(`https://wa.me/966537379458?text=${encodeURIComponent(text)}`);
}

function moveSlide(trackId, index) {
    const track = document.getElementById(trackId);
    const dots = track.parentElement.querySelectorAll('.dot');
    
    // Move the track based on index (0 = 0%, 1 = -100%, 2 = -200%)
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update active dot
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}


// Function for Arrow Navigation
function changeSlide(trackId, direction) {
    const track = document.getElementById(trackId);
    let currentIndex = parseInt(track.getAttribute('data-index')) || 0;
    const totalSlides = track.querySelectorAll('.slider-img').length;
    
    let newIndex = currentIndex + direction;
    
    // Loop around
    if (newIndex >= totalSlides) newIndex = 0;
    if (newIndex < 0) newIndex = totalSlides - 1;
    
    moveSlide(trackId, newIndex);
}

// Core move function
function moveSlide(trackId, index) {
    const track = document.getElementById(trackId);
    if (!track) return;
    
    const dots = track.parentElement.querySelectorAll('.dot');
    
    track.setAttribute('data-index', index);
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Auto-play logic
function startAutoSliders() {
    const allTracks = document.querySelectorAll('.slider-track');
    
    setInterval(() => {
        allTracks.forEach(track => {
            // Only auto-slide if the user isn't currently hovering/touching
            if (!track.parentElement.matches(':hover')) {
                let currentIndex = parseInt(track.getAttribute('data-index')) || 0;
                let total = track.querySelectorAll('.slider-img').length;
                let nextIdx = (currentIndex + 1) % total;
                moveSlide(track.id, nextIdx);
            }
        });
    }, 4000); // 4 seconds is better for reading multiple images
}

window.onload = startAutoSliders;

function filterCategory(category) {
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update active button state
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(category) || (category === 'all' && btn.innerText.includes('All')));
    });

    // Show/Hide cards
    cards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function searchProducts() {
    const input = document.getElementById('productSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        // Look at the title (h3) and the category attribute
        const title = card.querySelector('h3').innerText.toLowerCase();
        const category = card.getAttribute('data-category').toLowerCase();

        if (title.includes(input) || category.includes(input)) {
            card.style.display = "block";
            card.style.opacity = "1";
        } else {
            card.style.display = "none";
            card.style.opacity = "0";
        }
    });
}

// Ensure category filtering also clears the search bar for a better experience
function filterCategory(category) {
    document.getElementById('productSearch').value = ''; // Clear search when clicking category
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(category) || (category === 'all' && btn.innerText.includes('All')));
    });

    cards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Show/Hide "Back to Top" button based on scroll position
window.onscroll = function() {
    const btn = document.getElementById("backToTop");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

