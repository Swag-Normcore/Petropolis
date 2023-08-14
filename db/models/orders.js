const client = require("../client");

module.exports = {
    createOrder,
    getOrderById,
    getAllOrdersByUser,
    updateOrder,
    deleteOrder,
    deleteOrdersByUser
}

async function createOrder({ userId, status, totalPrice }) {
    try {
        const { rows: [order] } = await client.query(`
            INSERT INTO orders("userId", status, "totalPrice")
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [userId, status, totalPrice]);
        if (!order) {
            throw Error;
        } else {
            console.log("createOrder: ", order);
            return order;
        }

    } catch (err) {
        console.error(err);
    }
}

async function getOrderById(orderId) {
    try {
        const { rows: [order] } = await client.query(`
            SELECT orders.*, users.email AS "ownersEmail"
            FROM orders
            JOIN users ON orders."userId"=users.id
            WHERE orders.id=$1;
        `, [orderId]);
        if (!order) {
            throw Error;
        } else {
            const { rows: products } = await client.query(`
                SELECT products.*
                FROM products
                JOIN order_products ON products.id=order_products."productId"
                WHERE order_products."orderId"=$1;
            `, [orderId]);
            if (!products) {
                console.log("getOrderById: ", order);
                return order;
            } else {
                order.products = products;
                console.log("getOrderById: ", order);
                return order;
            }
        }
    } catch (err) {
        console.error(err)
    }
}

async function getAllOrdersByUser(userId) {
    try {
        const { rows: orders } = await client.query(`
            SELECT orders.*, users.email AS "ownersEmail"
            FROM orders
            JOIN users ON orders."userId"=users.id
            WHERE "userId"=$1;
        `, [userId]);
        if (!orders) {
            throw Error;
        } else {
            const ordersWithProducts = await Promise.all(orders.map(async (order) => {
                const { rows: products } = await client.query(`
                    SELECT products.*
                    FROM products
                    JOIN order_products ON products.id=order_products."productId"
                    WHERE order_products."orderId"=$1;
                `, [order.id])
                if (!products) {
                    return order;
                } else {
                    order.products = products;
                    return order;
                }
            }))
            console.log("getAllOrdersByUser: ", ordersWithProducts);
            return ordersWithProducts;
        }
    } catch (err) {
        console.error(err);
    }
}

async function updateOrder(id, fields = {}) {
    const setString = Object.keys(fields).map((key, ind) => {
        return `"${key}"=$${ind + 1}`;
    }).join(', ');
    if (!setString) {
        return;
    }
    try {
        const { rows: [order] } = await client.query(`
            UPDATE orders
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
    } catch (err) {
        console.error(err);
    }
}

async function deleteOrder(orderId) {
    try {
        const { rows: orderProducts } = await client.query(`
            DELETE *
            FROM order_products
            WHERE order_products."orderId"=$1
            RETURNING *;
        `, [orderId]);
        const { rows: [order] } = await client.query(`
            DELETE *
            FROM orders
            WHERE id=$1
            RETURNINGJ *;
        `, [orderId]);
        order.orderProducts = orderProducts;
        console.log("deleteOrder: ", order)
        return order;
    } catch (err) {
        console.error(err);
    }
}

async function deleteOrdersByUser(userId) {
    try {
        const { rows: orderProducts } = await client.query(`
            DELETE FROM order_products
            JOIN orders ON order_products."orderId"=orders.id
            WHERE orders."userId"=$1
            RETURING *;
        `, [userId]);
        const { rows: orders } = await client.query(`
            DELETE FROM orders
            WHERE orders."userId"=$1
            RETURNING *;
        `, [userId]);
        const deletedOrders = orders.map((order) => {
            order.order_products = orderProducts.filter((product) => {
                return order.id === product.orderId;
            })
            return order;
        })
        console.log("deleteOrderByUser: ", deletedOrders);
        return deletedOrders;
    } catch (err) {
        console.error(err);
    }
}
