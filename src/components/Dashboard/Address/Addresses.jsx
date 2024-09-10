import React, { useEffect, useMemo, useState } from "react";
import { DashHeader } from "../DashHeader";
import {
  DeleteForeverOutlined,
  DescriptionOutlined,
  Edit,
  HomeOutlined,
  LocalShippingOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShippingData } from "../../../store/shippingData";
import { db } from "../../../firebaseMethod";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { Skeleton } from "@mui/material";
import { CheckboxInput } from "../../Input/CheckboxInput/CheckboxInput";
import { Message } from "../Message/Message";
import { motion } from "framer-motion";
import { Confirmation } from "./EditShip/Confirmation";
import { NavigateButton } from "../NavigateButton";
import { useMessageContext } from "../Message/MessageContext";
import { useShipFormContext } from "./Ship/ShipFormContext";

const AddressContainer = ({
  addressesWithDefaultShipping,
  checkboxForm,
  onInputChange,
  loading,
  deleteAddress,
  checkboxValue,
}) => {
  return (
    <>
      {loading ? (
        <div className="relative flex h-64 rounded-lg justify-center flex-col w-full bg-slate-100 p-5 ">
          <div className="flex mt-8  w-2/3 sm:text-sm lg:text-base flex-col flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={270}
                />
              </React.Fragment>
            ))}

            <div className="absolute text-sm p-1 top-5 right-9 flex items-center gap-2 text-slate-900 hover:text-slate-700">
              <Skeleton variant="text" width={100} height={22} />
            </div>

            <div
              className={`absolute top-12 p-1 text-sm right-9  flex items-center gap-2 text-slate-900 disabled:text-slate-600 disabled:hover:text-slate-600 hover:text-slate-700`}
            >
              <Skeleton variant="text" width={100} height={22} />
            </div>

            {/*  <li>{address.firstName}</li>
            <li>{address.lastName}</li>
            <li>{address.phone}</li>
            {address.newAddress.address.length > 0 ? (
              <li>{address.fullAddress}</li>
            ) : (
              address.location
            )} */}
          </div>
        </div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative flex h-auto mb-2 rounded-lg last:mb-0 flex-col w-full bg-slate-100 p-6 "
        >
          {addressesWithDefaultShipping.map((address, index) => (
            <React.Fragment key={index}>
              <ul className="flex max-w-xs text-sm xs:text-base lg:text-base flex-col flex-wrap gap-2">
                <li>{address.firstName}</li>
                <li>{address.lastName}</li>
                <li>{address.phone}</li>
                {address &&
                address.newAddress &&
                address.newAddress.address &&
                address.newAddress.address.length > 0 ? (
                  <li>{address.fullAddress}</li>
                ) : (
                  <li className="w-full">{address && address.location}</li>
                )}
              </ul>
              <>
                <NavLink
                  to={`edit/${address.id}`}
                  className="absolute rounded-full text-sm px-3 py-2  top-3 right-3 md:right-9 flex items-center gap-2 text-slate-900 hover:text-slate-700 hover:bg-slate-200"
                >
                  <span className="hidden lg:block">Modify</span>

                  <span className="">
                    <Edit sx={{ fontSize: "1.8rem" }} />
                  </span>
                </NavLink>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => deleteAddress(e, address.id)}
                  role="button"
                  aria-label="Delete Address"
                  title="Delete Address"
                  disabled={address.defaultShipping || address.defaultBilling}
                  className={`absolute top-14 px-3 py-2 text-sm right-3 md:right-9  flex items-center gap-2 text-slate-900 disabled:text-slate-500 disabled:hover:text-slate-500 disabled:hover:bg-inherit disabled:cursor-not-allowed hover:text-slate-700 hover:bg-slate-200 rounded-full`}
                >
                  <span className="hidden lg:block">Delete</span>
                  <span>
                    <DeleteForeverOutlined sx={{ fontSize: "2rem" }} />
                  </span>
                </motion.button>
              </>

              {address.defaultShipping && (
                <div className="pt-8 flex w-full flex-col gap-5">
                  <span className="flex items-center text-sm text-slate-500 gap-2">
                    This is your default shipping address.
                    <LocalShippingOutlined />
                  </span>
                  {address.defaultBilling && (
                    <span className="flex items-center text-sm text-slate-500 gap-2">
                      This is your default billing address.
                      <DescriptionOutlined />
                    </span>
                  )}
                </div>
              )}

              {(!address.defaultShipping || !address.defaultBilling) &&
                checkboxValue.length > 0 && (
                  <div className="flex pt-8 flex-col gap-5 text-sm">
                    {checkboxValue
                      .filter((input) => {
                        if (
                          (input.name === "defaultShipping" &&
                            address.defaultShipping) ||
                          (input.name === "defaultBilling" &&
                            address.defaultBilling)
                        ) {
                          // Filter out checkboxes that meet a true condition
                          return false;
                        }
                        return true;
                      })
                      .map((input, index) => (
                        <React.Fragment key={index}>
                          <CheckboxInput
                            name={input.name}
                            label={input.label}
                            onInputChange={(e) => onInputChange(e, address.id)}
                            checked={checkboxForm[input.name]}
                            aria={checkboxForm[input.name]}
                          />
                        </React.Fragment>
                      ))}
                  </div>
                )}
            </React.Fragment>
          ))}
        </motion.div>
      )}
    </>
  );
};

/*  */
const Addresses = () => {
  // Hook for navigation
  const { showSuccessMessage, showErrorMessage } = useMessageContext();
  // Redux dispatch function
  const dispatch = useDispatch();
  // Selecting shipping data from Redux store
  const shippingData = useSelector((state) => state.shippingData);
  const { addresses } = shippingData;

  // State to track loading status of component
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  // Destructuring user data and token from userAuth state in Redux store
  const {
    user: { uid },
  } = useSelector((state) => state.userAuth);

  // Reference to the user document in Firestore
  const userDocRef = doc(db, "users", uid);
  // Reference to the "addresses" collection for the current user
  const addressCollectionRef = collection(userDocRef, "addresses");

  // Initialize state for checkbox values using an object
  const [checkboxForm, setCheckboxForm] = useState({});

  // State variables for confirmation and error messages
  const [confirmUpdated, setConfirmUpdated] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [errorUpdated, setErrorUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    shippingValue,
    addressValue,
    checkboxValue,
    shipValue,
    setShipValue,
    setManuallyAddress,
    validity,
    errorForm,
    activeFinalForm,
    isFormValid,
    manuallyAddress,
    handleSelectChange,
    handleResetQuery,
    removeLocation,
    saveLocation,
    dataIsEqual,
    hasDefault,
    handleCountryChange,
  } = useShipFormContext();

  // Effect hook to initialize checkbox form state when addresses data changes
  useEffect(() => {
    // Check if addresses data is available
    if (addresses) {
      // Map addresses to create initial checkbox state object
      const initialCheckboxState = addresses.reduce((acc, address) => {
        acc[address.id] = {
          defaultShipping: address.defaultShipping,
          defaultBilling: address.defaultBilling,
        };
        return acc;
      }, {});

      // Set the initial checkbox form state
      setCheckboxForm(initialCheckboxState);
    }
  }, [addresses]); // Dependency array includes addresses data

  // State for storing the ID of the selected address
  const [selectedID, setSelectedID] = useState(null);

  // Memoized sortedAddresses array based on addresses data
  const sortedAddresses = useMemo(() => {
    // Check if addresses data is available or if it's an empty array
    if (!addresses || addresses.length === 0) {
      return [];
    }

    // If there is only one address, return the addresses array directly
    if (addresses.length === 1) {
      return addresses;
    }

    // Otherwise, sort the addresses array
    return addresses.slice().sort((a, b) => {
      // Sort based on defaultShipping and defaultBilling properties
      if (a.defaultShipping !== b.defaultShipping) {
        return b.defaultShipping - a.defaultShipping;
      }
      return b.defaultBilling - a.defaultBilling;
    });
  }, [addresses]); // Dependency array includes addresses data

  useEffect(() => {
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setIsLoadingComponent(false); // Change state to "false" after 3 seconds
    }, 1000);

    // Subscribe to changes in the address collection and dispatch an action to fetch shipping data
    const unsubscribe = onSnapshot(addressCollectionRef, () => {
      dispatch(fetchShippingData());
    });

    // Unsubscribe from the snapshot listener when the component unmounts
    return () => {
      unsubscribe();
    };

    /* Code commented out for clarity */
    /* const unsubscribe = onSnapshot(addressCollectionRef, (doc) => {
    doc.docChanges().forEach((change) => {
       const addressData = change.doc.data();
       const addressId = change.doc.id;
      // Dispatch an action to fetch shipping data when an address is added or modified
      dispatch(fetchShippingData(token));
    });
    return () => {
      unsubscribe();
    }; 
  }); */

    /* Code commented out for clarity */
    /* const unsubscribe = onSnapshot(addressCollectionRef, (doc) => {
    doc.docChanges().forEach(async (change) => {
      const addressData = change.doc.data();
      const addressId = change.doc.id;

      if (change.type === "added") {
        dispatch(fetchShippingData(idToken));
        // Update Redux state when a new address is added
      }
      if (change.type === "modified") {
        dispatch(fetchShippingData(idToken));
        // Update Redux state when an address is modified
      }
      if (change.type === "removed") {
        // Update Redux state when an address is removed
      }
    });

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }); */
  }, []);

  const [checkboxChanged, setCheckboxChanged] = useState(false);

  // Function to handle checkbox changes
  const handleChange = (e, id) => {
    const { name, checked } = e.target;

    // Update the checkbox form state based on the checkbox changes
    setCheckboxForm((prevValue) => {
      return {
        ...prevValue,
        [id]: {
          ...prevValue[id],
          [name]: checked,
        },
      };
    });

    // Update selectedID with the ID of the selected address
    setSelectedID(checked ? id : null);

    // Set checkboxChanged to true to indicate that the checkbox has been changed
    setCheckboxChanged(true);
  };

  useEffect(() => {
    // This effect will be executed whenever selectedID or checkboxChanged changes
    if (selectedID !== null && checkboxChanged) {
      // Call the send function after a delay of 600 milliseconds
      setTimeout(() => {
        send(selectedID);
      }, 600);

      // Reset the value of checkboxChanged to false after execution
      setCheckboxChanged(false);
    }
  }, [selectedID, checkboxChanged]); // Add selectedID and checkboxChanged as dependencies

  async function updateAddressProperty(id, property, message) {
    try {
      // Get the specific document based on the ID
      const docRef = doc(addressCollectionRef, id);

      // Check if the checkbox form value is true for the specified property
      if (checkboxForm[id][property] === true) {
        // Update the specific document with the specified property set to true
        await updateDoc(docRef, { [property]: true });

        // Now that the specific document has been updated, you can execute the logic to set other documents to false
        const querySnapshot = await getDocs(addressCollectionRef);
        await runTransaction(db, async (transaction) => {
          querySnapshot.forEach((doc) => {
            const addressData = doc.data();
            // If the property is true and the document ID is not the same as the current one, update the property to false
            if (addressData[property] === true && doc.id !== id) {
              transaction.update(doc.ref, { [property]: false });
            }
          });
        });

        // Scroll to the top of the page
        window.scrollTo(0, 0);
        showSuccessMessage(message);
      }
    } catch (error) {
      if (error) {
        throw "Error during the process";
      }
    }
  }

  const send = async (id) => {
    try {
      // Use to set defaultShipping
      await updateAddressProperty(
        id,
        "defaultShipping",
        "Default Shipping Address Updated",
      );

      // Use to set defaultBilling
      await updateAddressProperty(
        id,
        "defaultBilling",
        "Default Billing Address Updated",
      );
    } catch (error) {
      if (error) {
        showErrorMessage(error);
      }
    }
  };
  const [showConfirmation, setShowConfirmation] = useState(false);

  const confirmDelete = () => {
    setShowConfirmation(true);
  };

  const cancelConfirmDelete = () => {
    setShowConfirmation(false);
  };

  const deleteAddress = async (e, id) => {
    e.preventDefault();
    try {
      // Get the specific document based on the ID
      const docRef = doc(addressCollectionRef, id);

      // Delete the specific document
      await deleteDoc(docRef);
      cancelConfirmDelete();
      // Listen for changes in the address collection and dispatch an action to update the shipping data
      onSnapshot(addressCollectionRef, () => {
        dispatch(fetchShippingData());
      });
      showSuccessMessage("Address removed successfully."); // Scroll to the top of the page
      window.scrollTo(0, 0);
    } catch (error) {
      showErrorMessage("Error during removing address. Please try again.");
    }
  };

  return (
    <>
      <DashHeader
        /*  backPage="/dashboard" */
        backIcon={<PersonOutline sx={{ fontSize: "1.8rem" }} />}
        title="Addresses"
        icon={<HomeOutlined fontSize="large" />}
      />
      {addresses && addresses.length > 0 && (
        <div className="w-auto bg-slate-100 flex justify-center p-4 rounded-lg md:justify-normal ">
          <div className=" max-w-full w-full">
            <NavigateButton to="add" title="Add New Address" />
          </div>
        </div>
      )}

      <Message />

      <>
        {/*  if there aren't addresses in array */}
        {addresses != null && addresses.length === 0 && (
          <div className=" flex justify-center items-center gap-2 leading-relaxed h-64 w-auto bg-slate-100 p-4 rounded-lg ">
            <div className="flex flex-col items-center gap-2 text-center justify-center w-full xl:w-3/4 flex-wrap">
              {isLoadingComponent ? (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={280}
                />
              ) : (
                <span className="font-semibold text-base lg:text-lg">
                  Currently, you have no address.
                </span>
              )}
              {isLoadingComponent ? (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={280}
                />
              ) : (
                <span className="text-sm lg:text-base">
                  You can create a new one by clicking below.
                </span>
              )}
              {isLoadingComponent ? (
                <Skeleton
                  variant="rounded"
                  width={280}
                  sx={{ marginTop: "0.75rem", marginBottom: "1rem" }}
                  height={45}
                />
              ) : (
                <NavLink
                  to="add"
                  className=" my-3 flex h-12 w-full md:w-72 items-center justify-center rounded-md bg-primary-btn  p-2 font-semibold hover:bg-primary-hover"
                >
                  Add New Address
                </NavLink>
              )}
            </div>
          </div>
        )}
        {/*   address value */}

        {addresses && addresses.length > 0 && (
          <>
            {sortedAddresses.map((address, index) => (
              <React.Fragment key={index}>
                <AddressContainer
                  key={address.id} // Assicurati di fornire una chiave unica per ogni AddressContainer
                  addressesWithDefaultShipping={[address]} // Passa l'indirizzo corrente come array
                  // Puoi passare altre props se necessario
                  checkboxForm={checkboxForm[address.id]}
                  onInputChange={handleChange}
                  loading={isLoadingComponent}
                  deleteAddress={confirmDelete}
                  checkboxValue={checkboxValue}
                />

                <Confirmation
                  showConfirmation={showConfirmation}
                  title="Remove Address"
                  advice="Are you sure you want to delete this address?"
                  label="Address"
                  sendRemoval={(e) => deleteAddress(e, address.id)}
                  cancel={cancelConfirmDelete}
                />
              </React.Fragment>
            ))}
          </>
        )}
      </>
    </>
  );
};

export default Addresses;
