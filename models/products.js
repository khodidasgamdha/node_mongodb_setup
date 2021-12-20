const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
        uppercase: true,
        maxLength: [15, 'Name should not be more than 15 char.']
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"],
        lowercase: true,
        minLength: [15, 'Description should be more than 15 char.']
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        max: [8, "Price should not be more tham 8 num."],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        max: [4, "Stock should not be more tham 4 num."],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updateddAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema);
