import React from "react";
import { Sidebar, menuOrders } from "../Dashboard/Dashboard";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router";
import { motion } from "framer-motion";


export const LayoutDashboard = ({ selectedItem, loading, children }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userAuth.user);

  const handleSidebarItemClick = (link) => {
    if (link === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${link}`);
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex my-8  justify-center gap-5"
      >
        <div className="hidden md:block">
          <Sidebar
            loading={!user}
            user={user}
            menuItems={menuOrders}
            selectedItem={selectedItem}
            handleSidebarItemClick={handleSidebarItemClick}
          />
        </div>
        {children}
      </motion.div>
      <Outlet />
    </>
  );
};
