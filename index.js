const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product.model.js');
const RequestCount = require('./models/response.model.js');
const app = express();

app.use(express.json());

// Middleware to update request count
async function updateRequestCount(req, res, next) {
    try {
        const requestType = req.method.toLowerCase();
        let requestCount = await RequestCount.findOne();

        if (!requestCount) {
            requestCount = new RequestCount();
        }

        if (requestCount[requestType] !== undefined) {
            requestCount[requestType] += 1;
        }

        await requestCount.save();
        next();
    } catch (err) {
        next(err);
    }
}

app.use(updateRequestCount);

app.listen(3000, () => {
    console.log("listening on port 3000");
});

app.get('/', (req, res) => {
    res.send("hi");
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).send("Failed to create product");
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

mongoose.connect("mongodb+srv://chalumurimadhu9999:12345@cluster0.dsj5ohb.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((err) => {
        console.log("failed to connect to MongoDB:", err);
    });
