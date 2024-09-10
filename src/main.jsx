import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientWrapper } from "./ReactQuery/QueryClientWrapper";
import axios from "axios";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { persistor, store } from "./rootReducer";
import { Loader } from "./components/Loader/Loader";


// register Swiper custom elements
register()

//configures Axios to include credentials (like cookies, authorization headers, etc.) in cross-origin requests. This is essential for making authenticated requests in applications where sessions or user authentication need to be maintained across different domains or subdomains.
axios.defaults.withCredentials = true;


// Render the React application root using ReactDOM.createRoot().
ReactDOM.createRoot(document.getElementById("root")).render(
  // Wrap the entire application in React.StrictMode for additional development mode checks.
  <React.StrictMode>
    {/* 
      Provide the Redux store to the entire application using Provider from react-redux.
      This allows components to access the global Redux state.
    */}
    <Provider store={store}>
      {/* 
        PersistGate delays the rendering of the application until persisted state has been retrieved
        and saved to Redux. It shows a loading indicator during this process.
      */}
      <PersistGate
        loading={
          <Loader
            text="Please wait while we load your content."
            secondText={"This may take a few moments."}
            loaderClass="coffee"
          />
        }
        persistor={persistor} // Provide the persistor which manages state persistence.
      >
        {/* 
          QueryClientWrapper wraps the application with React Query's QueryClientProvider
          to provide the query client instance to the entire application.
        */}
        <QueryClientWrapper>
          {/* 
            Render the main App component wrapped with React Router's RouterProvider,
            which provides the configured router instance to the application.
          */}
          <App />
        </QueryClientWrapper>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

