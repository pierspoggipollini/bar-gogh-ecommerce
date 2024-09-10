import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useLocation, useNavigate } from "react-router";
/* import { fetchProducts } from "../../store/products"; */
import { Products } from "./Products";
import { AnimatePresence, motion } from "framer-motion";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { LoaderCategory } from "./LoaderCategory";
import { useProducts } from "../../ReactQuery/useProducts";
import Breadcrumb from "../../BreadCrumb";

 const CategoryFilter = () => {
  /* const products = useSelector((state) => state.products); */

  const { isLoading, error, data: products } = useProducts();


  if (error)
    console.log("An error occurred while fetching the user data ", error);

  const categories = products?.map((product) => product.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  /*  const isLoading = !categories || categories.length === 0; */

  const uniqueCategory = useMemo(() => {
    if (categories) {
      const flattenedCat = categories.flat();
      const uniqueCategories = [...new Set(flattenedCat)];

      // Mappa ciascun nome per impostare la prima lettera maiuscola
      const capitalizedCategories = uniqueCategories.map((category) => {
        return category.charAt(0).toUpperCase() + category.slice(1);
      });

      return capitalizedCategories;
    }

    return [];
  }, [categories]);

  const [selectedCategory, setSelectedCategory] = useState("all");

  // Define a callback function to handle category clicks
  const handleCategoryClick = useCallback(
    (category) => {
      setSelectedCategory(category); // Set the selected category
      navigate(`/products/category/${category}`); // Navigate to the selected category page
    },
    [setSelectedCategory, navigate],
  );

  const underlineHover = `after:content-[""] after:absolute after:w-full after:h-1.5 after:rounded-tl-lg after:rounded-tr-lg after:rounded-br-none after:rounded-bl-none after:bg-primary-btn after:bottom-[-1px] after:left-0 after:hover:transition-transform after:hover:duration-500 after:scale-x-0 after:origin-right after:hover:scale-x-100 after:hover:origin-left hover:opacity-100`;
  const underlineEffect = `after:content-[""] after:absolute after:w-full after:h-1.5 after:rounded-tl-lg after:rounded-tr-lg after:rounded-br-none after:rounded-bl-none  after:bg-primary-btn after:bottom-[-1px] after:left-0 after:origin-left after:transition-none after:duration-500 after:scale-x-100   `;

  const color = "#FEB562";



  // Add logic to set the selected category and activate the underline effect
  useEffect(() => {
    const categoryName = location.pathname
      .replace("/products/category/", "")
      .replace(/\/$/, "");

    // Capitalize the first letter of the category name
    const capitalizedCategoryName =
      categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    // Map each name to set the first letter to uppercase
    if (uniqueCategory.includes(capitalizedCategoryName)) {
      setSelectedCategory(categoryName); // Keep categoryName as it is
    } else {
      setSelectedCategory("all");
    }
  }, [location.pathname, uniqueCategory]);

  /*   useEffect(() => {
    window.scrollTo(0, 0);
  }, []); */

  return (
    <>
      {/*  Show Categories */}
      {isLoading ? (
        <LoaderCategory color={{ color }} />
      ) : (
        <>
          <div className=" pt-4 md:hidden">
            <Breadcrumb />
          </div>
          <div className=" md:my-14 mx-3 flex md:justify-center">
            <ul className="hidden bg-slate-200 rounded-[2.5rem] shadow-lg px-8 max-w-[50rem] cursor-pointer gap-6 md:flex ">
              <li
                key="all"
                onClick={() => handleCategoryClick("all")}
                role="tab"
                aria-selected={selectedCategory === "all"}
                className={`
                relative 
                ${underlineHover} 
                ${
                  selectedCategory === "all"
                    ? underlineEffect + " opacity-100"
                    : "opacity-60"
                }
                text-lg rounded-[2.5rem] px-2 py-4 text-primary-black 
              `}
              >
                All
              </li>
              {uniqueCategory.map((category) => (
                <li
                  key={category.toLowerCase()}
                  onClick={() => handleCategoryClick(category.toLowerCase())}
                  role="tab"
                  aria-selected={selectedCategory === category.toLowerCase()}
                  className={`
                  relative
                  ${underlineHover} 
                   bg-slate-200 rounded-[2.5rem] text-primary-black 
                  mx-1 text-lg max-w-32  px-2 py-4
                  ${
                    selectedCategory === category.toLowerCase()
                      ? underlineEffect + " opacity-100"
                      : "opacity-60"
                  }
                `}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {/*  Show Products */}
      <div
        role="tabpanel"
        hidden={!selectedCategory}
        id={`tab-${selectedCategory}`}
        aria-label={`tab-${selectedCategory}`}
        className="my-10 mx-2 lg:mt-0"
      >
        {selectedCategory && (
          <AnimatePresence>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="z-0"
            >
              <Products
                products={products}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}

export default CategoryFilter;
/* useCallback viene utilizzato per ottimizzare le prestazioni 
della funzione handleCategoryClick, 
che viene passata come callback al componente li. 
Senza useCallback, ogni volta che la componente viene renderizzata, 
una nuova istanza di handleCategoryClick verrebbe creata, 
comportando la riallocazione di memoria e la riduzione delle prestazioni. 
Utilizzando useCallback, invece, la funzione viene memorizzata nella cache di React
e verrà restituita ogni volta che viene richiesta.

Inoltre, useMemo viene utilizzato per memorizzare l'array univoco di categorie, 
evitando di ricalcolarlo ad ogni renderizzazione. 
Questa tecnica aiuta a migliorare le prestazioni dell'applicazione, 
poiché il calcolo di uniqueCategory è una operazione costosa 
in termini di tempo di elaborazione, specialmente se l'array di categories è grande. */
