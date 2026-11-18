
const db = require("../config/db");
const sendResponse = require("../utils/response");

// Create order from cart
const createOrder = async (req, res) => {
    const { address } = req.body;
    const userId = req.user.id;

    if (!address || !address.trim()) {
        return sendResponse(res, 400, "Delivery address is required");
    }

    db.getConnection(async (err, connection) => {
        if (err) {
            return sendResponse(res, 500, "Database connection failed");
        }

        // Run SQL query using the same connection
        const query = (sql, values = []) => {
            return new Promise((resolve, reject) => {
                connection.query(sql, values, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        try {
            await new Promise((resolve, reject) => {
                connection.beginTransaction((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            // Get cart products and check stock
            const cartItems = await query(
                `SELECT
                    cart_items.product_id,
                    cart_items.quantity,
                    products.price,
                    products.stock
                 FROM cart_items
                 JOIN products ON cart_items.product_id = products.id
                 WHERE cart_items.user_id = ?
                 FOR UPDATE`,
                [userId]
            );

            if (cartItems.length === 0) {
                await new Promise((resolve) => {
                    connection.rollback(() => resolve());
                });

                connection.release();
                return sendResponse(res, 400, "Your cart is empty");
            }

            // Check available stock
            for (const item of cartItems) {
                if (item.quantity > item.stock) {
                    throw new Error(
                        "Insufficient stock for product ID " + item.product_id
                    );
                }
            }

            // Calculate total amount from database prices
            const totalAmount = cartItems.reduce((total, item) => {
                return total + Number(item.price) * Number(item.quantity);
            }, 0);

            // Create order
            const orderResult = await query(
                `INSERT INTO orders (user_id, total_amount, address)
                 VALUES (?, ?, ?)`,
                [userId, totalAmount, address.trim()]
            );

            const orderId = orderResult.insertId;

            // Save order items
            const orderValues = cartItems.map((item) => [
                orderId,
                item.product_id,
                item.quantity,
                item.price
            ]);

            await query(
                `INSERT INTO order_items
                 (order_id, product_id, quantity, price)
                 VALUES ?`,
                [orderValues]
            );

            // Reduce product stock
            for (const item of cartItems) {
                await query(
                    `UPDATE products
                     SET stock = stock - ?
                     WHERE id = ?`,
                    [item.quantity, item.product_id]
                );
            }

            // Clear user's cart
            await query(
                "DELETE FROM cart_items WHERE user_id = ?",
                [userId]
            );

            await new Promise((resolve, reject) => {
                connection.commit((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            connection.release();

            return sendResponse(res, 201, "Order placed successfully", {
                order_id: orderId,
                total_amount: totalAmount,
                status: "Pending"
            });

        } catch (error) {
            connection.rollback(() => {
                connection.release();
                return sendResponse(
                    res,
                    400,
                    error.message.startsWith("Insufficient stock")
                        ? error.message
                        : "Unable to place order"
                );
            });
        }
    });
};

// Get user's order history
const getMyOrders = (req, res) => {
    const sql = `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [req.user.id], (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch orders");
        }

        return sendResponse(
            res,
            200,
            "Orders fetched successfully",
            result
        );
    });
};

// Get order details
const getOrderDetails = (req, res) => {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
        return sendResponse(res, 400, "Invalid order ID");
    }

    const sql = `
        SELECT
            orders.id AS order_id,
            orders.total_amount,
            orders.address,
            orders.status,
            orders.created_at,
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name AS product_name,
            products.image_url
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
        WHERE orders.id = ? AND orders.user_id = ?
    `;

    db.query(sql, [orderId, req.user.id], (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch order details");
        }

        if (result.length === 0) {
            return sendResponse(res, 404, "Order not found");
        }

        return sendResponse(
            res,
            200,
            "Order details fetched successfully",
            result
        );
    });
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderDetails
};
