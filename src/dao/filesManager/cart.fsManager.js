import fs from 'fs';
import ProductFsManager from './product.fsManager.js';

const productManager = new ProductFsManager('./src/files/products.json');

export default class CartManager {

    constructor(path) { this.path = path };

    async addCart(cart) {
        try {
            const carts = await this.getAddCart()

            if (carts.length === 0) {
                cart.id = 1;
            } else {
                cart.id = carts[carts.length - 1].id + 1;
            };

            carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return cart;

        } catch (error) {
            console.error(error);
        };
    };

    async getAddCart() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf8');
                const carts = JSON.parse(data);
                return carts;
            } else {
                return [];
            };

        } catch (error) {
            console.error(error);
        };
    };

    async getByIdCart(id) {
        try {
            const carts = await this.getAddCart();
            const cart = carts.find(car => car.id == id);

            if (cart) {
                return cart;
            } else {
                return { error: 'Cart not found' };
            };

        } catch (error) {
            console.error(error);
        };
    };

    async updateCart(id, obj) {
        try {
            const carts = await this.getAddCart();
            const wantedCart = await this.getByIdCart(id);

            const cart = { ...wantedCart, ...obj };

            const indexcart = carts.findIndex(car => car.id === id);
            carts.splice(indexcart, 1);

            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return cart;

        } catch (error) {
            console.error(error);
        };
    };

    async addProductToCart(cid, pid) {
        const cart = await this.getByIdCart(cid)
        const product = await productManager.getById(pid);

        const result = cart.products.findIndex(prod => prod.product === pid)

        if (result !== -1) {
            cart.products[result].quantity++
        } else {
            cart.products.push({ product: product.id, quantity: 1 });
        };

        const update = await this.updateCart(cid, cart)
        return update
    };
};