const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ErrorHandler = require("../../../core/ErrorHandler");
const Product = require("../../../models/products");

module.exports = {
    getProduct: async (req, res, next) => {
        try {
            const products = await Product.find();
            
            res.status(200).send({
                data: products,
                message: "Products Found Successfully...",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 501));
        }
    },

    addProduct: async (req, res, next) => {
        try {
            const upload = setup.upload.fields([
                { name: "productImage", maxCount: 1 },
            ]);

            upload(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    return next(new ErrorHandler("Image Upload error.", 501));
                } else if (err) {
                    return next(new ErrorHandler(err, 501));
                }

                const {name, description, price, ratings, stock, numOfReviews} = req.body;

                if (name && description && price && req.files["productImage"]) {
                    const product = await Product.create({
                        name: name,
                        description: description,
                        price: price,
                        ratings: ratings,
                        stock: stock,
                        numOfReviews: numOfReviews,
                        image: req.files["productImage"] ? req.files["productImage"][0]["filename"] : null,
                    });

                    res.status(200).send({
                        data: product,
                        message: "Product Added Successfully...",
                    });
                } else {
                    return next(
                        new ErrorHandler("Missing Required Fields.", 404)
                    );
                }
            });
        } catch (error) {
            return next(new ErrorHandler(error.errors[0], 501));
        }
    },

    updateProduct: async (req, res, next) => {
        const { id, name, description, price, ratings, stock, numOfReviews } = req.body;

        try {
            // find Product based on Product id
            let product = await Product.findById(id);

            if (product) {
                product = await Product.findByIdAndUpdate(
                    id,
                    {
                        name: name ? name : product.name,
                        description: description ? description : product.description,
                        price: price ? price : product.price,
                        ratings: ratings ? ratings : product.ratings,
                        stock: stock ? stock : product.stock,
                        numOfReviews: numOfReviews ? numOfReviews : product.numOfReviews,
                        image: product.image,
                    },
                    {
                        new: true,
                        runValidators: true,
                        useFindAndModify: false,
                    }
                );

                res.status(200).send({
                    data: product,
                    message: "Product Updated Successfully...",
                });
            } else {
                return next(
                    new ErrorHandler(
                        "Could Not Find any Product with Given Product Id", 404
                    )
                );
            }
        } catch (error) {
            return next(new ErrorHandler(error.message, 501));
        }
    },

    deleteProduct: async (req, res, next) => {
        const { id } = req.query;

        try {
            // find Product based on Product id
            const product = await Product.findById(id);

            if (product) {
                await product.remove();

                // delete Image
                let dir = path.join(__dirname, "..", "..", "..", "uploads", product.image);

                fs.unlink(dir, (err) => {
                    if (err) throw err;
                    console.log("Image Deleted Successfully...");
                });

                res.status(200).send({
                    data: product,
                    message: "Product Deleted Successfully...",
                });
            } else {
                return next(
                    new ErrorHandler(
                        "Could Not Find any Product with Given Product Id", 404
                    )
                );
            }
        } catch (error) {
            return next(new ErrorHandler(error.message, 501));
        }
    },
};
