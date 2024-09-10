import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { accountVariant, variantsRight } from "../utilities/variants";
import { CloseOutlined } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { NavButtonDesktop } from "./Navbar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useConditionalUserData } from "../../ReactQuery/useUserData";
import { useMedia } from "react-use";
import { logout } from "../auth/logout";
import * as userAuthActions from "../../store/user-auth";
import { revertAll } from "../../store/revertAll";
import icon from "../../assets/loading.svg";

const AccountModal = ({
  openAccount,
  setOpenAccount,
  navProfile,
  isHamburgerOpen,
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.userAuth.isAuthenticated,
  );

  const {
    IsLoading,
    error,
    data: userData,
    refetch,
  } = useConditionalUserData(isAuthenticated);

  const [logoutError, setLogoutlError] = useState("");

  const isSmallScreen = useMedia("(max-width: 768px)");

  const [isLoadingLogout, setIsloadingLogout] = useState(false);

  const handleLogout = async () => {
    setIsloadingLogout(true);
    try {
      await logout();
      dispatch(userAuthActions.activeAuth(false));
      dispatch(userAuthActions.logoutUser());
      dispatch(revertAll());
      /*  await queryClient.invalidateQueries("userData", {
        refetchActive: true,
        refetchInactive: false,
      }); */

      // Clear the timeout to prevent memory leaks when the component unmounts
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Errore durante il logout:", error.message);
      setLogoutlError("An error occurred during logout. Please try later.");
    } finally {
      setIsloadingLogout(false);
    }
  };

  return (
    <AnimatePresence>
      {openAccount && (
        <motion.div
          variants={isSmallScreen ? variantsRight : accountVariant}
          initial="closed"
          exit="closed"
          transition={{ duration: 0.2 }}
          animate={openAccount ? "open" : "closed"}
          className={` ${isHamburgerOpen ? "hidden" : "block"} 
                          absolute -right-[62px] xs:-right-[67px] top-[53px] grid min-w-48 max-w-sm  bg-primary/95 lg:bg-primary  pt-4 pb-6 px-2
                          lg:-right-[17px] lg:top-[50px] md:-right-[78px] md:top-[57px] rounded-b-lg
                          lg:mr-3 lg:rounded-lg lg:border lg:border-slate-600
                          lg:before:absolute lg:before:-top-[7px] lg:before:right-[24px] lg:before:h-3 lg:before:w-3 lg:before:-rotate-45
                          lg:before:border-r lg:before:border-t lg:before:border-t-slate-600 lg:before:border-r-slate-600 lg:before:bg-inherit lg:before:content-['']`}
        >
          {isSmallScreen && (
            <motion.div className="relative bottom-1 mr-2 flex items-center justify-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                role="button"
                aria-label="Close Menu Account"
                aria-describedby="close-account-description"
                className="cursor-pointer"
              >
                <CloseOutlined onClick={() => setOpenAccount(false)} />
              </motion.button>
              <p id="close-account-description" className="hidden">
                Click here to close your menu account.
              </p>
            </motion.div>
          )}

          <motion.div
            className="mx-3 mb-1 mt-2 grid place-content-center place-items-center gap-2"
            role="navigation"
            aria-label="User Navigation"
          >
            {IsLoading ? (
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={110} />
            ) : isAuthenticated && userData ? (
              <motion.span className="text-md w-72 text-center">
                Welcome <b>{userData.displayName}</b>
              </motion.span>
            ) : (
              <motion.span className="w-full px-3 py-2">Welcome</motion.span>
            )}

            {IsLoading && isAuthenticated
              ? navProfile.map((link, index) => (
                  <div key={index} className="p-2 grid gap-3" role="menu">
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={110}
                    />
                  </div>
                ))
              : isAuthenticated &&
                userData &&
                navProfile.map((link, index) => (
                  <div key={index} className="p-2 grid gap-3" role="menu">
                    <NavButtonDesktop
                      link={link.link}
                      name={link.name}
                      profile={true}
                      hasSubNav={false}
                    />
                  </div>
                ))}

            {IsLoading && isAuthenticated ? (
              <Skeleton variant="rounded" width={110} height={35} />
            ) : (
              isAuthenticated &&
              userData && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    role="button"
                    aria-label="Logout"
                    disabled={isLoadingLogout}
                    aria-describedby="logout-description"
                    className="flex w-full cursor-pointer items-center font-semibold justify-center gap-2 rounded-lg  border-none bg-primary-btn p-2 uppercase text-primary-black  lg:hover:bg-primary-hover"
                  >
                    {isLoadingLogout && <img src={icon} />}
                    <span>{isLoadingLogout ? "Processing..." : "Logout"}</span>
                  </motion.button>
                  <p id="logout-description" className="hidden">
                    Click here to logout.
                  </p>
                  {logoutError && (
                    <p className="text-sm w-full px-4 text-red-700">
                      {logoutError}
                    </p>
                  )}
                </>
              )
            )}

            {IsLoading ? (
              <Skeleton variant="rounded" width={110} height={35} />
            ) : (
              !isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    aria-label="Login"
                    aria-describedby="login-description"
                    className="mx-4 w-full cursor-pointer rounded-lg bg-primary-btn p-2 text-center font-semibold hover:bg-primary-hover"
                  >
                    Login
                  </Link>
                  <p id="login-description" className="hidden">
                    Click here to log into your account.
                  </p>
                </>
              )
            )}

            {IsLoading ? (
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={110} />
            ) : (
              !isAuthenticated && (
                <div className="flex w-full border-none py-2 before:m-0 before:h-[12px] before:flex-1 before:flex-shrink-0 before:border-b-2 before:border-solid before:border-primary-black before:content-[''] after:m-0 after:h-[12px] after:flex-1 after:flex-shrink-0 after:border-b-2 after:border-solid after:border-primary-black after:content-['']">
                  <span className="m-0 flex-[0.6] flex-shrink-0 text-center text-[10px] uppercase">
                    or
                  </span>
                </div>
              )
            )}

            {IsLoading ? (
              <Skeleton variant="rounded" width={110} height={35} />
            ) : (
              !isAuthenticated && (
                <>
                  <Link
                    to="/signup"
                    aria-label="Sign Up"
                    aria-describedby="signup-description"
                    className="mx-3 w-full cursor-pointer rounded-lg bg-primary-btn p-2 text-center font-semibold hover:bg-primary-hover"
                  >
                    Sign Up
                  </Link>
                  <p id="signup-description" className="hidden">
                    Click here to sign up into your account.
                  </p>
                </>
              )
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountModal;
