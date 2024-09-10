import React, { lazy, Suspense, useEffect } from "react";
import { Routes } from "react-router";
import { Navigate, Outlet, Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import MessageProvider from "./components/Dashboard/Message/MessageProvider";
import { Loader } from "./components/Loader/Loader";
import { fetchLocation } from "./store/shippingData";
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./Fallback";

// Lazy-loaded components imported using React's lazy and import statements
const FormSignUp = lazy(() => import("./components/Form/FormSignUp"));
const FormLogin = lazy(() => import("./components/Form/FormLogin"));
const ForgotPassword = lazy(() => import("./components/Form/ForgotPassword"));
const DefaultLayout = lazy(() => import("./components/Layout/DefaultLayout"));
const AuthLayout = lazy(() => import("./components/Layout/AuthLayout"));
const NotFound = lazy(() => import("./components/Pages/NotFound"));
const ProductDetails = lazy(
  () => import("./components/DetailsProducts/ProductDetails"),
);
const CategoryFilter = lazy(
  () => import("./components/ProductFiltered/CategoryFilter"),
);
const Cart = lazy(() => import("./components/Cart/Cart"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const ShipForm = lazy(
  () => import("./components/Dashboard/Address/Ship/ShipForm"),
);
const ShipFormProvider = lazy(
  () => import("./components/Dashboard/Address/Ship/ShipFormProvider"),
);
const ErrorTokenExpires = lazy(() => import("./components/ErrorTokenExpires"));
const PrivacyPolicyPage = lazy(
  () => import("./components/Pages/PrivacyPolicyPage"),
);
const ConditionsPage = lazy(() => import("./components/Pages/ConditionsPage"));
const AboutUs = lazy(() => import("./components/Pages/AboutUs"));
const Contacts = lazy(() => import("./components/Pages/Contacts"));

const Dashboard = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./components/Dashboard/Dashboard")), 800); // Aggiungi un ritardo di 1000 millisecondi (1 secondo)
  });
});

const EditShipForm = lazy(
  () => import("./components/Dashboard/Address/EditShip/EditShipForm"),
);
const SavePaymentForm = lazy(
  () => import("./components/Dashboard/Payment/SavePaymentForm"),
);
const CardFormRoute = lazy(
  () => import("./components/Dashboard/Payment/CardFormRoute"),
);
const Checkout = lazy(() => import("./components/Checkout/Checkout"));
const CheckoutShipForm = lazy(
  () => import("./components/Checkout/Ship/HomeDelivery/CheckoutShipForm"),
);
const CheckoutEditShip = lazy(
  () => import("./components/Checkout/Ship/HomeDelivery/CheckoutEditShip"),
);
const OrderConfirmation = lazy(
  () => import("./components/Checkout/OrdersConfirmation/OrderConfirmation"),
);
const Order = lazy(() => import("./components/Dashboard/Orders/Order"));
const Home = lazy(() => import("./components/Pages/Home/Home"));

// Create a single route for all unmatched paths, rendering Root component
const router = createBrowserRouter([{ path: "*", element: <Root /> }]);

// App component exporting RouterProvider with the configured router
export default function App() {
  return <RouterProvider router={router} />;
}
function Root() {
  // Get the country state from Redux store
  const country = useSelector((state) => state.shippingData.country);
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to set the zoom to 1 (100%) when the window is loaded
    const handleLoad = () => {
      document.documentElement.style.zoom = 1;
    };

    // Add an event listener for the 'load' event of the window
    window.addEventListener("load", handleLoad);

    // Clean up: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Effect to fetch location only if country is not already present
  useEffect(() => {
    if (!country) {
      dispatch(fetchLocation()); // Dispatch action to fetch location
    } else {
      return; // Do nothing if country is already fetched
    }
  }, [country]); // Dependency of the effect: execute only if country changes

  // Render the Root component
  return (
    <div>
      {/* Error Boundary to catch errors in the entire app */}
      <ErrorBoundary
        FallbackComponent={Fallback}
        onError={(error, errorInfo) => console.log(error, errorInfo)}
      >
        {/* Fallback component during loading */}
        <Suspense
          fallback={
            <Loader
              text="Please wait while we load your content."
              secondText={"This may take a few moments."}
              loaderClass="coffee"
            />
          }
        >
          {/* Global components to include on every page */}
          <ErrorTokenExpires />
          <ScrollToTop />

          {/* Route configuration */}
          <Routes>
            {/* Redirect to home if accessing "/" */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Default layout for the home page and its nested routes */}
            <Route path="/home" element={<DefaultLayout />}>
              <Route index element={<Home />} />
              <Route path="bestseller/:id" element={<ProductDetails />} />
              <Route path="latest/:id" element={<ProductDetails />} />
            </Route>

            {/* Routes for static pages with default layout */}
            <Route path="/about-us" element={<DefaultLayout />}>
              <Route index element={<AboutUs />} />
            </Route>
            <Route path="/contacts" element={<DefaultLayout />}>
              <Route index element={<Contacts />} />
            </Route>
            <Route path="/privacy-policy" element={<DefaultLayout />}>
              <Route index element={<PrivacyPolicyPage />} />
            </Route>
            <Route path="/conditions" element={<DefaultLayout />}>
              <Route index element={<ConditionsPage />} />
            </Route>

            {/* Routes related to products with default layout */}
            <Route path="products" element={<DefaultLayout />}>
              <Route index element={<CategoryFilter />} />
              <Route
                path="category"
                element={<CategoryFilter />}
              />
              <Route
                path="category/:selectedCategory"
                element={<CategoryFilter />}
              />
              <Route
                path=":selectedCategory/:id"
                element={<ProductDetails />}
              />
              <Route path=":id" element={<ProductDetails />} />
            </Route>

            {/* Route for cart with default layout */}
            <Route path="cart" element={<DefaultLayout />}>
              <Route index element={<Cart />} />
            </Route>

            {/* Route for checkout with protected route */}
            <Route path="checkout" element={<ProtectedRoute />}>
              <Route index element={<Checkout />} />
            </Route>

            {/* Route for order confirmation with protected route */}
            <Route path="/confirmation/:id" element={<ProtectedRoute />}>
              <Route index element={<OrderConfirmation />} />
            </Route>

            {/* Routes related to delivery and address book with protected route */}
            <Route path="delivery/address-book" element={<ProtectedRoute />}>
              <Route
                path="add"
                element={
                  <ShipFormProvider>
                    <CheckoutShipForm />
                  </ShipFormProvider>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ShipFormProvider>
                    <CheckoutEditShip />
                  </ShipFormProvider>
                }
              />
            </Route>

            {/* Route for user signup */}
            <Route
              path="signup"
              element={
                <AuthLayout>
                  <FormSignUp />
                </AuthLayout>
              }
            />

            {/* Route for user login */}
            <Route
              path="login"
              element={
                <AuthLayout>
                  <FormLogin />
                </AuthLayout>
              }
            />

            {/* Route for password recovery */}
            <Route
              path="forgotpassword"
              element={
                <AuthLayout>
                  <ForgotPassword />
                </AuthLayout>
              }
            />

            {/* Dashboard component as a layout for nested routes */}
            <Route
              path="/dashboard/"
              element={
                <ProtectedRoute>
                  <DefaultLayout>
                    <Outlet />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <MessageProvider>
                    <Dashboard />
                  </MessageProvider>
                }
              />
              <Route
                path=":linkDashboard"
                element={
                  <ProtectedRoute>
                    <MessageProvider>
                      <Dashboard />
                    </MessageProvider>
                  </ProtectedRoute>
                }
              />
              <Route path="my-orders/:id" element={<Order />} />

              {/* Route for adding address */}
              <Route
                path="addresses/add"
                element={
                  <ProtectedRoute>
                    <ShipFormProvider>
                      <ShipForm />
                    </ShipFormProvider>
                  </ProtectedRoute>
                }
              />

              {/* Route for editing address */}
              <Route
                path="addresses/edit/:id"
                element={
                  <ProtectedRoute>
                    <ShipFormProvider>
                      <EditShipForm />
                    </ShipFormProvider>
                  </ProtectedRoute>
                }
              />

              {/* Route for adding payment methods */}
              <Route
                path="payment-methods/add"
                element={
                  <ProtectedRoute>
                    <SavePaymentForm />
                  </ProtectedRoute>
                }
              />

              {/* Route for adding card payment */}
              <Route
                path="payment-methods/add/card"
                element={
                  <ProtectedRoute>
                    <CardFormRoute />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
