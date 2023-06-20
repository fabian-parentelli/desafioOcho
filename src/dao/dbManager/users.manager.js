import { userModel } from "../models/user.model.js";

export default class Users {
    
    constructor() {
        console.log('Working users with DB');
    };

    getAll = async () => {
        const users = await userModel.find().lean();
        return users;
    };

    getByEmail = async (email) => {
        const user = await userModel.findOne({email}).lean();
        return user;
    };

    save = async (user) => {
        const result = await userModel.create(user);
        return result;
    };
};