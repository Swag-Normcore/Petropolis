const client = require("../client");
const { getOrderById, updateOrder } = require("./orders.js");
const { getProductById } = require("./products");

module.exports = {
    addProductToOrder,
    getOrderProductsByOrder,
    removeProductFromOrder,
    updateOrderProductQuantity
}

async function addProductToOrder({ orderId, productId, quantity }) {
    try {
        const order = await getOrderById(orderId);
        const product = await getProductById(productId);
        if (order && product) {
            const subTotal = product.price * quantity;
            // let totalPrice = order.totalPrice + subTotal;
            const { rows: [orderProduct] } = await client.query(`
                INSERT INTO order_products("orderId", "productId", "subTotal", quantity)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `, [orderId, productId, subTotal, quantity]);
            // const updatedOrder = await updateOrder(orderId, { totalPrice });
            if (!orderProduct) {
                throw new Error("Couldn't add product to order!");
                // } else if (!updatedOrder) {
                //     throw new Error("Couldn't update order's total price!");
            } else {
                orderProduct.product = product;
                console.log("addProductToOrder: ", orderProduct);
                return orderProduct;
            }
        } else {
            throw new Error("Must provide valid order id and prodcuct id");
        }
    } catch (err) {
        console.error(err);
    }
}

async function getOrderProductsByOrder(orderId) {
    try {
        const { rows: orderProducts } = await client.query(`
            SELECT order_products.*, products.title, products.description,
            products.image, products.price
            FROM order_products
            JOIN products ON order_products."productId"=products.id
            WHERE order_products."orderId"=$1;
        `, [orderId]);
        if (!orderProducts) {
            throw new Error("Couldn't get order products!")
        } else {
            console.log("getOrderProductsByOrder: ", orderProducts);
            return orderProducts;
        }
    } catch (err) {
        console.error(err);
    }
}

async function updateOrderProductQuantity({ orderProductId, quantity }) {
    try {
        if (!orderProductId || !quantity) {
            throw new Error("Must provide an order product id and quantity!");
        } else if (quantity === 0) {
            const removedProduct = await removeProductFromOrder(orderProductId);
            console.log("updateOrderProductQuantity (to zero): ", removedProduct);
        } else {
            const { rows: [orderProduct] } = await client.query(`
            SELECT order_products.*
            FROM order_products
            WHERE order_products.id=$1;
        `, [orderProductId]);
            const order = await getOrderById(orderProduct.orderId);
            const product = await getProductById(orderProduct.productId);
            if (!order) {
                throw new Error("Couldn't find order!");
            } else if (!product) {
                throw new Error("Couldn't find product!");
            } else {
                const subTotal = product.price * quantity;
                // let totalPrice = subTotal;
                // if (order.products) {
                //     order.products.forEach((el) => {
                //         if (el.orderProductId !== orderProductId) {
                //             totalPrice += el.subTotal;
                //         }
                //     })
                // }
                const { rows: [updatedOrderProduct] } = await client.query(`
                    UPDATE order_products
                    SET "quantity"=$1, "subTotal"=$2
                    WHERE id=$3
                    RETURNING *;
                `, [quantity, subTotal, orderProductId]);
                // const updatedOrder = await updateOrder(order.id, { totalPrice });
                if (!updatedOrderProduct) {
                    throw new Error("Couldn't update order product!");
                    // } else if (!updatedOrder) {
                    //     throw new Error("Couldn't update order's total price!");
                } else {
                    updatedOrderProduct.product = product;
                    console.log("updateOrderProductQuantity: ", updatedOrderProduct, updatedOrder);
                    return updatedOrderProduct;
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function removeProductFromOrder(orderProductId) {
    try {
        const { rows: [orderId] } = await client.query(`
            SELECT order_products."orderId"
            FROM order_products
            WHERE order_products.id=$1;
        `, [orderProductId]);
        const { rows: orderProduct } = await client.query(`
            DELETE FROM order_products
            WHERE id=$1;
        `);
        const order = await getOrderById(orderId);
        if (!orderProduct) {
            throw new Error("Couldn't delete order product!");
        } else if (!order) {
            throw new Error("Couldn't find order!");
        } else {
            // const totalPrice = order.totalPrice - orderProduct.subTotal;
            // const updatedOrder = await updateOrder(orderId, { totalPrice });
            // if (!updatedOrder) {
            //     throw new Error("Couldn't update order!");
            // } else {
            console.log("removeProductFromOrder: ", orderProduct);
            return orderProduct;
            // }
        }
    } catch (err) {
        console.error(err);
    }
}
