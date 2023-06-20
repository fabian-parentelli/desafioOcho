import Router from './router.js';
import Carts from '../dao/dbManager/carts.dbManager.js';
import { passportEnum } from '../config/enums.config.js';

const cartManager = new Carts();

export default class CartsRouter extends Router {
    init() {
        this.post('/', ['PUBLIC'], passportEnum.NOTHING, this.createCart);
        this.get('/:pid', ['PUBLIC'], passportEnum.NOTHING, this.getByIdCart);
        this.post('/:cid/products/:pid', ['PUBLIC'], passportEnum.NOTHING, this.productToCart);
        this.delete('/:cid/products/:pid', ['PUBLIC'], passportEnum.NOTHING, this.removeProduct);
        this.put('/:cid', ['PUBLIC'], passportEnum.NOTHING, this.modifyCart);
        this.put('/:cid/products/:pid', ['PUBLIC'], passportEnum.NOTHING, this.modifyQuantity);
        this.delete('/:cid', ['PUBLIC'], passportEnum.NOTHING, this.eliminateAllProducts)
    };

    async createCart(req, res) {
        try {
            const result = await cartManager.save();
            res.sendSuccess(result);

        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async getByIdCart(req, res) {
        const { pid } = req.params;
        try {
            const result = await cartManager.getById(pid);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async productToCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        try {
            const result = await cartManager.addProductToCart(cid, pid);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async removeProduct(req, res) {
        const { cid } = req.params;
        const { pid } = req.params;
        try {
            const result = await cartManager.deleteProduct(cid, pid);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async modifyCart(req, res) {
        const { cid } = req.params;
        const products = req.body;
        try {
            const result = await cartManager.updateProducts(cid, products);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async modifyQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const result = await cartManager.updateQuantity(cid, pid, quantity);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async eliminateAllProducts(req, res) {
        const { cid } = req.params;
        try {
            const result = await cartManager.deleteAllProducts(cid);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };
};