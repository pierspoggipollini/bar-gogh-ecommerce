import React, { useEffect, useState } from "react";
import ReactDOM, { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Close, CloseFullscreen } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../components/images/logo/logo.png"
import * as userAuthActions from "../store/user-auth.js"
import { logout } from "./auth/logout.js";

const Overlay = ({ active }) => {
  return (
    active && (
      <div className="fixed inset-0 z-[5] h-full w-full bg-gradient-to-b from-overlay-start to-overlay-finish"></div>
    )
  );
};

const ErrorTokenExpires = () => {
  const { user, isAuthenticated, error } = useSelector(
    (state) => state.userAuth,
  );
  const dispatch = useDispatch();

  const [active, setActive] = useState(error);

  function resetError() {
    dispatch(userAuthActions.setError(false));
    setActive(false);
    /* navigate("/home") */
  }

  useEffect(() => {
    const performLogout = async () => {
      try {
        if (error && isAuthenticated) {
          await logout(); // Attendi il completamento della funzione logout
          dispatch(logoutUser()); // Chiama l'azione di logout dell'utente
          setActive(true); // Assumi che setActive sia uno stato locale che viene impostato a true
        }
      } catch (error) {
        console.error("Error during logout:", error);
        // Gestisci errori di logout qui, se necessario
      }
    };

    performLogout(); // Chiamare la funzione per eseguire il logout
  }, [error, isAuthenticated, dispatch]); // Dipendenze dell'effetto useEffect

  return createPortal(
    <>
      {active && (
        <div className="fixed inset-0  z-10 flex max-w-full mx-2 items-center justify-center">
          <Overlay active={true} />
          <div className="relative z-10 flex h-auto w-[27rem] items-center justify-center  gap-3  rounded-md bg-gradient-to-tr from-gray-100 to-gray-300 py-8 px-4 shadow-lg">
            <div className="flex w-64 md:w-auto flex-col items-center justify-center gap-2 ">
              <img src={Logo} alt="logo" className="max-h-[4.5rem]" />
              <span className="text-base">{error}</span>
              <span className="text-center text-sm/none leading-relaxed">
                Please log in again to continue using our services.
              </span>
              <NavLink
                className="mt-2 grid h-10 w-24 place-items-center rounded-md bg-primary-btn text-center font-semibold hover:bg-primary-hover"
                to="/login"
                onClick={resetError}
              >
                Login
              </NavLink>

              <div
                onClick={resetError}
                role="close"
                className="absolute right-5 top-5 cursor-pointer"
              >
                <Close fontSize="medium" className="hover:text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
};
 
export default ErrorTokenExpires;