import Router from "./router.js";
import Users from '../dao/dbManager/users.manager.js';
import Carts from '../dao/dbManager/carts.dbManager.js';
import { passportEnum } from "../config/enums.config.js";
import { isValidPassword, generateToken, createHash } from '../utils.js';

const usersManager = new Users();
const cartsManager = new Carts();

export default class UsersRouter extends Router {
    init() {
        this.post('/login', ['PUBLIC'], passportEnum.NOTHING, this.loginUser);
        this.post('/register', ['PUBLIC'], passportEnum.NOTHING, this.registerUser);
        this.get('/current', ['ADMIN'], passportEnum.JWT, this.current);
    };

    async loginUser(req, res) {
        const { email, password } = req.body;
        const user = await usersManager.getByEmail(email);
        if (!user) return res.sendClientError('Incorrect credentoals');
        const comparePassword = isValidPassword(user, password);
        if (!comparePassword) return res.sendClientError('Incorrect credentials');
        delete user.password;
        const accesToken = generateToken(user);
        res.sendSuccess({ accesToken });
    };

    async registerUser(req, res) {
        try {
            const { first_name, last_name, age, role, email, password } = req.body;
            
            if (!first_name || !last_name || !role || !email || !password || !age) 
            return res.sendClientError('Incomplete value');
            
            const exists = await usersManager.getByEmail(email);
            if (exists) return res.sendClientError('User already exists');

            const hashedPassword = createHash(password);
            const newUser = { ...req.body };
            const addCart = await cartsManager.save();
            newUser.cart = addCart._id;
            newUser.password = hashedPassword;
            const result = await usersManager.save(newUser);
            
            const objResult = result.toObject();
            delete objResult.password;
            res.sendSuccess(objResult);
        } catch (error) {
            res.sendServerError(error.message);
        };
    };

    async current(req, res) {
        const { user } = req.user;
        res.sendSuccess(user);
    };
};