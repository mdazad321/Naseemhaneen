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

function renderCart() {
    const container = document.getElementById('cartContent');
    container.innerHTML = '';
    cart.forEach((i, idx) => {
        container.innerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>${i.qty}x ${i.name}</span>
            <span>${(i.price * i.qty).toFixed(2)} SAR</span>
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
            // Saudi Arabia Logic: 1 to 9 kg = 100 SAR
            if (weight <= 9) {
                shipping = 100;
            } else {
                // Example: If over 9kg, charge 100 + 15 SAR per extra kg
                shipping = 100 + ((weight - 9) * 15); 
            }
        } 
        else if (zone === "MY_S") {
            shipping = weight * 20;
        } 
        else if (zone === "MY_E") {
            shipping = weight * 25;
        } 
        else if (zone === "SG") {
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
