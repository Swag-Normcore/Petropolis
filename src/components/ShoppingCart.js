import React from "react";
import { shoppingCartAtom } from "../atoms"
import { useAtom } from "jotai";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button"
import addIcon from "../images/plus-circle.svg"
import subtractIcon from "../images/dash-circle.svg"
import trashCan from "../images/trash-fill.svg";
import { removeProductFromShoppingCart, updateShoppingCartProductQuantity } from "../axios-services";

const ShoppingCart = () => {
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
    let totalPrice = 0;
    shoppingCart.products.forEach((cartProduct) => {
        totalPrice += cartProduct.quantity * cartProduct.product.price / 100;
    });
    async function handleDelete(cartProductId) {
        console.log("trying to delete...");
        const result = await removeProductFromShoppingCart({ shoppingId: shoppingCart.id, cartProductId });
        if (result) {
            setShoppingCart(result);
        }
    }
    async function handleAdd(cartProductId, quantity) {
        console.log("trying to add...");
        const result = await updateShoppingCartProductQuantity({ shoppingId: shoppingCart.id, cartProductId, quantity: quantity + 1 });
        if (result) {
            setShoppingCart(result);
        }
    }
    async function handleSubtract(cartProductId, quantity) {
        console.log("trying to subtract...");
        if (quantity === 0) {
            const result = await removeProductFromShoppingCart({ shoppingId: shoppingCart.id, cartProductId });
            if (result) {
                setShoppingCart(result);
            }
        } else {
            const result = await updateShoppingCartProductQuantity({ shoppingId: shoppingCart.id, cartProductId, quantity: quantity - 1 });
            if (result) {
                setShoppingCart(result);
            }
        }
    }
    return (
        <div>
            {
                shoppingCart.products.length ?
                    <>
                        {shoppingCart.products.map((cartProduct) => {
                            return (
                                // <p key={cartProduct.id}>{cartProduct.product.title} x{cartProduct.quantity}</p>
                                <Stack className="border-bottom" key={cartProduct.id} direction="horizontal" gap={1}>
                                    <p className="p-2">{cartProduct.product.title}</p>
                                    {/* <div className="vr" /> */}
                                    <p className="p-2">x{cartProduct.quantity}</p>
                                    <Button className="mx-0 px-0" variant="link" size="sm">
                                        <img src={addIcon} className="p-2" onClick={(e) => {
                                            handleAdd(cartProduct.id, cartProduct.quantity);
                                        }} />
                                    </Button>
                                    <Button className="mx-0 px-0" variant="link" size="sm">
                                        <img src={subtractIcon} className="p-2" onClick={(e) => {
                                            handleSubtract(cartProduct.id, cartProduct.quantity);
                                        }} />
                                    </Button>
                                    <Button className="mx-0 px-0" variant="link" size="sm">
                                        <img src={trashCan} className="p-2" onClick={(e) => {
                                            handleDelete(cartProduct.id);
                                        }} />
                                    </Button>
                                    <p className="p-2 ms-auto">${cartProduct.product.price * cartProduct.quantity / 100}</p>
                                </Stack>
                            )
                        })}
                        <Stack direction="horizontal" gap={1}>
                            <p className="p-2">Subtotal: </p>
                            <p className="p-2 ms-auto">${Math.ceil(totalPrice * 100) / 100}</p>
                        </Stack>
                        <Stack direction="horizontal" gap={1}>
                            <p className="p-2">Taxes: </p>
                            <p className="p-2 ms-auto">${Math.ceil((totalPrice * 0.07) * 100) / 100}</p>
                        </Stack>
                        <Stack direction="horizontal" gap={1}>
                            <p className="p-2">Total: </p>
                            <p className="p-2 ms-auto">${Math.ceil((totalPrice * 1.07) * 100) / 100}</p>
                        </Stack>
                        <Stack className="mx-auto">
                            <Button>Checkout</Button>
                        </Stack>
                    </> : <h4>Nothing in your cart!</h4>
            }
        </div>
    )
}

export default ShoppingCart;
