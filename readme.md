# Food Delivery Backend

## Overview
The Food Delivery Backend is a lightweight backend application built with Express.js. It provides APIs for managing restaurant menus, placing orders, and tracking order statuses. It also simulates periodic status updates to help create the foundation for a food delivery service.

---

## Features

1. **Menu Management**
   - Add or update menu items with details like name, price, and category.
   - Retrieve the list of all available menu items.

2. **Order Management**
   - Place orders by selecting multiple items from the menu.
   - Fetch the details of a specific order.

3. **Order Status Tracking**
   - Automated status updates using a cron job.
   - Status progression: `Preparing` → `Out for Delivery` → `Delivered`.

---

## Endpoints

### **Menu Management**
- **POST /menu**: Add or update a menu item.
  - Request Body:
    ```json
    {
        "name": "Pizza",
        "price": 10.99,
        "category": "Main Course"
    }
    ```
  - Response:
    ```json
    {
        "message": "Menu item added."
    }
    ```

- **GET /menu**: Retrieve all menu items.
  - Response:
    ```json
    [
        {
            "id": 1,
            "name": "Pizza",
            "price": 10.99,
            "category": "Main Course"
        }
    ]
    ```

### **Order Management**
- **POST /orders**: Place an order by selecting menu items.
  - Request Body:
    ```json
    {
        "items": [1, 2]
    }
    ```
  - Response:
    ```json
    {
        "id": 1,
        "items": [1, 2],
        "status": "Preparing"
    }
    ```

- **GET /orders/:id**: Fetch details of a specific order.
  - Response:
    ```json
    {
        "id": 1,
        "items": [1, 2],
        "status": "Out for Delivery"
    }
    ```

---

## Requirements

### **Dependencies**
- [Express](https://www.npmjs.com/package/express): Web framework for building the backend.
- [node-cron](https://www.npmjs.com/package/node-cron): Schedules periodic status updates.
- [Joi](https://www.npmjs.com/package/joi): Validates incoming request data.

### **Development Dependencies**
- [nodemon](https://www.npmjs.com/package/nodemon): Automatically restarts the server during development.

---

