import { cartModel } from '../models/carts.model.js';
import Products from './products.dbManager.js';

const productmanager = new Products();

export default class Carts {

    constructor() {
        console.log('Working Carts with DB');
    };

    save = async () => {
        const cart = { products: [] };
        const result = await cartModel.create(cart);
        return result;
    };

    getById = async (id) => {
        const cart = await cartModel.find({ _id: id }).lean();
        // console.log(JSON.stringify(cart, null, '\t'));
        if (!cart) {
            return { status: 'error', error: 'Cart not found' };
        } else {
            return cart;
        };
    };

    update = async (id, cart) => {
        const result = await cartModel.updateOne({ _id: id }, cart);
        return result;
    };

    addProductToCart = async (cid, pid) => {

        const cart = await cartModel.findOne({_id : cid});
        const product = await productmanager.getById(pid);
        const exist = cart.products.findIndex( pro => pro.product.toString() === product._id.toString());
        if(exist !== -1) {
            cart.products[exist].quantity++;
        } else {
            cart.products.push({product: product._id});
        };
        const result = await this.update(cart._id, cart);
        return result;
    };

    deleteProduct = async (cid, pid) => {
        const result = await cartModel.updateOne({_id : cid}, {$pull: {products: {product : {_id:pid}}}});
        console.log(result);
        return result;
    };

    updateProducts = async (cid, products) => {
        try {
            const result = await cartModel.updateOne({_id : cid}, products);
            return result;    
        } catch (error) {
            console.error(error);
        };
    };

    updateQuantity = async (cid, pid, quantity) => {
        const result = await cartModel.updateOne({_id : cid, 'products.product': pid}, { $inc: { "products.$.quantity": quantity }});
        return result;
    };

    deleteAllProducts = async (cid) => {
        const result = await cartModel.updateOne({_id : cid}, {products: []});
        return result;
    };
};