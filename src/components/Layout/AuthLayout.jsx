import React from "react";
import { Outlet } from "react-router-dom";
import { NavbarForm } from "../Navbar/NavbarForm";



// Definition of the AuthLayout component
 const AuthLayout = ({ children }) => {
  return (
    <div className="flex relative min-h-screen flex-col">
      <>
        <NavbarForm />
      </>
      {/* NavbarForm component for authentication layout */}

      <div
        className=" bg-auth bg-cover bg-center box-border bg-no-repeat   flex  relative h-[63rem] md:h-screen md:min-h-screen  bg-slate-200 z-0 max-w-full md:items-center justify-center"
        role="main"
        aria-label="Authentication Page"
      >
        {/* <div className="absolute z-0 left-0 right-0">
          <img src={svgAuth} alt="" className="w-full h-full" />
        </div> */}
        <div className=" z-10">
          {children}

          {/* Outlet for nested routes */}
          <Outlet />
        </div>
        {/* Children components (e.g., login or registration form) */}
      </div>
    </div>
  );
};

// Export of the AuthLayout component
export default AuthLayout;
