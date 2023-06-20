import { Router } from 'express';
import Products from '../dao/dbManager/products.dbManager.js';
import Carts from '../dao/dbManager/carts.dbManager.js';

const productManager = new Products();
const cartManager = new Carts();
const router = Router();

const publicAccess = (req, res, next) => {
    if(req.session.user) return res.redirect('/products');
    next();
};

const privateAccess = (req, res, next) => {
    if(!req.session.user) return res.redirect('/login');
    next();
};

router.get('/register', publicAccess, (req, res) => {
    res.render('register');
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login');
});

router.get('/', publicAccess, (req, res) => {
    res.render('login');
});

router.get('/products', privateAccess, async (req, res) => {
    const { limit = 10, page = 1, query = false, sort } = req.query;
    console.log(req.session.user);

    if (sort) {
        if (sort !== 'desc' && sort !== 'asc') {
            return res.render('products', { status: 'error', error: 'This sort no exist' });
        };
    };

    try {
        const products = await productManager.getAll(limit, page, query, sort);

        if (page > products.totalPages || page <= 0) {
            return res.render('products', { status: 'error', error: 'This page no exist' });
        };

        const url = '/products?'
        products.prevLink = products.hasPrevPage ? `${url}page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `${url}page=${products.nextPage}` : null;
        
        res.render('products', {products, user: req.session.user});

    } catch (error) {
       res.render('products' , { status: 'error', error });
    };
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartManager.getById(cid);
        res.render('carts', {result});
    } catch (error) {
        res.render('carts', { error: 'Error', error });
    };
});

export default router;