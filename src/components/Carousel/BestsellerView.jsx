import React, { useMemo } from "react";
import { HomeProductCarouselContainer } from "./HomeProductCarouselContainer";
import { useBestsellersProducts } from "../../ReactQuery/useBestsellersProducts";

export const BestsellerView = () => {
  // Fetch product details using a custom hook
  const { isLoading, error, data: bestsellers } = useBestsellersProducts();
  // Memoize the result of the useProductsDetails call as long as the id doesn't change
  const memoizedBestsellersProducts = useMemo(() => {
    return bestsellers;
  }, [bestsellers]);

  // ErrorMessage component per visualizzare eventuali errori
  const ErrorMessage = ({ error }) => (
    <div className="text-slate-100" role="alert">
      Error: {error}
    </div>
  );

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <HomeProductCarouselContainer
        isLoading={isLoading}
        products={memoizedBestsellersProducts}
      />
    </>
  );
};
