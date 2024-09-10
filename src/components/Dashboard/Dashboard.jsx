import React, { useEffect, useMemo, useState } from "react";
import {
  AccountBoxOutlined,
  AssignmentReturnOutlined,
  CreditCardOutlined,
  ExitToAppOutlined,
  FavoriteBorderOutlined,
  HomeOutlined,
  Inventory2Outlined,
  PersonOutline,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import * as userAuthActions from "../../store/user-auth";
import { useDispatch, useSelector } from "react-redux";
import { Returns } from "./Returns/Returns";
import { AccountOverview } from "./AccountOverview";
import { MyDetails } from "./MyDetails/MyDetails";
import Addresses from "./Address/Addresses";

// Carica il componente Addresses con un ritardo di 1 secondo
/* const LazyAddresses = lazy(() =>
  import("./Address/Addresses").then(async (module) => {
    // Simula un ritardo di caricamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return module;
  }),
); */

import { Skeleton } from "@mui/material";
import { MyOrders } from "./Orders/MyOrders";
import { MyPaymentMethods } from "./Payment/MyPaymentMethods";
import { motion } from "framer-motion";
import { Wishlist } from "./Wishlist/Wishlist";
import { LayoutDashboard } from "../Layout/LayoutDashboard";
import { logout } from "../auth/logout";
import MessageProvider from "./Message/MessageProvider";
import ShipFormProvider from "./Address/Ship/ShipFormProvider";
import Breadcrumb from "../../BreadCrumb";
import { revertAll } from "../../store/revertAll";
import { capitalizeFirstLetter } from "../utilities/capitalizeFirstLetter";

export const menuOrders = [
  {
    name: "Account Overview",
    icon: <PersonOutline />,
    link: "dashboard",
    component: <AccountOverview />,
  },
  {
    name: "My Wishlist",
    icon: <FavoriteBorderOutlined />,
    link: "wishlist",
    component: <Wishlist />,
  },
  {
    name: "My Orders",
    icon: <Inventory2Outlined />,
    link: "my-orders",
    component: <MyOrders />,
  },
  {
    name: "My Return",
    icon: <AssignmentReturnOutlined />,
    link: "returns",
    component: <Returns />,
  },
  {
    name: "My Details",
    icon: <AccountBoxOutlined />,
    link: "my-details",
    component: <MyDetails />,
  },
  {
    name: "Addresses",
    icon: <HomeOutlined />,
    link: "addresses",
    component: (
      <ShipFormProvider>
        <MessageProvider>
          <Addresses />,
        </MessageProvider>
      </ShipFormProvider>
    ),
  },
  {
    name: "My Payment Methods",
    icon: <CreditCardOutlined />,
    link: "payment-methods",
    component: (
      <MessageProvider>
        <MyPaymentMethods />,
      </MessageProvider>
    ),
  },
];

const componentMap = menuOrders.reduce((map, item) => {
  // Destructure the properties from the current item
  const { name, icon, link, component } = item;

  // Create an entry in the map using the name as the key
  map[link] = { name, icon, link, component };

  return map;
}, {});

const Icon = ({ icon, active }) => (
  <span className={`${active ? "text-primary-black " : ""} `}>{icon}</span>
);

const IconSkeleton = () => (
  <Skeleton
    sx={{ bgcolor: "grey.400" }}
    variant="circular"
    width={35}
    height={35}
    animation="pulse"
  />
);

const NavHeader = ({ name, firstLetter }) => {
  return (
    <header className=" relative ">
      <h1 className=" flex flex-wrap gap-3  items-center ">
        <div className=" rounded-full w-8 h-8 overflow-hidden grid place-content-center font-semibold text-lg bg-slate-300">
          {firstLetter}
        </div>
        <b className="font-semibold text-slate-200 text-lg">{name}</b>
      </h1>
    </header>
  );
};

function NavButtonSkeleton() {
  return (
    <>
      <div className={`relative flex items-center gap-3 px-5 py-3 m-3`}>
        <IconSkeleton />
        <Skeleton
          sx={{ bgcolor: "grey.400" }}
          variant="text"
          width={180}
          height={30}
        />
      </div>
    </>
  );
}

function NavButton({ name, icon, onClick, active, variants, loading }) {
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        role="button"
        variants={variants}
        aria-label={name}
        onClick={onClick}
        aria-selected={active ? "true" : "false"}
        style={{}}
        className={`relative flex rounded-lg hover:bg-slate-200/80 hover:text-primary-black items-center gap-3 px-5 ${
          active ? "bg-slate-200/80  w-auto  rounded-lg  " : ""
        }  m-3 py-3`}
      >
        {icon && <Icon icon={icon} active={active} />}
        {
          <span
            className={`  ${
              active ? "font-semibold text-slate-900" : ""
            }  w-full   text-left text-base`}
          >
            {name}
          </span>
        }
      </motion.button>
    </>
  );
}

export const Sidebar = ({
  user,
  menuItems,
  handleSidebarItemClick,
  selectedItem,
  loading,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* const isSmallScreen = window.matchMedia("(max-width: 768px)").matches; */
  const buttonVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

 const initials = useMemo(() => {
   return (user?.displayName || user?.email || "")?.charAt(0) || "";
 }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      dispatch(userAuthActions.activeAuth(false));
      dispatch(userAuthActions.logoutUser());
      dispatch(revertAll());
      navigate("/home");
    } catch (error) {
      console.error("Errore durante il logout:", error.message);
      /*  setLogoutlError("An error occurred during logout. Please try later."); */
    }
  };

  return (
    <motion.aside
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
        transition: {
          duration: 0.75,
        },
      }}
      viewport={{ once: true }}
      aria-label="Navigation"
      className="flex  h-auto my-8 mx-3 w-auto md:my-0 md:mx-0 dashboardGlass rounded-lg flex-col md:w-auto"
    >
      {/* Top section with user information */}
      {loading ? (
        <div className="relative p-3 md:p-5  min-h-20 flex h-auto  md:w-[20rem] ">
          <div className="pt-5 pb-4 px-3  flex items-center gap-3  md:grid md:place-content-center">
            <Skeleton
              variant="circular"
              width={30}
              height={30}
              animation="pulse"
              sx={{ bgcolor: "grey.400" }}
            />
            <Skeleton
              variant="text"
              width={150}
              height={35}
              animation="pulse"
              sx={{ bgcolor: "grey.400" }}
            />
          </div>
        </div>
      ) : (
        <div className="relative p-3   flex   min-h-20 h-auto  md:w-[20rem] ">
          {/* Render user's name or email in the header */}

          <div className=" pt-5 pb-4 px-3   grid md:place-content-center">
            <NavHeader
              firstLetter={initials}
              name={user.displayName || user.email}
            />
          </div>

          {/* Background waves image (visible only on mobile) */}
          {/* <div className="absolute left-0 bottom-8">
            <img
              src={waves}
              alt="waves"
              className=" z-10 overflow-hidden h-auto  block   md:hidden "
            />
          </div> */}
        </div>
      )}

      {/* Sidebar navigation items */}
      {loading ? (
        <>
          <div className="hidden md:grid  md:px-2">
            {[...Array(7)].map((_, index) => (
              <React.Fragment key={index}>
                <NavButtonSkeleton />
              </React.Fragment>
            ))}
          </div>
          <div className="grid pl-5 pr-3  md:hidden ">
            {[...Array(6)].map((_, index) => (
              <React.Fragment key={index}>
                <NavButtonSkeleton />
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <motion.div className="grid pb-4  text-slate-100 ">
          {/* Render the sidebar items for larger screens */}
          <div className="hidden md:grid md:px-2">
            {/* Map through each item in 'menuItems' and render a NavButton component */}
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {/* Render a NavButton for each item with its name, link, icon, onClick, and active status */}
                <NavButton
                  name={item.name}
                  link={item.link}
                  icon={item.icon}
                  onClick={() => handleSidebarItemClick(item.link)}
                  active={selectedItem === item.link}
                />
              </React.Fragment>
            ))}
            <NavButton
              name="Exit"
              icon={<ExitToAppOutlined />}
              onClick={(e) => handleLogout(e)}
            />
          </div>

          {/* Render the sidebar items for smaller screens (hidden on larger screens) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid pl-5 pr-3 z-0 md:hidden"
          >
            {/* Use .slice(1) to exclude the first item (Account Overview) */}
            {menuItems.slice(1).map((item, index) => (
              <React.Fragment key={index}>
                {/* Render a NavButton for each item with its name, link, icon, onClick, and active status */}
                <NavButton
                  name={item.name}
                  link={item.link}
                  icon={item.icon}
                  variants={buttonVariants}
                  onClick={() => handleSidebarItemClick(item.link)}
                  active={selectedItem === item.link}
                />
              </React.Fragment>
            ))}
            <NavButton
              name="Exit"
              variants={buttonVariants}
              icon={<ExitToAppOutlined />}
              onClick={(e) => handleLogout(e)}
            />
          </motion.div>

          {/* Logout button at the bottom of the sidebar */}
        </motion.div>
      )}
    </motion.aside>
  );
};

// Content.jsx

export const Content = ({ selectedItem, loading }) => {
  // Get the value of 'linkDashboard' from the URL parameters
  const { linkDashboard } = useParams();

  // Use the value of 'linkDashboard' to get the corresponding component from 'componentMap'
  // If 'linkDashboard' is not available, it will use the value of 'selectedItem' as a fallback
  const selectedComponent =
    componentMap[linkDashboard || selectedItem].component || null;

  return (
    <div className="flex-col gap-2 flex my-4 mx-3 md:m-0 w-full md:w-1/2 max-w-[32.5rem] lg:w-full">
      {/* Passa la prop 'loading' al componente selezionato */}
      {selectedComponent && React.cloneElement(selectedComponent, { loading })}
    </div>
  );
};

/* Quando viene eseguita l'espressione componentMap[selectedItem], viene cercato l'oggetto nel componentMap che corrisponde alla chiave selectedItem.
 Se la chiave esiste, l'espressione restituirà l'oggetto corrispondente. Altrimenti, restituirà undefined.

Ad esempio, se selectedItem è "My Return" e componentMap contiene un oggetto con la chiave "My Return", 
l'espressione componentMap[selectedItem] restituirà l'oggetto corrispondente a "My Return" dal componentMap. */

export default function Dashboard() {
  const { linkDashboard } = useParams();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const user = useSelector((state) => state.userAuth.user);
    const [selectedItem, setSelectedItem] = useState(
      linkDashboard || "dashboard",
    );


  // Scrolls the window to the top whenever the content changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [<Content />]); // Triggered whenever <Content /> changes

  // Effect to update sidebar state based on linkDashboard changes
  useEffect(() => {
    // Find the selected menu item from menuOrders based on linkDashboard
    const selectedMenu = menuOrders.find((item) => item.link === linkDashboard);

    if (selectedMenu) {
      setSelectedItem(selectedMenu.link); // Set selectedItem to the found menu item's link
      setShowSidebar(false); // Hide the sidebar if a valid menu item is found
    } else {
      setSelectedItem("dashboard"); // Set selectedItem to 'dashboard' if no valid menu item is found
      setShowSidebar(true); // Show the sidebar if no valid menu item is found
    }
  }, [linkDashboard, menuOrders]); // Dependencies for this effect

  // Function to handle clicks on sidebar items
  const handleSidebarItemClick = (link) => {
    if (link === "dashboard") {
      setSelectedItem(link); // Set selectedItem to 'dashboard'
      navigate("/dashboard"); // Navigate to /dashboard
    } else {
      setSelectedItem(link); // Set selectedItem to the clicked link
      navigate(`/dashboard/${link}`); // Navigate to /dashboard/{link}
    }
  };

  /*   const {
    isLoading,
    error,
    data: userData,
    refetch,
  } = useConditionalUserData(isAuthenticated); */

  return (
    <>
      {/* Breadcrumb component shown only on mobile devices */}
      <div className="mt-12 md:hidden">
        <Breadcrumb />
      </div>

      {/* Sidebar section for mobile devices, shown only if showSidebar is true */}
      {showSidebar && (
        <div className="md:hidden">
          <Sidebar
            loading={!user} // Loading state based on whether user data is available
            user={user} // User object passed to Sidebar component
            menuItems={menuOrders} // Array of menu items passed to Sidebar
            selectedItem={selectedItem} // Currently selected sidebar item
            handleSidebarItemClick={handleSidebarItemClick} // Function to handle sidebar item clicks
          />
        </div>
      )}

      {/* Content section shown alongside Sidebar if showSidebar is true and not on mobile screens */}
      {!showSidebar && (
        <div className="md:hidden flex justify-center">
          <Content
            selectedItem={selectedItem} // Currently selected sidebar item
            loading={!user} // Loading state based on whether user data is available
          />
        </div>
      )}

      {/* Content and Sidebar layout for desktop screens */}
      <div className="hidden md:block">
        <LayoutDashboard
          loading={!user} // Loading state based on whether user data is available
          selectedItem={selectedItem} // Currently selected sidebar item
        >
          <Content
            selectedItem={selectedItem} // Currently selected sidebar item
            loading={!user} // Loading state based on whether user data is available
          />
        </LayoutDashboard>
      </div>
    </>
  );
}
