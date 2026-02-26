let cart = [];

// --- UI Toggle Functions ---
function toggleMenu() { 
    document.getElementById('navMenu').classList.toggle('active'); 
}

function toggleCart() { 
    document.getElementById('cartSidebar').classList.toggle('active'); 
}

// --- Cart Logic ---
function addToCart(name, price, weight) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, weight, qty: 1 });
    }
    
    renderCart();
    showMiniToast(`${name} added to cart!`);
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    renderCart();
}

function clearCart() {
    if(confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        renderCart();
    }
}

function renderCart() {
    const container = document.getElementById('cartContent');
    const countLabel = document.getElementById('cart-count');
    const floatingCountLabel = document.getElementById('floating-cart-count'); 
    
    if (!container) return;
    
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
    
    const totalQty = cart.reduce((a, b) => a + b.qty, 0);
    if (countLabel) countLabel.innerText = totalQty;
    if (floatingCountLabel) floatingCountLabel.innerText = totalQty;
    
    calcCart();
}

function calcCart() {
    const zoneElement = document.getElementById('shipZone');
    if (!zoneElement) return;
    
    const zone = zoneElement.value;
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

// --- FIXED CHECKOUT: Now mentions the specific destination ---

function checkout() {
    const zoneSelect = document.getElementById('shipZone');
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!zoneSelect || zoneSelect.value === "none") {
        return alert("Please select a destination.");
    }

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const city = document.getElementById('custCity').value.trim();
    const postcode = document.getElementById('custPostcode').value.trim();

    if (!name || !phone || !address || !city || !postcode) {
        return alert("Please fill in all shipping details.");
    }

    const destination = zoneSelect.options[zoneSelect.selectedIndex].text;
    const estimate = document.getElementById('deliveryEstimate').innerText;

    let text = `*Order Naseem Haneen*\n`;
    text += `📍 *Shipping To:* ${destination}\n`;
    text += `🚚 *${estimate}*\n\n`;

    text += `*Customer Details:*\n`;
    text += `👤 ${name}\n`;
    text += `📞 ${phone}\n`;
    text += `🏠 ${address}, ${city}, ${postcode}\n\n`;

    text += `*Items:*\n`;
    cart.forEach(i => {
        text += `- ${i.qty} x ${i.name}\n`;
    });

    text += `\n*Summary:*\n`;
    text += `Weight: ${document.getElementById('tw').innerText} kg\n`;
    text += `Shipping: ${document.getElementById('ts').innerText} SAR\n`;
    text += `*Total: ${document.getElementById('tt').innerText} SAR*`;

    window.open(
        `https://wa.me/966537379458?text=${encodeURIComponent(text)}`
    );
}

// --- Slider Logic ---
function moveSlide(trackId, index) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const dots = track.parentElement.querySelectorAll('.dot');
    track.setAttribute('data-index', index);
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function changeSlide(trackId, direction) {
    const track = document.getElementById(trackId);
    if (!track) return;
    let currentIndex = parseInt(track.getAttribute('data-index')) || 0;
    const totalSlides = track.querySelectorAll('.slider-img').length;
    let newIndex = currentIndex + direction;
    if (newIndex >= totalSlides) newIndex = 0;
    if (newIndex < 0) newIndex = totalSlides - 1;
    moveSlide(trackId, newIndex);
}

function startAutoSliders() {
    const allTracks = document.querySelectorAll('.slider-track');
    setInterval(() => {
        allTracks.forEach(track => {
            if (!track.parentElement.matches(':hover')) {
                let currentIndex = parseInt(track.getAttribute('data-index')) || 0;
                let total = track.querySelectorAll('.slider-img').length;
                let nextIdx = (currentIndex + 1) % total;
                moveSlide(track.id, nextIdx);
            }
        });
    }, 4000);
}

// --- Search & Filter ---
function filterCategory(category) {
    const searchInput = document.getElementById('productSearch');
    if (searchInput) searchInput.value = ''; 
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(category.toLowerCase()) || (category === 'all' && btn.innerText.includes('All')));
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

function searchProducts() {
    const input = document.getElementById('productSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const category = (card.getAttribute('data-category') || "").toLowerCase();
        if (title.includes(input) || category.includes(input)) {
            card.style.display = "block";
            card.style.opacity = "1";
        } else {
            card.style.display = "none";
            card.style.opacity = "0";
        }
    });
}

// --- Utilities ---
function applyAllDiscounts() {
    const products = document.querySelectorAll('.product-card');
    products.forEach(card => {
        const oldPriceElement = card.querySelector('.old-price');
        const newPriceElement = card.querySelector('.new-price');
        const badge = card.querySelector('.sale-badge');
        if (oldPriceElement && newPriceElement && badge) {
            const oldPrice = parseFloat(oldPriceElement.innerText);
            const newPrice = parseFloat(newPriceElement.innerText);
            if (oldPrice > newPrice) {
                const percentage = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
                badge.innerText = `${percentage}% OFF`;
                badge.style.display = "block";
            } else {
                badge.style.display = "none";
            }
        }
    });
}

function showMiniToast(message) {
    const toast = document.createElement('div');
    toast.className = 'mini-toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function() {
    const btn = document.getElementById("backToTop");
    if (btn) {
        btn.style.display = (document.documentElement.scrollTop > 300) ? "block" : "none";
    }
};

window.onload = () => {
    startAutoSliders();
    applyAllDiscounts();
    renderCart(); 
};

function updateDeliveryEstimate() {
    const zone = document.getElementById('shipZone').value;
    const box = document.getElementById('deliveryEstimate');

    let text = "Estimated Delivery: —";

    if (zone === "KSA") text = "Estimated Delivery: 4 to 7 days (Inside Saudi Arabia)";
    if (zone === "MY_S") text = "Estimated Delivery: 7 to 15 days (Semenanjung Malaysia)";
    if (zone === "MY_E") text = "Estimated Delivery: 7 to 21 days (Sabah & Sarawak)";
    if (zone === "SG") text = "Estimated Delivery: 5 to 7 days (Singapore)";

    box.innerText = text;
}

function togglePolicy() {
    document.getElementById("deliveryPolicyModal").classList.toggle("active");
}

function setPhonePrefix() {
    const zone = document.getElementById('shipZone').value;
    const phoneInput = document.getElementById('custPhone');

    if (!phoneInput) return;

    if (zone === "KSA") phoneInput.value = "+966 ";
    if (zone === "MY_S" || zone === "MY_E") phoneInput.value = "+60 ";
    if (zone === "SG") phoneInput.value = "+65 ";
}

function generateOrderId() {
    return "NH" + Date.now().toString().slice(-6);
}
