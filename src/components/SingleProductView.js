import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { singleProductIdAtom, singleProductAtom, productImagesAtom } from "../atoms";
import { getSingleProduct, getProductImages } from "../axios-services";
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import "../style/SingleProduct.css";

const SingleProductView = () => {
    const [singleProductId, setSingleProductId] = useAtom(singleProductIdAtom);
    const [singleProduct, setSingleProduct] = useAtom(singleProductAtom);
    const [productImages, setProductImages] = useAtom(productImagesAtom);
    let { productId } = useParams();
    console.log(productId)

    // const [index, setIndex] = useState(0);
    // const handleSelect = (selectedIndex) => {
    //     setIndex(selectedIndex);
    // };
    // const style = {
    //     maxWidth: 555,
    //     maxHeight: 229,
    //     margin: 0,
    //     width: 555,
    //     height: 229,
    //     objectFit: 'contain'

    // }


    useEffect(() => {
        async function fetchProduct() {
            const productData = await getSingleProduct({ productId });
            const imagesData = await getProductImages({ productId })
            setSingleProduct(productData);
            setSingleProductId(productId);
            setProductImages(imagesData);
        }
        fetchProduct();
    }, []);

    return (
        <div
            id="single-product-page"
            className="d-flex flex-column align-items-center"
        >
            {singleProduct ?
                <>
                    <div>
                        <Carousel
                            data-bs-theme="dark"
                            interval={null}
                            slide={false}
                            style={{ Height: '500px', Width: "500px" }}
                            className="container"
                        >
                            <Carousel.Item>
                                <img
                                    src={singleProduct.image}
                                    className="object-fit-contain border rounded carousel-img"
                                    height="800px"
                                    width="800px"
                                />
                            </Carousel.Item>
                            {
                                productImages ? productImages.length ?
                                    productImages.map((image, index) => {
                                        return (
                                            <Carousel.Item key={image.id}>
                                                <img
                                                    src={image.imageUrl}
                                                    className="object-fit-contain border rounded carousel-img"
                                                    height="800px"
                                                    width="800px"
                                                />
                                            </Carousel.Item>
                                        )
                                    }) : null : null
                            }
                        </Carousel>
                    </div>
                    <h1>{singleProduct.title}</h1>
                </> : null
            }
        </div>
    )
}

export default SingleProductView;
