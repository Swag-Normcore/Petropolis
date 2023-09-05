import React from "react";
import { Link } from "react-router-dom/";
import { shoppingCartAtom, tokenAtom, userAtom, canvasAtom } from "../atoms";
import { useAtom } from "jotai";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import addIcon from "../images/plus-circle.svg";
import subtractIcon from "../images/dash-circle.svg";
import trashCan from "../images/trash-fill.svg";
import {
    removeProductFromShoppingCart,
    updateShoppingCartProductQuantity,
    stripeCheckout,
} from "../axios-services";

const ShoppingCart = () => {
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [user, setUser] = useAtom(userAtom);
    const [canvas, setCanvas] = useAtom(canvasAtom);

    let totalPrice = 0;
    shoppingCart
        ? shoppingCart.products.forEach((cartProduct) => {
            totalPrice += (cartProduct.quantity * cartProduct.product.price) / 100;
        })
        : null;
    async function handleDelete(cartProductId) {
        console.log("trying to delete...");
        const result = await removeProductFromShoppingCart({
            shoppingId: shoppingCart.id,
            cartProductId,
            token
        });
        if (result) {
            setShoppingCart(result);
        }
    }
    async function handleAdd(cartProductId, quantity) {
        console.log("trying to add...");
        const result = await updateShoppingCartProductQuantity({
            shoppingId: shoppingCart.id,
            cartProductId,
            quantity: quantity + 1,
            token
        });
        if (result) {
            setShoppingCart(result);
        }
    }
    async function handleSubtract(cartProductId, quantity) {
        console.log("trying to subtract...");
        if (quantity === 1) {
            const result = await removeProductFromShoppingCart({
                shoppingId: shoppingCart.id,
                cartProductId,
                token
            });
            if (result) {
                setShoppingCart(result);
            }
        } else {
            const result = await updateShoppingCartProductQuantity({
                shoppingId: shoppingCart.id,
                cartProductId,
                quantity: quantity - 1,
                token
            });
            if (result) {
                setShoppingCart(result);
            }
        }
    }

    async function handleCheckout() {
        const result = await stripeCheckout({ cartProducts: shoppingCart.products, shoppingId: shoppingCart.id, token });
        if (result.url) {
            window.location.href = result.url;
        }
    }

    return (
        <div>
            {shoppingCart ? (
                shoppingCart.products ? (
                    shoppingCart.products.length ? (
                        <>
                            {shoppingCart.products.map((cartProduct) => {
                                return (
                                    // <p key={cartProduct.id}>{cartProduct.product.title} x{cartProduct.quantity}</p>
                                    <Stack
                                        className="border-bottom"
                                        key={cartProduct.id}
                                        direction="horizontal"
                                        gap={1}
                                    >
                                        <p className="p-2">{cartProduct.product.title}</p>
                                        {/* <div className="vr" /> */}
                                        <p className="p-2">x{cartProduct.quantity}</p>
                                        <Button className="mx-0 px-0" variant="link" size="sm">
                                            <img
                                                src={addIcon}
                                                className="p-2"
                                                onClick={(e) => {
                                                    handleAdd(cartProduct.id, cartProduct.quantity);
                                                }}
                                            />
                                        </Button>
                                        <Button className="mx-0 px-0" variant="link" size="sm">
                                            <img
                                                src={subtractIcon}
                                                className="p-2"
                                                onClick={(e) => {
                                                    handleSubtract(cartProduct.id, cartProduct.quantity);
                                                }}
                                            />
                                        </Button>
                                        <Button className="mx-0 px-0" variant="link" size="sm">
                                            <img
                                                src={trashCan}
                                                className="p-2"
                                                onClick={(e) => {
                                                    handleDelete(cartProduct.id);
                                                }}
                                            />
                                        </Button>
                                        <p className="p-2 ms-auto">
                                            $
                                            {(cartProduct.product.price * cartProduct.quantity) / 100}
                                        </p>
                                    </Stack>
                                );
                            })}
                            <Stack direction="horizontal" gap={1}>
                                <p className="p-2">Subtotal: </p>
                                <p className="p-2 ms-auto">
                                    ${Math.ceil(totalPrice * 100) / 100}
                                </p>
                            </Stack>
                            <Stack direction="horizontal" gap={1}>
                                <p className="p-2">Taxes (7.25%): </p>
                                <p className="p-2 ms-auto">
                                    ${Math.ceil(totalPrice * 0.0725 * 100) / 100}
                                </p>
                            </Stack>
                            <Stack direction="horizontal" gap={1}>
                                <p className="p-2">Total: </p>
                                <p className="p-2 ms-auto">
                                    ${Math.ceil(totalPrice * 1.0725 * 100) / 100}
                                </p>
                            </Stack>
                            <Stack className="mx-auto col-md-5">
                                {token ?
                                    <Button className="site-button" onClick={() => {
                                        handleCheckout();
                                    }}>Checkout</Button>
                                    :
                                    <Link to="/login">
                                        <Button className="site-button" onClick={() => {
                                            setCanvas(false);
                                        }}>Please sign in</Button>
                                    </Link>
                                }
                            </Stack>
                        </>
                    ) : (
                        <h4>Nothing in your cart!</h4>
                    )
                ) : (
                    <h4>Nothing in your cart!</h4>
                )
            ) : (
                <h4>Nothing in your cart!</h4>
            )}
        </div>
    );
};

export default ShoppingCart;
