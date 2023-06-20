const products = document.querySelector('.products');
products.addEventListener('click', addToCart);

async function addToCart(e) {
    if (e.target.classList.contains('btn')) {
        const btn = e.target.parentElement;
        const pid = btn.querySelector("button").getAttribute("data-id");
        const title = btn.querySelector('h2').textContent;

        const result = await fetch(`/api/carts/646a5540f86461c4696f9667/products/${pid}`, { method: "POST" });
        const message = await result.json();

        if (message) {
            Swal.fire({
                text: `The product ${title} was added to the cart`,
                toast: true,
                position: "top-right",
            });
        };
    };
};