const express = require("express");
const apiRouter = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { Orders, Order_Products, CartProducts } = require("../db");
const { requireUser } = require("./utils");


apiRouter.post("/create-checkout-session", requireUser, async (req, res, next) => {
    const { cartProducts, shoppingId } = req.body;
    const userId = req.user.id;
    const cart = JSON.stringify(cartProducts.map((cartProduct) => {
        return {
            cartProductId: cartProduct.id,
            shoppingId: cartProduct.shoppingId,
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            price: cartProduct.product.price,
        }
    }))
    const taxRate = await stripe.taxRates.create({
        display_name: 'Sales Tax',
        inclusive: false,
        percentage: 7.25,
        country: 'US',
        state: 'FL',
        jurisdiction: 'US - CA',
        description: 'FL Sales Tax',
    });
    const customer = await stripe.customers.create({
        metadata: {
            userId,
            shoppingId,
            cart,
        }
    })
    const session = await stripe.checkout.sessions.create({
        line_items: cartProducts.map((cartProduct) => {
            return ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: cartProduct.product.title,
                        images: [cartProduct.product.image],
                        description: cartProduct.product.description,
                        metadata: {
                            id: cartProduct.productId
                        }
                    },
                    unit_amount: cartProduct.product.price,
                },
                quantity: cartProduct.quantity,
                tax_rates: [taxRate.id]
            })
        }),
        mode: 'payment',
        invoice_creation: {
            enabled: true,
        },
        customer: customer.id,
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/`,
    });

    res.send({ url: session.url });
});

const placeOrder = async (customer, data) => {
    try {
        const newOrder = await Orders.createOrder({
            userId: customer.metadata.userId,
            status: data.status,
            totalPrice: data.amount_total,
        });
        const cartProducts = JSON.parse(customer.metadata.cart);
        const orderProducts = await Promise.all(cartProducts.map(async (cartProduct) => {
            const orderProduct = await Order_Products.addProductToOrder({
                orderId: newOrder.id,
                productId: cartProduct.productId,
                quantity: cartProduct.quantity,
            });
            return orderProduct;
        }));
        await CartProducts.removeAllProductsFromCart(customer.metadata.shoppingId);
        newOrder.products = orderProducts;
        console.log("Processed Order: ", newOrder);
        return newOrder;
    } catch (err) {
        console.error(err);
    }
}

// This is your Stripe CLI webhook secret for testing your endpoint locally.

apiRouter.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let data = req.body.data.object;
    let eventType = req.body.type;

    // if (process.env.WEBHOOK_SECRET) {
    //     let event;

    //     try {
    //         event = stripe.webhooks.constructEvent(JSON.stringify(req.body), sig, process.env.WEBHOOK_SECRET);
    //         console.log("Webhook verified");
    //     } catch (err) {
    //         console.log(`Webhook Error: ${err.message}`);
    //         res.status(400).send(`Webhook Error: ${err.message}`);
    //         return;
    //     }

    //     data = event.data.object;
    //     eventType = event.type;

    // } else {
    //     data = req.body.data.object;
    //     eventType = req.body.type;
    // }


    // Handle the event

    if (eventType === "checkout.session.completed") {
        stripe.customers.retrieve(data.customer).then((customer) => {
            console.log(customer);
            console.log("data:", data);
            placeOrder(customer, data);
        }).catch(err => console.error(err.message));
    }

    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         const paymentIntentSucceeded = event.data.object;
    //         // Then define and call a function to handle the event payment_intent.succeeded
    //         break;
    //     // ... handle other event types
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
});

module.exports = apiRouter;
