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
