// index.js

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// In-memory products array
let products = [
    { id: 1, name: "Laptop", price: 50000, quantity: 5 },
    { id: 2, name: "Mouse", price: 500, quantity: 50 },
    { id: 3, name: "Keyboard", price: 1200, quantity: 20 }
];

// --- CRUD Endpoints ---

// Create Product
app.post("/products", (req, res) => {
    const { id, name, price, quantity } = req.body;
    if (!id || !name || !price || !quantity) {
        return res.status(400).send({ message: "All fields are required" });
    }
    const exists = products.find(p => p.id === id);
    if (exists) return res.status(400).send({ message: "Product with this ID already exists" });

    products.push({ id, name, price, quantity });
    res.status(201).send({ message: "Product added", product: { id, name, price, quantity } });
});

// Read All Products
app.get("/products", (req, res) => {
    res.send(products);
});

// Read Single Product by ID
app.get("/products/:id", (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.send(product);
});

// Update Product
app.put("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    
    // Validate ID is a number
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID. Must be a number." });
    }
    
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { name, price, quantity } = req.body;
    
    // Validate and update fields
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "Name must be a non-empty string" });
        }
        product.name = name.trim();
    }
    
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ message: "Price must be a positive number" });
        }
        product.price = price;
    }
    
    if (quantity !== undefined) {
        if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ message: "Quantity must be a positive integer" });
        }
        product.quantity = quantity;
    }

    res.status(200).json({ message: "Product updated successfully", product });
});

// Delete Product
app.delete("/products/:id", (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send({ message: "Product not found" });

    const deletedProduct = products.splice(index, 1);
    res.send({ message: "Product deleted", product: deletedProduct[0] });
});

// --- Server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("✅ Product Catalog API is running! Try /products");
  });
  