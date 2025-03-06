const Product = require("../models/productModel");

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProduct = async (req, res) => {
    console.log(req.file); 
    console.log(req.body);

    try {
        const { name, description, price } = req.body;
        if (!req.file) return res.status(400).json({ error: "Image is required" });

        const imagePath = `/uploads/${req.file.filename}`;

        const newProduct = new Product({ name, description, price, imagePath });
        await newProduct.save();

        res.status(201).json({ message: "Product added", product: newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
