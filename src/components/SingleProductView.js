import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { singleProductIdAtom, singleProductAtom } from "../atoms";
import { getSingleProduct } from "../axios-services";

const SingleProductView = () => {
    const [singleProductId, setSingleProductId] = useAtom(singleProductIdAtom);
    const [singleProduct, setSingleProduct] = useAtom(singleProductAtom);
    console.log("this is the single product view")
    useEffect(() => {
        const storedProductId = localStorage.getItem("singleProductId");
        if (storedProductId) {
            async function fetchProduct() {
                const productData = await getSingleProduct({ productId: storedProductId });
                setSingleProduct(productData);
            }
            fetchProduct();
        }
    }, [])

    return (
        <div id="single-product-page">
            {singleProduct.id ?
                <>
                    <h1>{singleProduct.title}</h1>
                </> : <h1>Single Product View</h1>
            }
        </div>
    )
}

export default SingleProductView;
