const express = require("express");
const cron = require("node-cron");
const Joi = require("joi");

const app = express();
app.use(express.json());

// In-memory storage
const menu = []; // Example: [{ id: 1, name: "Pizza", price: 10.99, category: "Main Course" }]
const orders = []; // Example: [{ id: 1, items: [1, 2], status: "Preparing" }]
let orderIdCounter = 1; // Unique order ID counter

// Predefined categories for validation
const validCategories = ["Main Course", "Beverage", "Dessert"];

// Schema validation
const menuSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().valid(...validCategories).required(),
});

const orderSchema = Joi.object({
    items: Joi.array().items(Joi.number().integer()).min(1).required(),
});

// Endpoints

// Add or update a menu item
app.post("/menu", (req, res) => {
    const { error } = menuSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { name, price, category } = req.body;
    const existingItem = menu.find(item => item.name === name);

    if (existingItem) {
        existingItem.price = price;
        existingItem.category = category;
        return res.status(200).send("Menu item updated.");
    }

    menu.push({ id: menu.length + 1, name, price, category });
    res.status(201).send("Menu item added.");
});

// Retrieve all menu items
app.get("/menu", (req, res) => {
    res.json(menu);
});

// Place a new order
app.post("/orders", (req, res) => {
    const { error } = orderSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { items } = req.body;

    // Validate that all item IDs exist in the menu
    const invalidItems = items.filter(id => !menu.some(item => item.id === id));
    if (invalidItems.length > 0) {
        return res.status(400).send(`Invalid item IDs: ${invalidItems.join(", ")}`);
    }

    const order = { id: orderIdCounter++, items, status: "Preparing" };
    orders.push(order);
    res.status(201).json(order);
});

// Retrieve an order by ID
app.get("/orders/:id", (req, res) => {
    const orderId = parseInt(req.params.id);
    const order = orders.find(order => order.id === orderId);

    if (!order) {
        return res.status(404).send("Order not found.");
    }

    res.json(order);
});

// CRON job to update order statuses
cron.schedule("*/1 * * * *", () => {
    orders.forEach(order => {
        if (order.status === "Preparing") {
            order.status = "Out for Delivery";
            console.log(`Order ${order.id} status updated to ${order.status}.`);
        } else if (order.status === "Out for Delivery") {
            order.status = "Delivered";
            console.log(`Order ${order.id} status updated to ${order.status}.`);
        }
        
    });
    console.log("Order statuses updated.");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
