import React from "react";
import { ordersAtom } from "../atoms";
import { useAtom } from "jotai";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Accordion from 'react-bootstrap/Accordion';
import { Link } from "react-router-dom";

const OrdersPageComponent = () => {
    const [orders, setOrders] = useAtom(ordersAtom);

    return (
        <div id="orders-page" className="d-flex flex-column align-items-center">
            {
                orders ?
                    <>
                        <h1>Orders:</h1>
                        <Accordion className="m-4">
                            {orders.map((order) => {
                                return (
                                    <Accordion.Item key={order.id} eventKey={order.id} className="border-secondary">
                                        <Accordion.Header className="order-header">
                                            <Stack direction="horizontal" gap={5} className="order-item">
                                                <p className="order-info">Order ID: {order.id}</p>
                                                <p className="order-info">Total: ${order.totalPrice / 100}</p>
                                                <p className="order-info">Status: {order.status}</p>
                                                <p className="order-info">Date: {order.dateCreated}</p>
                                            </Stack>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Stack gap={3}>
                                                {order.products.map((product) => {
                                                    return (
                                                        <Stack key={product.id} direction="horizontal" gap={3}>
                                                            <Link to={`/products/${product.id}`}>
                                                                <img src={product.image} width="70px" className="p-2" />
                                                            </Link>
                                                            <p className="p-2 order-product">{product.title}</p>
                                                            <p className="p-2 order-product">${product.price / 100}</p>
                                                        </Stack>
                                                    )
                                                })}
                                            </Stack>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })}
                        </Accordion>
                    </>
                    :
                    <h1>No Orders! Browse products <Link to="/">here.</Link></h1>
            }
        </div>
    )
}

export default OrdersPageComponent;
