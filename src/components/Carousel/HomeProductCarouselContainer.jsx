import React, { useEffect, useRef } from "react";
import { CardProduct } from "../Card/CardProduct";
import { useNavigate } from "react-router";
import { SkeletonCardProduct } from "../Card/SkeletonCardProduct";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";

export const HomeProductCarouselContainer = ({ isLoading, products }) => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const formatAmount = useCurrencyFormatter();

  const breakpoints = {
    375: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
    768: {
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
    1920: {
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
  };

  useEffect(() => {
    const swiperEl = swiperRef.current;
    const swiperParams = {
      navigation: true,
      pagination: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      spaceBetween: 20,
      breakpoints: breakpoints,
      injectStyles: [
        `
        .swiper-container {
          width: 100%;
          height: 100%;
        }
        .swiper-wrapper {
          margin-bottom: 3rem;
        }
        .swiper-button-next,
        .swiper-button-prev {
          display: none;
        }
        .swiper-pagination-bullet {
          background-color: hsl(33 41% 86%);
        }
        `,
      ],
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    swiperEl.initialize();
  }, [swiperRef, breakpoints]);

  return (
    <div>
      <swiper-container ref={swiperRef} init="false">
        {isLoading ? (
          [...Array(4)].map((_, index) => (
            <swiper-slide key={index}>
              <SkeletonCardProduct />
            </swiper-slide>
          ))
        ) : (
          <>
            {products?.map((product) => (
              <swiper-slide key={product.id}>
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
              </swiper-slide>
            ))}
          </>
        )}
      </swiper-container>
    </div>
  );
};
