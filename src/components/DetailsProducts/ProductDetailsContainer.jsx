import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import React, { useEffect, useRef } from "react";
import { itemVariantsFooter, variantFooter } from "../utilities/variants";
import { AnimatePresence, motion } from "framer-motion";
import { CartButton, CartNotification } from "../Cart/CartButton/CartButton";
import images from "../images/images";
import { WishlistButton } from "../WishlistButton";
import { RatingStars } from "../RatingStars";
import "swiper/css/effect-cards";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";
import loader from "../../assets/loading.svg";
import { useAvailableQuantity } from "../../ReactQuery/UseAvailableQuantity";
import SelectQty from "../Input/SelectQty";
import { capitalizeFirstLetter } from "../utilities/capitalizeFirstLetter";
// Component for displaying product images in a swiper gallery
const ImageCard = ({ imagesProduct }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiperEl = swiperRef.current;
    const swiperParams = {
      effect: "cards",
      cardsEffect: {
        // added
        perSlideOffset: 1, // added(slide gap(px)
        perSlideRotate: 10, // added(Rotation angle of second and subsequent slides
        rotate: true, // added(Rotation presence of second and subsequent slides(true/false)
        slideShadows: true, // added(Shadow presence of second and subsequent slides(true/false)
      }, // added
      grabCursor: true,

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
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
  }, [swiperRef]);

  return (
    <swiper-container
      ref={swiperRef}
      init="false"
      class=" overflow-visible w-[300px] h-[300px] md:w-[300px] md:h-[400px]"
      /*  style={
        isBigScreen
          ? { width: "300px", height: "400px" }
          : { width: "240px", height: "340px" }
      } */
    >
      {imagesProduct.map((image, index) => (
        <swiper-slide
          key={index}
          class=" flex justify-center items-center rounded-2xl  "
          style={{
            backgroundColor:
              index % 2 === 0 ? "hsl(33, 41%, 86%)" : "rgb(226 232 240",
          }}
        >
          <img
            src={images[image]}
            alt={`Image ${index}`}
            className="h-full w-full object-contain"
          />
        </swiper-slide>
      ))}
    </swiper-container>
  );
};

export const ProductDetailsContainer = ({
  isAdded,
  handleButtonClicked,
  handleWishlistButtonClicked,
  prevIsAddedRef,
  show,
  selectedQuantity,
  onChangeQty,
  onClickIngredients,
  product,
  onNotificationRemove,
}) => {
  // Line component for visual separation
  const line = (
    <div className="flex my-2 after:w-full after:flex-1 after:flex-shrink-0 after:border-b-slate-400 after:border after:content-['']"></div>
  );

  const formatAmount = useCurrencyFormatter();

  const {
    data: availableQuantity,
    error,
    isError,
    isLoading,
  } = useAvailableQuantity(product.id);

  return (
    <>
      <React.Fragment key={product.id}>
        <>
          <ImageCard imagesProduct={product.image} key={product.id} />
        </>
        <div className=" mx-4 mt-9  flex max-h-[670px] flex-col md:mt-0">
          <div className="grid gap-1 ">
            <h1 className="text-xl font-semibold text-slate-100 lg:text-2xl">
              {product.title}
            </h1>
            <h2 className="text-xl font-semibold text-slate-100">
              {formatAmount(product.price)}
            </h2>
            <div className="mt-1 flex items-center gap-1">
              <RatingStars
                rating={product.rating}
                primary="hsl(33, 41%, 86%)"
              />
              <span className="text-sm text-slate-100">({product.rating})</span>
            </div>
          </div>

          <div className="grid gap-2 mt-5">
            <p
              aria-label="Product Description"
              className="text-[12px] tracking-wide text-slate-100 xs:text-sm md:text-base"
            >
              {product.description}
            </p>
            <p
              aria-label={product.growIn}
              className=" text-xs tracking-wide text-slate-100 "
            >
              Grow in {product.growIn}
            </p>
          </div>
          <span className="mt-5 w-20 cursor-default rounded-full bg-primary py-2 px-2 text-center text-sm">
            500gr
          </span>
          <div className="my-8 flex gap-5">
            <SelectQty
              productId={product.id}
              selectedQuantity={selectedQuantity}
              onChange={onChangeQty}
              colorIcon="hsl(32, 99%, 69%)"
              classNameSelect="text-slate-100"
            />

            {isLoading && <img src={loader} alt="loader" />}

            {!isLoading &&
              (isError ||
                availableQuantity === 0 ||
                availableQuantity === null) && (
                <span className="cursor-not-allowed flex items-center text-sm font-bold text-slate-300 ">
                  Not Available
                </span>
              )}

            {!isLoading &&
              !isError &&
              availableQuantity !== 0 &&
              availableQuantity !== null && (
                <CartButton
                  product={product}
                  quantity={selectedQuantity}
                  onButtonClicked={handleButtonClicked}
                  detailsProductWidth="w-60 sm:w-64"
                />
              )}

            <CartNotification
              title="Article added to cart"
              addItem={isAdded}
              portalRef={prevIsAddedRef}
              onRemove={onNotificationRemove}
            />
          </div>
          <div className="-mt-3 flex items-center   text-slate-100">
            <WishlistButton
              primary="hsl(32, 99%, 69%)"
              secondary="hsl(32, 99%, 69%)"
              product={product}
              label={true}
              onWishlistClicked={handleWishlistButtonClicked}
            />

            {/* <WishlistNotification isAddedToWishlist={wishlistMessage} /> */}
          </div>
          <span className="mt-5 text-xs text-slate-100">
            Free shipping on orders over {formatAmount(50)}.
          </span>
          <div className="max-w-lg mt-4">{line}</div>
          <motion.div initial={false} animate={show ? "open" : "closed"}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              title="Ingredients"
              aria-label="Ingredients"
              role="button"
              onClick={onClickIngredients}
              className="mb-4 py-4 flex w-full max-w-lg cursor-pointer items-center  text-slate-100"
            >
              <span>Ingredients</span>
              <motion.span
                variants={{
                  open: { rotate: 180 },
                  closed: { rotate: 0 },
                }}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.2 }}
                style={{ originY: 0.55 }}
                className={`ml-auto`}
                aria-hidden="true"
              >
                <KeyboardArrowDownOutlined fontSize="large" />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {show === true && (
                <motion.div
                  variants={variantFooter}
                  exit="closed"
                  initial="closed"
                  style={{ pointerEvents: show ? "auto" : "none" }}
                  className="my-2 max-w-lg w-auto h-auto max-h-28"
                  aria-live="polite"
                >
                  {line}
                  <motion.ul
                    className="flex basis-full flex-wrap gap-2"
                    role="list"
                  >
                    {product.ingredients.map((i, index) => (
                      <motion.li
                        variants={itemVariantsFooter}
                        className="text-slate-100"
                        key={i}
                        role="listitem"
                      >
                        {capitalizeFirstLetter(i)}
                        {index < product.ingredients.length - 1 ? ", " : "."}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="text-slate-200 mt-4 text-sm flex flex-col">
              <span>
                Store in a cool place (15-25°C), dry, and away from direct
                sunlight.
              </span>
              <span>Do not consume past the expiration date.</span>
            </div>
          </motion.div>
        </div>
      </React.Fragment>
    </>
  );
};
