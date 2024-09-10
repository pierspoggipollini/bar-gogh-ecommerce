import React, { useMemo } from "react";
import "./custom-swiper-carousel.css";
import { HomeProductCarouselContainer } from "./HomeProductCarouselContainer";
import { useLatestProducts } from "../../ReactQuery/useLatestsProducts";

export const LatestViewer = () => {
  // Fetch product details using a custom hook
  const { isLoading, error, data: latests } = useLatestProducts();
  // Memoize the result of the useProductsDetails call as long as the id doesn't change
  const memoizedLatestsProducts = useMemo(() => {
    return latests;
  }, [latests]);

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
        products={memoizedLatestsProducts}
      />
    </>
  );
};
