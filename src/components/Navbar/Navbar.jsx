import { Squash } from "hamburger-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Logo from "../images/logo/logo.png";
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
  PersonOutline,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useMedia } from "react-use";
import { variants } from "../utilities/variants";
import { Badge } from "@mui/material";
import { useSelector } from "react-redux";
import ShoppingCartProgress from "../DetailsProducts/ShoppingCartProgress";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";
import Search from "./Search/Search";
import AccountModal from "./AccountModal";

const menuItems = [
  {
    name: "Products",
    icon: [<KeyboardArrowRightOutlined />, <KeyboardArrowDownOutlined />],
    items: [
      { name: "All", link: "/products/category/all" },
      { name: "Tonifying", link: "/products/category/tonifying" },
      { name: "Digestive", link: "/products/category/digestive" },
      { name: "Soothing", link: "/products/category/soothing" },
      { name: "Detoxifying", link: "/products/category/detoxifying" },
    ],
  },
  { name: "About Us", link: "/about-us" },
  { name: "Contacts", link: "/contacts" },
];

const navProfile = [
  { name: "My Orders", link: "/dashboard/my-orders" },
  { name: "Dashboard", link: "/dashboard/" },
];

const Icon = ({ icon }) => <span className="ml-auto">{icon}</span>;

// Functional component for a navigation button in mobile view
function NavButton({ name, link, icon, onClick, hasSubNav, isSmallScreen }) {
  const navigate = useNavigate();

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }} // Animation effect on tap
        aria-label={name}
        type="button"
        role="button"
        onClick={(e) => {
          e.stopPropagation(); // Prevents event propagation to parent elements
          if (link) {
            navigate(link); // Navigate to the specified link
          } else {
            onClick(name); // Handle click action if no link is specified
          }
        }}
        className={`mx-2 flex gap-4 items-center`}
      >
        {name}
        {hasSubNav && icon && <Icon icon={isSmallScreen && icon[0]} />}{" "}
        {/* Renders icon for sub-navigation on small screens */}
      </motion.button>
    </>
  );
}

// Functional component for a navigation button in desktop view
export function NavButtonDesktop({
  name,
  link,
  icon,
  handleMouseEnter,
  handleClickItem,
  hasSubNav,
  profile,
}) {
  const navigate = useNavigate();

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }} // Animation effect on tap
        type="button"
        role="button"
        aria-label={name}
        onMouseEnter={handleMouseEnter} // Event handler for mouse enter
        onClick={() => {
          if (link) {
            navigate(link); // Navigate to the specified link
          } else {
            handleClickItem(name); // Handle click action if no link is specified
          }
        }}
        className={`flex relative items-center ${
          !hasSubNav &&
          'after:content-[""] after:absolute after:w-full after:h-1 after:rounded-br-none after:rounded-bl-none after:bg-primary-btn after:top-full after:left-0 after:hover:transition-transform after:hover:duration-500 after:scale-x-0 after:origin-right after:hover:scale-x-100 after:hover:origin-left hover:opacity-100'
        } gap-1 text-primary-black/85 hover:text-primary-black`} // Conditional class for underline effect
      >
        {name}
        {hasSubNav && icon && <Icon icon={icon[1]} />}{" "}
        {/* Renders icon for sub-navigation */}
        {profile && <KeyboardArrowRightOutlined />} {/* Renders profile icon */}
      </motion.button>
    </>
  );
}

// Functional component for dropdown menu in mobile view
function DropdownMenu({ items, onClose, isActive, handleAnimationComplete }) {
  return (
    <>
      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isActive && (
          <motion.div
            initial="closed"
            animate={isActive ? "open" : "closed"}
            exit="closed"
            variants={variants} // Assuming 'variants' is defined elsewhere for animation
            className="pt-4" // Styling classes for dropdown menu
          >
            <div className="mb-6 flex text-sm">
              <KeyboardArrowLeftOutlined fontSize="medium" />{" "}
              {/* Icon for back navigation */}
              <motion.button
                whileTap={{ scale: 0.95 }} // Animation effect on tap
                role="button"
                aria-label="Go Back"
                onClick={onClose} // Event handler for closing dropdown menu
              >
                go back
              </motion.button>
            </div>

            <div className="mx-2 grid grid-cols-1 gap-4">
              {/* Maps through items and renders links */}
              {items?.map((item, index) => (
                <Link
                  to={item.link}
                  key={index}
                  className="flex items-center border-b border-slate-800 py-1 last:border-b-0"
                >
                  {item.name}
                 
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Functional component for dropdown menu in desktop view
function DropdownMenuDesk({ items, onMouseLeave, isActive }) {
  return (
    <>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-9 -left-14 grid w-52 cursor-pointer rounded-lg border border-slate-600 bg-primary p-4 shadow-lg transition-all before:absolute before:-top-[7px] before:left-24 before:h-3 before:w-3 before:-rotate-45 before:border-t before:border-r before:border-t-slate-600 before:border-r-slate-600 before:bg-inherit before:content-['']"
            onMouseLeave={onMouseLeave} // Event handler for mouse leave
          >
            {/* Maps through items and renders links */}
            {items?.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className="flex py-3 rounded-lg z-50 px-5 hover:bg-stone-200"
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Functional component for displaying a message in desktop view related to the shopping cart
function CartMessageDesktop({ title, total, onMouseLeave, messageCart }) {
  return (
    <>
      <AnimatePresence>
        {messageCart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.2 }}
            className="absolute flex h-48 flex-col justify-center gap-5 bg-primary p-16 shadow-xl lg:left-auto lg:top-[50px] lg:-right-[10px] md:flex md:w-[500px] lg:rounded-lg lg:border lg:border-slate-600 lg:px-24 lg:before:absolute lg:before:-top-[7px] lg:before:right-[29px] lg:before:h-3 lg:before:w-3 lg:before:-rotate-45 lg:before:border-t lg:before:border-r lg:before:border-t-slate-600 lg:before:border-r-slate-600 lg:before:bg-inherit lg:before:content-['']"
            onMouseLeave={onMouseLeave} // Event handler for mouse leave
          >
            <div className="flex items-center py-3">
              <b className="text-sm font-semibold">{title}</b>
              <b className="ml-auto text-sm font-semibold">{total}</b>
            </div>

            {/* Renders shopping cart progress component */}
            <>
              <ShoppingCartProgress />
            </>

            <div className="flex justify-center pb-3">
              {/* Link to view the shopping cart */}
              <Link
                to="/cart"
                className="min-w-64 max-w-full uppercase font-semibold text-center rounded-lg bg-primary-btn fond-semibold p-2 hover:bg-primary-hover"
              >
                View Cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Functional component for apply an overlay
const Overlay = ({ isHamburgerOpen, setIsActiveItems }) => {
  return (
    isHamburgerOpen && (
      <div
        onMouseEnter={() => setIsActiveItems(false)}
        className="fixed inset-0 z-[5] h-full  w-full bg-gradient-to-b from-overlay-start to-overlay-finish"
      ></div>
    )
  );
};

export default function Navbar() {
  // Get current pathname from React Router's useLocation hook
  const { pathname } = useLocation();

  // Retrieve subtotal from Redux store using useSelector
  const subtotal = useSelector((state) => parseFloat(state.cart.subtotal));

  // Custom hook for currency formatting
  const formatAmount = useCurrencyFormatter();

  // Check if screen size is small (max-width: 768px)
  const isSmallScreen = useMedia("(max-width: 768px)");

  // State to manage hamburger menu open/close
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  // State to manage account menu open/close
  const [openAccount, setOpenAccount] = useState(false);

  // State to manage selected item in navigation
  const [selectedItem, setSelectedItem] = useState(null);

  // State to manage active items in dropdown menus, etc.
  const [isActiveItems, setIsActiveItems] = useState(false);

  // State to manage active search state
  const [activeSearch, setActiveSearch] = useState(false);

  // State to manage cart count
  const [cartCount, setCartCount] = useState(0);

  // State to manage message cart display
  const [messageCart, setMessageCart] = useState(false);

  // Retrieve cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // State to manage navbar visibility
  const [show, setShow] = useState(false); // Assuming this controls the visibility of the navbar

  // Custom hook to get scroll position
  const { scrollY } = useScroll();

  // Ref for navbar element
  const navbarRef = useRef(null);

  useEffect(() => {
    // Function to handle body overflow based on hamburger and account menu state
    const handleBodyOverflow = () => {
      if (isHamburgerOpen || openAccount) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    };

    // Initial call to set body overflow class correctly
    handleBodyOverflow();

    // Function to handle outside click to close navbar
    const handleOutsideClick = (event) => {
      if (
        isHamburgerOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setIsHamburgerOpen(false);
      }
    };

    // Add click event listener to window
    window.addEventListener("click", handleOutsideClick);

    // Cleanup function to remove event listener
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isHamburgerOpen, openAccount, navbarRef]); // Dependency array ensures effect runs on state changes

  useEffect(() => {
    // This useEffect runs whenever cartItems changes
    const timeout = setTimeout(() => {
      // Calculate total quantity of items in cartItems
      const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

      // Update cartCount state with the calculated count
      setCartCount(count);

      // Store cartCount in sessionStorage to persist across page reloads
      sessionStorage.setItem("cartCount", count);
    }, 1000); // Timeout of 1000ms (1 second)

    // Cleanup function to clear the timeout if component unmounts or cartItems changes
    return () => clearTimeout(timeout);
  }, [cartItems]); // Dependency array ensures useEffect runs when cartItems changes

  useEffect(() => {
    // This useEffect runs once on component mount to retrieve cartCount from sessionStorage
    const storedCount = sessionStorage.getItem("cartCount");

    // If there's a stored count in sessionStorage, update cartCount state with it
    if (storedCount) {
      setCartCount(parseInt(storedCount));
    }
  }, []); // Dependency array is empty, so it runs only once on component mount

  const handleClick = (item) => {
    // This function handles click events on menu items
    if (item.items) {
      // If the clicked item has sub-items (indicating it's expandable)
      setSelectedItem(item); // Set the selected item to the clicked item
      setIsActiveItems(true); // Set isActiveItems to true to expand the sub-menu
    } else {
      // If the clicked item does not have sub-items
      setSelectedItem(null); // Clear the selected item
      setIsActiveItems(false); // Set isActiveItems to false to collapse the sub-menu
    }
  };
  const handleAnimationComplete = () => {
    // This function is called when the animation of the dropdown menu completes
    setSelectedItem(null); // Clear the selected item (close the dropdown menu)
    setIsActiveItems(false); // Set isActiveItems to false (hide the dropdown menu)
  };

  const handleCartEnter = () => {
    // Checks if the window width is greater than or equal to 1024px
    if (window.innerWidth >= 1024) {
      setMessageCart(true); // Sets messageCart state to true to display the cart message
    }
  };

  useEffect(() => {
    setIsHamburgerOpen(false); // Ensures the hamburger menu is closed whenever the pathname changes
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    const isScrollDown = latest > previous && previous > 150;
    setShow(isScrollDown); // Updates the show state based on scroll direction and position
  });

  return (
    <>
      <motion.div
        ref={navbarRef}
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={show ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 z-20 w-screen bg-primary py-3 text-base transition-all duration-300 ease-linear `}
      >
        <div className="ml-2 mr-5 md:mr-6 flex items-center  justify-between gap-12 lg:mr-8">
          {/* Logo */}
          <div className="absolute left-1/2 order-2 -translate-x-1/2 lg:relative lg:left-8 lg:order-1 lg:translate-x-0">
            <Link to="/home">
              <img
                src={Logo}
                alt="logo"
                className=" w-20 xs:w-24 h-auto lg:w-20"
              />
            </Link>
          </div>

          {/* Hamburger Menu Icon (visible on small screens) */}
          <div className="flex items-center gap-1 lg:order-2 lg:hidden">
            <Squash
              toggled={isHamburgerOpen}
              toggle={() => setIsHamburgerOpen(!isHamburgerOpen)}
              size={25}
              color="hsl(0, 0%, 12%)"
            />
            <div
              onClick={() => {
                setIsHamburgerOpen(false);
                setIsActiveItems(false);
                setActiveSearch(true);
              }}
              className="p-1 xs:p-2  block lg:hidden cursor-pointer rounded-lg"
            >
              <SearchOutlined
                sx={{
                  color: "hsl(0, 0%, 12%)",
                  margin: ".1rem",
                  cursor: isSmallScreen ? "default" : "pointer",
                }}
              />
            </div>
          </div>

          <AnimatePresence>
            {/* Navigation Menu */}
            <motion.nav
              onMouseLeave={() => setIsActiveItems(false)}
              className="items-center gap-5 lg:order-1 lg:ml-auto flex"
            >
              {/* Mobile Dropdown Menu */}
              <motion.div
                animate={isHamburgerOpen ? "open" : "closed"}
                variants={variants}
                initial="closed"
                exit="closed"
                className={`absolute top-[56px] left-0 z-[999] flex flex-col px-10 pb-20 justify-center gap-12 bg-opacity-90 place-items-start h-screen w-3/5 bg-primary rounded-none text-lg text-black md:top-[56px]`}
              >
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {/* Render NavButton for items without submenus */}
                    {!item.items && selectedItem === null && (
                      <NavButton
                        link={item.link}
                        key={index}
                        onClick={() => handleClick(item)}
                        name={item.name}
                        icon={item.icon}
                        hasSubNav={!!item.items}
                        isSmallScreen={isSmallScreen}
                      />
                    )}

                    {/* Render NavButton for items with submenus */}
                    {item.items && selectedItem === null && (
                      <NavButton
                        link={item.link}
                        key={index}
                        onClick={() => handleClick(item)}
                        name={item.name}
                        icon={item.icon}
                        hasSubNav={!!item.items}
                        isSmallScreen={isSmallScreen}
                      />
                    )}

                    {/* Render DropdownMenu for selected item with submenus */}
                    {selectedItem && item === selectedItem && (
                      <DropdownMenu
                        items={selectedItem.items}
                        onClose={() => {
                          setIsActiveItems(false);
                        }}
                        isActive={isActiveItems}
                        handleAnimationComplete={handleAnimationComplete}
                      />
                    )}
                  </React.Fragment>
                ))}
              </motion.div>

              {/* Desktop Navigation Menu */}
              <motion.div
                className={`relative z-50 hidden h-full gap-5 border-t border-slate-600 bg-primary text-black sm:border-none lg:flex`}
              >
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {/* Render NavButtonDesktop for items without submenus */}
                    {!item.items && (
                      <NavButtonDesktop
                        link={item.link}
                        handleClickItem={() => handleClick(item)}
                        handleMouseEnter={() => handleClick(item)}
                        name={item.name}
                        icon={item.icon}
                        hasSubNav={!!item.items}
                      />
                    )}

                    {/* Render NavButtonDesktop for items with submenus */}
                    {item.items && (
                      <>
                        <NavButtonDesktop
                          link={item.link}
                          handleClickItem={() => handleClick(item)}
                          handleMouseEnter={() => handleClick(item)}
                          name={item.name}
                          icon={item.icon}
                          hasSubNav={!!item.items}
                        />
                        {/* Render DropdownMenuDesk for selected item with submenus */}
                        {selectedItem && selectedItem.items && (
                          <DropdownMenuDesk
                            items={selectedItem.items}
                            onClose={() => {
                              setIsActiveItems(false);
                            }}
                            onMouseLeave={() => {
                              handleAnimationComplete();
                              setIsActiveItems(false);
                            }}
                            isActive={isActiveItems}
                            handleAnimationComplete={handleAnimationComplete}
                          />
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>

              {/* Search Icon */}
              <div className="order-3 flex items-center gap-1 lg:gap-0">
                <div
                  onClick={() => setActiveSearch(true)}
                  className="lg:p-3 hidden lg:block cursor-pointer rounded-lg"
                >
                  <SearchOutlined
                    sx={{
                      color: "hsl(0, 0%, 12%)",
                      margin: ".1rem",
                      cursor: isSmallScreen ? "default" : "pointer",
                    }}
                  />
                </div>

                {/* Account Icon and Modal */}
                <div
                  onMouseEnter={() => setOpenAccount(true)}
                  onMouseLeave={() => setOpenAccount(false)}
                  className="relative p-1 xs:p-2 lg:p-3"
                >
                  <PersonOutline
                    sx={{
                      color: "hsl(0, 0%, 12%)",
                      margin: ".1rem",
                      cursor: isSmallScreen ? "default" : "pointer",
                    }}
                    onClick={() => {
                      setOpenAccount(!openAccount);
                      setIsHamburgerOpen(false);
                    }}
                    onMouseEnter={() => setOpenAccount(true)}
                  />

                  <AccountModal
                    navProfile={navProfile}
                    openAccount={openAccount}
                    setOpenAccount={setOpenAccount}
                    isHamburgerOpen={isHamburgerOpen}
                  />
                </div>

                {/* Cart Icon and Message */}
                <div
                  onMouseLeave={() => setMessageCart(false)}
                  className="relative p-1 xs:p-2 lg:p-3"
                >
                  <Badge
                    badgeContent={cartCount}
                    showZero
                    color="error"
                    max={99}
                  >
                    <Link to="/cart" aria-label="Go to Cart">
                      <ShoppingCartOutlined
                        sx={{
                          color: "hsl(0, 0%, 12%)",
                          margin: ".1rem",
                          cursor: "pointer",
                        }}
                        onMouseEnter={handleCartEnter}
                      />
                    </Link>
                  </Badge>
                  <CartMessageDesktop
                    title="Cart:"
                    total={formatAmount(subtotal)}
                    onMouseLeave={() => setMessageCart(false)}
                    messageCart={messageCart}
                  />
                </div>
              </div>
            </motion.nav>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Search Component */}
      <Search activeSearch={activeSearch} setActiveSearch={setActiveSearch} />

      {/* Overlay Component */}
      <Overlay
        setIsActiveItems={setIsActiveItems}
        isHamburgerOpen={
          isHamburgerOpen || activeSearch || (openAccount && isSmallScreen)
        }
      />
    </>
  );
}
