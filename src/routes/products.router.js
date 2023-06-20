import Router from './router.js';
import Products from '../dao/dbManager/products.dbManager.js';
import { passportEnum } from '../config/enums.config.js';

const productManager = new Products();

export default class ProductRouter extends Router {

    init() {
        this.get('/', ['PUBLIC'], passportEnum.NOTHING, this.getAllProdducts);
        this.get('/:pid', ['PUBLIC'], passportEnum.NOTHING, this.getByIdProduct);
        this.post('/', ['ADMIN'], passportEnum.JWT, this.createProduct);
        this.put('/:pid', ['ADMIN'], passportEnum.JWT, this.modifyProduct);
        this.delete('/:pid', ['ADMIN'], passportEnum.JWT, this.eliminateProduct)
    };

    async getAllProdducts(req, res) {
        const { limit = 10, page = 1, query = false, sort } = req.query;
        if (sort) {
            if (sort !== 'desc' && sort !== 'asc') return res.sendClientError('This sort no exist');
        };
        try {
            const products = await productManager.getAll(limit, page, query, sort);
            if (page > products.totalPages || page <= 0) return res.sendClientError('This page no exist');
            const url = '/api/products?'
            products.prevLink = products.hasPrevPage ? `${url}page=${products.prevPage}` : null;
            products.nextLink = products.hasNextPage ? `${url}page=${products.nextPage}` : null;
            res.sendSuccess(products);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async getByIdProduct(req, res) {
        const { pid } = req.params;
        try {
            const product = await productManager.getById(pid);
            if (product) res.sendSuccess(product);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async createProduct(req, res) {

        console.log('******-', req.body);

        const { title, description, code, price, stock, category } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.sendClientError('Incomplete Value');
        };
        const codeSearch = await productManager.getByCode(code);
        if (codeSearch) return res.sendClientError(codeSearch.error);
        try {
            const result = await productManager.save({ ...req.body });
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async modifyProduct(req, res) {
        const { title, description, code, price, stock, category } = req.body;
        const { pid } = req.params;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.sendClientError('Incomplete Value');
        }
        try {
            const product = await productManager.updateById( pid, { ...req.body });
            res.sendSuccess(product);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async eliminateProduct(req, res) {
        const { pid } = req.params;
        try {
            const result = await productManager.deleteById(pid);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };
};