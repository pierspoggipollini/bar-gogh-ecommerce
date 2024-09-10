import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardProduct } from "../Card/CardProduct";
import { useNavigate, useParams } from "react-router-dom";
import { SkeletonCardProduct } from "../Card/SkeletonCardProduct";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";

export const Products = ({ products, isLoading }) => {
  const navigate = useNavigate();
  const params = useParams();
  const formatAmount = useCurrencyFormatter();
  /*  const { isLoading, error, data: products } = useProducts(); */

  /*   if (error)
    console.log("An error occurred while fetching the user data ", error); */

  // Extract the selected category from the params
  const categoryFromParams = params?.selectedCategory;

  // Extract the list of categories from the products
  const categories = products?.map((product) => product.category);

  // Use useMemo to create a list of unique categories for better performance
  const uniqueCategory = useMemo(() => {
    if (categories) {
      // Flatten the array of categories in case they are nested arrays
      const flattenedCat = categories.flat();
      // Create a set to remove duplicates and then convert it back to an array
      const uniqueCategories = [...new Set(flattenedCat)];
      return uniqueCategories;
    }

    // Return an empty array if categories are not defined
    return [];
  }, [categories]);

  // Filter the products based on the selected category
  const filteredProducts =
    categoryFromParams !== null && // Check if categoryFromParams is not null
    categoryFromParams !== undefined && // Check if categoryFromParams is not undefined
    uniqueCategory.includes(categoryFromParams) // Check if the selected category exists in uniqueCategory
      ? products.filter(
          (product) => product.category.includes(categoryFromParams), // Filter products that include the selected category
        )
      : products; // Return all products if no category is selected or if it doesn't exist

  /*   useEffect(() => {
    const cachedData = localStorage.getItem("products");
    if (cachedData) {
      dispatch(fetchProducts.fulfilled(JSON.parse(cachedData))); // Dispaccia l'azione con i dati dalla cache
    } else {
      dispatch(fetchProducts()); // Se non presenti in cache, chiama l'API
    }
  }, []); */

  return (
    <>
      <div
        className=" px-4 grid grid-cols-1 xs:grid-cols-2 gap-4 
      place-items-center md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5"
      >
        {isLoading ? (
          [...Array(18)].map((_, index) => (
            <React.Fragment key={index}>
              <SkeletonCardProduct />
            </React.Fragment>
          ))
        ) : (
          <>
            {filteredProducts?.map((product) => (
              <React.Fragment key={product.id}>
                <CardProduct
                  Title={product.title}
                  Price={formatAmount(product.price)}
                  Image={product.image[0]}
                  Rating={product.rating}
                  Description={product.description}
                  wishlistItems={product}
                  handleClick={(e) => {
                    e.preventDefault();
                    navigate(`/products/${product.id}`);
                  }}
                  id={product.id}
                  products={product}
                  quantity={1}
                />
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </>
  );
};
