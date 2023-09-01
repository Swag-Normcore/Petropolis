import { atom } from "jotai";

export const counterAtom = atom(0);

export const tokenAtom = atom(null);

export const adminAtom = atom(true);

export const userAtom = atom({});

export const productsAtom = atom([]);

export const singleProductIdAtom = atom(null);

export const singleProductAtom = atom({});

export const productImagesAtom = atom([]);

export const categoriesAtom = atom([]);

export const favoritesAtom = atom([]);

export const ordersAtom = atom([]);

export const shoppingCartAtom = atom([]);

export const cartProductsAtom = atom([]);

export const canvasAtom = atom(false);

export const apiHealthAtom = atom("");
