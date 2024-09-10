import express from 'express';
import { getProducts } from './getProducts.js';
import { getProductById } from './getProductById.js';
import { getBestsellersProducts } from './getBestsellersProducts.js';
import { getLatestsProducts } from './getLatestsProducts.js';
import { getAvailableQuantity } from './getAvailableQuantity.js';
import { getSearchProducts } from './getSearchProducts.js';

const productsRouter = express.Router();

// Route to fetch all products
productsRouter.get('/', getProducts);

// Route to search products by name
productsRouter.get('/search', getSearchProducts);

// Route to fetch bestseller products
productsRouter.get('/bestsellers', getBestsellersProducts);

// Route to fetch latest products
productsRouter.get('/latests', getLatestsProducts);

// Route to fetch a specific product by ID
productsRouter.get('/:id', getProductById);

// Route to fetch available quantity of a product by ID
productsRouter.get('/availableQuantity/:id', getAvailableQuantity);



export { productsRouter };