const ordersRouter = require("express").Router();
const { Orders, User, Order_Products } = require("../db");
const { requireUser, requireCurrentUserOrAdmin, requireAdmin } = require("./utils");

ordersRouter.post("/", requireUser, async (req, res, send) => {
  const { status, price } = req.body;
  const userId = req.user.id;
  try {
    const newOrder = Orders.createOrder({ userId, status, price });
    if (!newOrder) {
      throw { error: "Failed to create order!" };
    } else {
      console.log("POST/orders", newOrder);
      res.send(newOrder);
    }
  } catch ({ error }) {
    next({ error });
  }
});

ordersRouter.get("/users/:userId", requireUser, requireCurrentUserOrAdmin, async (req, res, next) => {
  try {
    console.log("inside GET /orders/users/:userId");
    const userId = req.params.userId;
    const orders = await Orders.getAllOrdersByUser(userId);
    if (!orders) {
      throw { error: "Unable to get orders" };
    } else {
      console.log("GET/users/:userId", orders);
      res.send(orders);
    }
  } catch ({ error }) {
    next({ error });
  }
});

ordersRouter.patch("/:orderId", requireAdmin, async (req, res, next) => {
  const { orderId } = req.params.orderId;
  const { productId, quantity } = req.body;

  try {
    const newOrderProduct = await Order_Products.addProductToOrder({
      orderId,
      productId,
      quantity,
    });
    if (!newOrderProduct) {
      throw { error: "Unable to add product to order!" };
    } else {
      const order = await getOrderById(orderId);
      console.log("PATCH/:orderId", order);
      res.send(order);
    }
  } catch ({ error }) {
    next({ error });
  }
});

ordersRouter.delete(
  "/:orderId",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
      const deletedOrder = await Orders.deleteOrder(orderId);
      if (!deletedOrder) {
        throw { error: "Unable to delete order!" };
      } else {
        console.log("DELETE/:orderId", deletedOrder);
        res.send(deletedOrder);
      }
    } catch ({ error }) {
      next({ error });
    }
  }
);

module.exports = ordersRouter;
