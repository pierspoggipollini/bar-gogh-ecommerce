import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton} from "@mui/material";
import { useProductsDetails } from "../../ReactQuery/useProductDetails";
import { ProductDetailsContainer } from "./ProductDetailsContainer";

// ErrorMessage component to display any errors
const ErrorMessage = () => (
  <div className="text-slate-100 my-14" role="alert">
    Error: {"An unexpected error occurred"}
  </div>
);

// ProductDetails component
const ProductDetails = () => {
  const [show, setShow] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { id } = useParams(); // Get the product id from the URL using react-router-dom's useParams()

  const isBigScreen = window.matchMedia("(min-width: 1024px)").matches;

  // Fetch product details using a custom hook
  const { isLoading, error, data: productDetails } = useProductsDetails(id);

  const [wishlistMessage, setWishlistMessage] = useState(false);

  const [isAdded, setIsAdded] = useState(false);

  // Callback function for handling button clicks
  const handleButtonClicked = (value) => {
    // Receive the value from ButtonComponent when the button is clicked
    setIsAdded(value);
  };

  // Callback function for handling wishlist button clicks
  const handleWishlistButtonClicked = (value) => {
    setWishlistMessage(value);
  };

  // Ref to keep track of the previous "added" state
  const prevIsAddedRef = useRef(isAdded);

  const isLoadingSkeleton = (
    <div className="mx-2 my-14 grid grid-cols-1  md:h-[600px]  md:grid-cols-2">
      {[...Array(1)].map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex justify-center">
            {isBigScreen ? (
              <Skeleton
                variant="rectangular"
                width={350}
                height={450}
                animation="wave"
                aria-busy="true"
                aria-live="assertive"
              />
            ) : (
              <Skeleton
                variant="rectangular"
                width={240}
                height={300}
                animation="wave"
                aria-busy="true"
                aria-live="assertive"
              />
            )}
          </div>

          <div className="mx-6 mt-9 lg:mt-0">
            <Skeleton
              variant="text"
              height={30}
              sx={{ fontSize: "24px" }}
              animation="wave"
              aria-busy="true"
              aria-live="assertive"
            />

            <Skeleton
              variant="text"
              width={100}
              height={30}
              sx={{ fontSize: "18px" }}
              animation="wave"
              aria-busy="true"
              aria-live="assertive"
            />

            <Skeleton
              variant="text"
              width={150}
              height={40}
              animation="wave"
              aria-busy="true"
              aria-live="assertive"
            />

            {isBigScreen ? (
              <Skeleton
                variant="text"
                height={40}
                sx={{ fontSize: "14px" }}
                animation="wave"
                aria-busy="true"
                aria-live="assertive"
              />
            ) : (
              <Skeleton
                variant="text"
                height={60}
                sx={{ fontSize: "14px" }}
                animation="wave"
                aria-busy="true"
                aria-live="assertive"
              />
            )}

            <Skeleton
              variant="rounded"
              width={90}
              height={40}
              animation="wave"
              aria-busy="true"
              aria-live="assertive"
            />

            <div className="my-2 flex items-center gap-5">
              <Skeleton
                variant="text"
                width={96}
                height={100}
                sx={{ fontSize: "14px" }}
                animation="wave"
                aria-busy="true"
                aria-live="assertive"
              />

              <Skeleton
                variant="rounded"
                width={208}
                height={56}
                animation="wave"
                aria-busy="true"
                aria-live="assertive"
              />
            </div>
            <div>
              <Skeleton
                variant="text"
                width={200}
                height={45}
                sx={{ fontSize: "14px" }}
                animation="wave"
                aria-busy="true"
                aria-live="assertive"
              />
              <div className="mt-5">
                <Skeleton
                  variant="text"
                  width={250}
                  height={30}
                  sx={{ fontSize: "14px" }}
                  animation="wave"
                  aria-busy="true"
                  aria-live="assertive"
                />
              </div>
            </div>
            <div className="mt-5 max-w-full md:w-4/6">
              <Skeleton
                variant="text"
                height={100}
                sx={{ fontSize: "14px" }}
                animation="wave"
                aria-busy="true"
                aria-live="assertive"
              />
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      {/* Loading skeleton UI when data is still loading */}
      {isLoading && isLoadingSkeleton}

      {/* Display error message if there's an error */}
      {!isLoading && error && <ErrorMessage  />}
      
      {/* Display product details if available */}
      {!isLoading && !error && productDetails && (
        <div className="mx-3 my-14 grid max-w-full grid-cols-1 gap-10 md:my-14 md:grid-cols-2  lg:h-full">
          <ProductDetailsContainer
            key={productDetails.id}
            product={productDetails}
            selectedQuantity={selectedQuantity}
            onChangeQty={(e) => {
              setSelectedQuantity(parseInt(e.target.value));
            }}
            onClickIngredients={() => setShow(!show)}
            handleButtonClicked={handleButtonClicked}
            handleWishlistButtonClicked={handleWishlistButtonClicked}
            isAdded={isAdded}
            wishlistMessage={wishlistMessage}
            show={show}
            prevIsAddedRef={prevIsAddedRef}
            onNotificationRemove={() => setIsAdded(false)}
          />
        </div>
      )}
    </>
  );
};

export default ProductDetails;