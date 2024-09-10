import React, { useState } from "react";
import { TabPanel } from "../Carousel/TabPanel";"react-redux";
/* import { fetchProducts } from "../store/products"; */
import { CardProduct } from "../Card/CardProduct";
import { useNavigate } from "react-router";
import {  NavLink } from "react-router-dom";
import { useProducts } from "./ProductFiltered/ReactQuery/fetchProducts";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";


export const CategoriesTab = () => {
  /*   const products = useSelector((state) => state.products);
  const categories = products.products.map((product) => product.category); */

  // Fetch products data using useProducts hook
  const { isLoading, error, data: products } = useProducts();

  // Custom hook for formatting currency amounts
  const formatAmount = useCurrencyFormatter();

  // Extract categories from products data
  const categories = products.map((product) => product.category);

  // Navigation hook from React Router
  const navigate = useNavigate();

  // Flatten and get unique categories
  const flattenedCat = categories.flat();
  const uniqueCategory = [...new Set(flattenedCat)];

  // State to keep track of the selected category
  const [selectedCategory, setSelectedCategory] = useState(0);

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory !== null && selectedCategory !== undefined
      ? products.products.filter((product) =>
          product.category.includes(uniqueCategory[selectedCategory]),
        )
      : [];

  // Generate tabs data based on unique categories
  const tabsList = uniqueCategory.map((category, index) => ({
    label: category,
    value: index,
    component: (
      <>
        {/* Render filtered products here */}
        {filteredProducts.map((product) => (
          <div key={product.id} className="max-w-[20rem]">
            <CardProduct
              Title={product.title}
              Price={formatAmount(product.price)}
              Image={product.image[0]}
              Rating={product.rating}
              Description={product.description}
              wishlistItems={product}
              handleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                navigate(`${product.id}`);
              }}
              id={product.id}
              products={product}
              quantity={1}
            />
          </div>
        ))}
      </>
    ),
  }));

  return (
    <>
      <div className="my-5 flex justify-center gap-5">
        <div
          aria-label="product-tabs"
          role="tablist"
          className={`fixed z-50 mb-4 flex h-16 w-full  items-center justify-center text-slate-100`}
        >
          {tabsList.map((tab) => (
            <NavLink
              key={tab.value}
              to={`${location.pathname}/${uniqueCategory[tab.value]}`} // Modifica l'URL in base alla categoria selezionata
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(tab.value);
              }}
              role="tab"
              aria-selected={selectedCategory === tab.value}
              className={` grid place-items-center px-4 py-1 text-base text-slate-100 ease-in lg:text-xl ${
                selectedCategory === tab.value ? " opacity-100" : "opacity-60"
              }`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      {tabsList.map((tab) => (
        <TabPanel key={tab.value} index={tab.value} value={selectedCategory}>
          {isLoading && <div className="text-slate-100">Loading...</div>}
          {!isLoading && error ? (
            <div className="text-slate-100">Error: {error}</div>
          ) : null}
          {!isLoading && products.products.length ? (
            <div className=" my-24 mx-2 grid place-items-center gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tab.component}
            </div>
          ) : !isLoading ? (
            <div className="text-slate-100">No products available</div> // Messaggio di fallback per dati vuoti
          ) : null}
        </TabPanel>
      ))}
    </>
  );
};
