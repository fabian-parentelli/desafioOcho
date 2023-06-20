import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import {__dirname} from './utils.js';
import initializePassport from './config/passport.config.js';
import viewsRouter from './routes/views.router.js';
import UsersRouter from './routes/users.router.js';
import CartsRouter from './routes/carts.router.js';
import ProductRouter from './routes/products.router.js';

const usersRouter = new UsersRouter();
const productsRouter = new ProductRouter();
const cartsRouter = new CartsRouter();

const app = express();

initializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/', viewsRouter);
app.use('/api/users', usersRouter.getRouter());

try {
    await mongoose.connect('mongodb+srv://fabianparentelli007code:MU8O6JWQtjzskwZE@clusterfabian.kpwq3c1.mongodb.net/desafio8?retryWrites=true&w=majority');
    console.log('Conected Db');
} catch (error) {
    console.error(error);
};

app.listen(8080, () => console.log('Server runing in port 8080'));