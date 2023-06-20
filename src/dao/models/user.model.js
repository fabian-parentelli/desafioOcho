import mongoose, { Schema } from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    email: { type: String, required: true },
    age: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
});

userSchema.pre('findOne', function() {
    this.populate('cart');
});

export const userModel = mongoose.model(userCollection, userSchema);