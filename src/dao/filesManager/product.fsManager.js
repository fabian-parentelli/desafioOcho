import fs from 'fs';

export default class ProductFsManager {

    constructor(path) { this.path = path };

    addProducts = async (obj) => {
        try {
            const products = await this.getAll();

            const product = {
                title: obj.title,
                description: obj.description,
                code: obj.code,
                price: Number(obj.price),
                stock: Number(obj.stock),
                category: obj.category,
                thumbnails: [obj.thumbnails],
                satatus: obj.satatus
            };

            if (products - length === 0) {
                product.id = 1
            } else {
                product.id = products[products.length - 1].id + 1;
            };

            products.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, `\t`));
            return product;

        } catch (error) {
            console.error(error);
        };
    };

    getAll = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products
            } else { [] };

        } catch (error) {
            console.error(error);
        };
    };

    getById = async (id) => {
        try {
            const products = await this.getAll();
            const product = products.find(prod => prod.id === id);
            if (!product) {
                console.error('Product not found');
            } else { return product };

        } catch (error) {
            console.error(error);
        };
    };

    updateProduct = async (id, obj) => {
        try {
            const products = await this.getAll();
            const wantedProduct = await this.getById(id);
            const product = { ...wantedProduct, ...obj };
            const indexProducts = products.findIndex(prod => prod.id === id);
            products.splice(indexProducts, 1);

            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return product;

        } catch (error) {
            console.error(error);
        };
    };

    deleteByID = async (id) => {
        try {
            const products = await this.getAll();
            const wantedProduct = products.findIndex(prod => prod.id === id);
            if (wantedProduct) {
                products.splice(wantedProduct, 1);
            } else { return { error: 'Product not found' } };

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

        } catch (error) {
            console.error( error );
        };
    };

    deleteAll = async () => {
        try {
            if(fs.existsSync(this.path)) {
                await fs.promises.unlink(this.path);
            } else { return { error: 'There are not products to remove' } };

        } catch (error) {
            console.error( error );
        };
    };
};